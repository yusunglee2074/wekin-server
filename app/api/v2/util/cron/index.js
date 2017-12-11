const schedule = require('node-schedule')
const model = require('../../../../model')
const moment = require('moment')
const service = require('./../service.js')

exports.batch = _ => {
  schedule.scheduleJob('1 38 * * * *', orderDelete)
  schedule.scheduleJob('1 38 * * * *', readyDelete)
  schedule.scheduleJob('1 38 * * * *', bookingDelete)
  schedule.scheduleJob('1 38 * * * *', checkPointDueDate)
  // schedule.scheduleJob('1 1 19 * * *', checkActivityDueDate)
  //schedule.scheduleJob('1 1 19 * * *', sendSMSToMakerWhenStartDayOnPaidUserExist)
}

/*
 *  결제유저가 있을 경우 시작일 하루 전 저녁에 인원들을 모아서 몽땅 보내준다.
 *  WekinNew를 긁어서 paid인 경우 그리고 시작일이 내일인 경우를 찾아서 메이커에게 문자를 보내준다.
 *  sample = { 'makerTelephone' { maker: 'makerPhone', PaidList: [ ..... ] }, .... }
 */
function sendSMSToMakerWhenStartDayOnPaidUserExist () {
  console.log("참가인원 명단 문자보내기")
  model.WekinNew.findAll({
    where: {
      state: 'paid',
      start_date: {
        $and: {
          $lt: moment().set('hour', 23).set('minute', 59),
          $gt: moment().set('hour', 0).set('minute', 1)
        }
      }
    },
    include: [{ model: model.ActivityNew, include: [{ model: model.Host, attributes: ['tel', 'name', 'email'] }] }, { model: model.User }]
  })
    .then(wekins => {
      let result = {}
      for (let i = 0; i < wekins.length; i++) {
        let item = wekins[i]
        // { 메이커명 : { makerTel: 메이커 폰번, makerEmail: 메이커 메일, paidUsers: [[유저명, 유저폰번], [유저명2, 유저폰번2]....] }
        result[item.ActivityNew.Host.tel] 
          ? result[item.ActivityNew.Host.tel]['paidUsers'].push([item.User.name, item.User.phone]) 
          : result[item.ActivityNew.Host.tel] = { activityTitle: item.ActivityNew.title, makerName: item.ActivityNew.Host.name, makerEmail: item.ActivityNew.Host.email, paidUsers: [[item.User.name, item.User.phone]] }
      }
      for (item in result) {
        let user = ''
        for (let i = 0; i < result[item].paidUsers.length; i++) {
          let wekiner = result[item].paidUsers[i]
          user = user + wekiner[0] + ' 님' + wekiner[1] + '\n'
        }
        let msg = `안녕하세요. ${ result[item].makerName }님 위킨입니다.\n [${ result[item].activityTitle }] 활동 내일 참여 위키너 명단입니다.\n특이사항 있으시면 유선전화나 카카오톡 @위킨으로 연락바랍니다.\n\n참여 위키너 목록\n${ user }\n감사합니다.`
        service.sendSms(item, msg, "[위킨] 참여자명단")
      }
    })
}

function checkActivityDueDate() {
  console.log("엑티비티종료 시작 -크론")
  model.ActivityNew.findAll({
    where: {
      end_date: {
        $lt: moment()
      },
      status: 3
    },
    include: [{ model: model.Host }]
  })
    .then(activities => {
      let length = activities.length
      for (let i = 0; i < length; i++) {
        let activity = activities[i]
        service.sendSms(activity.Host.tel, `안녕하세요. 메이커님\n${ activity.title } 활동이 종료되었습니다.\n날짜는 웹사이트의 [메이커 > 위킨설정]에서 수정, 추가가 가능합니다.\n자세한 사항은 http://www.we-kin.com 에서 살펴보실 수 있습니다.\n감사합니다.`)
        activity.update({ status: 5 })
      }
    })
    .catch(error => {
      console.log(error)
    })
}

// TODO: transaction 처리, 로직이 조금 이상함
function checkPointDueDate () {
  console.log("포인트딜릿 시작 -크론")
  let endDueDatePoint = []
  model.Point.findAll({
    where: {
      due_date_be_written_days:  { $lt: moment() },
      type: { $in: [0, 1] }
    }
  })
    .then(points => {
      for (let i = 0; i < points.length; i++) {
        model.User.findById(points[i].user_key)
          .then(user => {
            if (points[i].type === 1) {
              user.point.point_special -= points[i].point_change
              points[i].destroy()
            } else {
              user.point.point -= points[i].point_change
              points[i].destroy()
            }
          })
          .catch( err => {
            console.log("에러")
            console.log("error: " + err)
          })
      }
    })
    .catch(err => {
      console.log("에러")
      console.log("error: " + err)
    })
}
function orderDelete () {
  console.log("오더딜릿 시작 -크론")
  model.Order.findAll({
    where: {
      status: 'order',
      order_at: {
        $lt: moment().add(-1, 'hours')
      }
    }
  })
    .then(r => {
      let stack = []

      r.forEach(v => {
        stack.push(
          model.WekinNew.destroy({
            where: {
              wekin_key: v.wekin_key,
              state: {
                $not: 'paid'
              }
            }
          })
        )
        stack.push(
          model.Order.destroy({where: {
            order_key: v.order_key
          }, returning: true}))
      })

      return Promise.all(stack)
    })
    .catch(e => {
      console.log("에러")
      console.log(e)
    })
}


function readyDelete() {
  console.log("레디딜릿 시작 -크론")
  model.Order.findAll({
    where: {
      status: 'ready',
      order_at: {
        $lt: moment().add(-1, 'days')
      }
    }
  })
    .then(r => {
      let stack = []
      r.forEach(v => {
        stack.push(model.WekinNew.destroy({ where: { wekin_key: v.wekin_key } }))
        stack.push(
          model.Order.destroy({where: {
            order_key: v.order_key
          }, returning: true}))
      })

      return Promise.all(stack)
    })
    .catch(e => {
      console.log("에러")
      console.log(e)
    })
}

function bookingDelete() {
  console.log("북킹딜릿 시작 -크론")
  let stack= []
  model.WekinNew.findAll({
    where: {
      state: 'booking',
      updated_at: {
        $lt: moment().add(-1, 'hours')
      }
    }
  })
    .then(wekins => {
      let length = wekins.length
      for (let i = 0; i < length; i++) {
        let wekin = wekins[i]
        stack.push(model.WekinNew.destroy({ where: { wekin_key: wekin.wekin_key } }))
      }
      Promise.all(stack)
        .then( result => {
          return result
        })
        .catch(e => {
          console.log("에러")
          console.log(e)
        })
    })
}

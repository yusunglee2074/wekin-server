const schedule = require('node-schedule')
const model = require('../../../../model')
const moment = require('moment')
const service = require('./../service.js')
const process = require('process')

exports.batch = _ => {
  if (isProductionEnv()) {
  // if (!isProductionEnv()) {
    schedule.scheduleJob('38 * * * *', orderDelete)
    schedule.scheduleJob('38 * * * *', readyDelete)
    schedule.scheduleJob('38 * * * *', bookingDelete)
    schedule.scheduleJob('38 * * * *', checkPointDueDate)
    schedule.scheduleJob('1 19 * * *', checkActivityDueDate)
    schedule.scheduleJob('49 15 * * *', sendSMSToMakerWhenStartDayOnPaidUserExist)
    schedule.scheduleJob('0 3 * * *', compressActivityStartDateList)
  }
}


function isProductionEnv () {
  if (process.env.USER !== 'yusunglee') return true
  else return false
}

function compressActivityStartDateList () {
  console.log("start_date_list 압축시작")
  model.ActivityNew.findAll({
    where: {
      status: 3
    }
  })
  .then(activities => {
    let promiseList = []
    for (let i = 0; i < activities.length; i++) {
      let item = activities[i]
      let count = 0
      for (let ii = 0; ii < item.start_date_list.length; ii++) {
        let date = item.start_date_list[ii]
        if (moment(date) - moment().add(-2, 'days') > 0) {
          count = ii
          break
        }
      }
      item.start_date_list.splice(0, count)
      item.set('start_date_list', item.start_date_list)
      promiseList.push(item.save())
    }
    return Promise.all(promiseList)
  })
  .then(result => {
    console.log("성공")
  })
  .catch(error => {
    console.log(error)
    console.log('에러')
    console.log("#################################실패")
  })
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
      state: { $in : ['paid', 'ready'] },
      start_date: {
        $and: {
          $lte: moment().add(1, 'day').set('hour', 23).set('minute', 59).set('second', 59),
          $gte: moment().add(1, 'day').set('hour', 0).set('minute', 0).set('second', 0)
        }
      }
    },
    include: [{ model: model.ActivityNew, include: [{ model: model.Host, attributes: ['host_key', 'tel', 'name', 'email'] }] }, { model: model.User }]
  })
    .then(wekins => {
      console.log(wekins)
      let result = {}
      // 위킨들을 돌면서 엑티비티 별로 묶은 다음 해당 명단을 보낸다.
      for (let i = 0; i < wekins.length; i++) {
        let item = wekins[i]
        result[item.ActivityNew.activity_key] 
          ? result[item.ActivityNew.activity_key]['paidUsers'].push([item.User.name, item.User.phone, item.state, moment(item.start_time).format('HH:mm')]) 
          : result[item.ActivityNew.activity_key] = { activityTitle: item.ActivityNew.title, makerTel: item.ActivityNew.Host.tel, makerName: item.ActivityNew.Host.name, makerEmail: item.ActivityNew.Host.email, hostKey: item.ActivityNew.Host.host_key, paidUsers: [[item.User.name, item.User.phone, item.state, moment(item.start_time).format('HH:mm')]] }
      }
      for (item in result) {
        let user = ''
        for (let i = 0; i < result[item].paidUsers.length; i++) {
          let wekiner = result[item].paidUsers[i]
          user = user + wekiner[0] + ' 님' + (wekiner[2] === 'ready' ? '(무통장결제대기)' : '(결제완료)') + '\n' + wekiner[1] + ' ' + wekiner[3] + '\n'
        }
        let msg = `안녕하세요. ${ result[item].makerName }님 주식회사 위킨입니다.\n [${ result[item].activityTitle }] 활동 내일 참여 위키너 명단입니다.\n참여 위키너 목록\n${ user }\n해당 위킨이 취소될 예정이라면 아래 주소로 접속해서 꼭 고객분들께 문자가 갈 수 있도록 부탁드립니다.! \n http://we-kin.com/ask-the-maker-to-process-or-not?host_key=${result[item].hostKey}&activityKey=${item}&paidCount=${result[item].paidUsers.length}\n그 외 특이사항은 유선전화, 카카오톡 @위킨으로 연락바랍니다.\n감사합니다.`
        service.sendSms(result[item].makerTel, msg, "[위킨] 참여자명단")
      }
    })
}

function checkActivityDueDate() {
  console.log("엑티비티종료 시작 -크론")
  model.ActivityNew.findAll({
    where: {
      end_date: {
        $lt: moment().add(9, 'hour')
      },
      status: 3
    },
    include: [{ model: model.Host }]
  })
    .then(activities => {
      let length = activities.length
      for (let i = 0; i < length; i++) {
        let activity = activities[i]
        activity.update({ status: 5 })
        service.sendSms(activity.Host.tel, `안녕하세요. 메이커님\n${ activity.title } 활동이 종료되었습니다.\n날짜는 웹사이트의 [메이커 > 위킨설정]에서 수정, 추가가 가능합니다.\n자세한 사항은 http://www.we-kin.com 에서 살펴보실 수 있습니다.\n감사합니다.`)
      }
    })
    .catch(error => {
      console.log("에러")
      console.log(error)
    })
}

// TODO: transaction 처리, 로직이 조금 이상함
function checkPointDueDate () {
  console.log("포인트딜릿 시작 -크론")
  let endDueDatePoint = []
  model.Point.findAll({
    where: {
      due_date_be_written_days:  { $lt: moment().add(9, 'hour') },
      type: { $in: [0, 1] }
    }
  })
    .then(points => {
      for (let i = 0; i < points.length; i++) {
        model.User.findById(points[i].user_key)
          .then(user => {
            if (points[i].type === 1) {
              user.set('point.point_special', user.point.point_special - points[i].point_change)
              points[i].destroy()
            } else {
              user.set('point.point', user.point.point - points[i].point_change)
              points[i].destroy()
            }
            user.save()
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
        $lt: moment().add(-60, 'minutes')
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
        $lt: moment().add(-3, 'days')
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

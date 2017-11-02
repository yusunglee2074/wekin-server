const schedule = require('node-schedule')
const model = require('../../../../model')
const moment = require('moment')

exports.batch = _ => {
  schedule.scheduleJob('*/50 * * * *', orderDelete)
  schedule.scheduleJob('*/48 * * * *', readyDelete)
  schedule.scheduleJob('* */45 * * * *', bookingDelete)
  schedule.scheduleJob('* 0 * * *', checkPointDueDate)
}


// TODO: transaction 처리, 로직이 조금 이상함

function checkPointDueDate () {
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
          model.WekinNew.destory({
            where: {
              wekin_key: v.wekin_key
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
        stack.push(
          model.WekinNew.destory({
            where: {
              wekin_key: v.wekin_key
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

function bookingDelete() {
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

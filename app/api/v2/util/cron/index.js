const schedule = require('node-schedule')
const model = require('../../../../model')
const moment = require('moment')

exports.batch = _ => {
  schedule.scheduleJob('*/50 * * * *', orderDelete)
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
            console.log("error: " + err)
          })
      }
    })
    .catch(err => {
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
      model.Order.destroy({where: {
        order_key: v.order_key
      }, returning: true}))
    })
    
    return Promise.all(stack)
  })
  .catch(e => {
    console.log(e)
  })
}

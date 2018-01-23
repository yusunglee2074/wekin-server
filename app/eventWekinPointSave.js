const model = require('./model')
const moment = require('moment')


// 이벤트 위킨 포인트 적립
model.Order.findAll({
  where: {
    status: 'paid',
    created_at: {
      $gt: moment('2018-01-01')
    }
  },
  include: [{
    model: model.WekinNew, 
    include: [{ 
      model: model.ActivityNew, 
      where: { 
        activity_key: {
          $in: [96,98,110,129,146,150,152,179,195,208,222,234,249,258,262,274,275,284,291,300,460,462,463,466,469,484,494,495,498,507,511,518,521,522,523,525,528,537,538,539,544,547,549,550,553,555]
        }
      },
      required: true
    }],
    required: true
  }]
})

  .then(orders => {
    for (let i = 0; i < orders.length; i++) {
      let wekin = orders[i].WekinNew
      console.log(wekin.user_key)
    }
  })

let model = require('./model')
let moment = require('moment')





model.Host.findAll({ where: { status: 3 }, include: [{ model: model.ActivityNew }] })
  .then(hosts => {
    for (let i = 0; i < hosts.length; i++) {
      let host = hosts[i]
      if (host.created_at < moment('2018-01-01')) {
        for (let ii = 0; ii < host.ActivityNews.length; ii++) {
          let activity = host.ActivityNews[ii]
          model.ActivityNew.update({ comision: 15 }, { where: { activity_key: activity.activity_key }})
        }
      } else {
        host.ActivityNews.sort((a, b) => {
          if (moment(a.created_at) < moment(b.created_at)) return -1
          else return 1
        })
        if (host.ActivityNews.length !== 0 ? moment(host.ActivityNews[0].created_at) > moment('2018-01-09') : false) {
          for (let ii = 0; ii < host.ActivityNews.length; ii++) {
            let activity = host.ActivityNews[ii]
            model.ActivityNew.update({ comision: 0 }, { where: { activity_key: activity.activity_key }})
          }
        } else {
          for (let ii = 0; ii < host.ActivityNews.length; ii++) {
            let activity = host.ActivityNews[ii]
            model.ActivityNew.update({ comision: 15 }, { where: { activity_key: activity.activity_key }})
          }
        }
      }
      
    }
  })
  .catch(error => console.log(error))

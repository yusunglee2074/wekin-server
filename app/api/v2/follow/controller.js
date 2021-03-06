const model = require('../../../model')
const returnMsg = require('../../../return.msg')

exports.getTargetData = (req, res, next) => {
  model.Follow.findAll({
    attributes: ['created_at'],
    where: { follower_user_key: req.params.user_key, user_key: {$ne: req.params.user_key} },
    include: [{
      attributes: ['user_key', 'name', 'profile_image'], 
      model: model.User,
      as: 'User',
      include: { model: model.Host, attributes: ['status', 'type', 'host_key', 'name', 'profile_image'] }
    }, {
      attributes: ['user_key', 'name', 'profile_image'], 
      model: model.User,
      as: 'Follower'
    }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => { next(val) })
}

exports.getData = (req, res, next) => {
  model.Follow.findAll({
    attributes: ['created_at'],
    where: { user_key: req.params.user_key },
    include: [{
      attributes: ['user_key', 'name', 'profile_image'],
      as: 'Follower',
      model: model.User,
      include: { model: model.Host, attributes: ['introduce', 'status', 'type', 'host_key', 'name', 'profile_image', 'user_key'] }
    }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => next(val) )
}

exports.putData = (req, res, next) => {
  model.sequelize.transaction(t => {
    
    return model.Follow.find({
      where: {
        user_key: req.params.user_key,
        follower_user_key: req.params.follower_user_key  
      },
      transaction: t
    })
    .then(v => {
      if(v) {
        return model.Follow.destroy({
          where: {
            user_key: req.params.user_key,
            follower_user_key: req.params.follower_user_key
          },
          returning: true,
          transaction: t
        })
        .then(result => returnMsg.success200RetObj(res, result))
        .catch(val => next(val) )
        
      } else {
        return model.Follow.create({
          user_key: req.params.user_key,
          follower_user_key: req.params.follower_user_key
        }, {
          transaction: t
        })
        .then(result => returnMsg.success200RetObj(res, result))
        .catch(val => next(val) )
      }
    })
  })
}

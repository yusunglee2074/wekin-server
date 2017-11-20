const model = require('../../../model')

exports.getFollowList = (user_key) => {
  model.Follow.findAll({
    where: { follower_user_key: user_key, user_key: {$ne: user_key} },
    include: [{
      attributes: ['user_key', 'name', 'profile_image'], 
      model: model.User,
      as: 'User',
      include: { model: model.Host, attributes: ['status', 'type'] }
    }]
  })
}
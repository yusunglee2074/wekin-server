const model = require('../../../model')
const returnMsg = require('../../../return.msg')

exports.getData = (req, res) => {
  model.Favorite.findAll({
    group: ['Activity.activity_key', 'Favorite.fav_key', 'Activity->Host.host_key'],
    where: { user_key: req.params.user_key },
    include: [{
      attributes: [
          'activity_key', 'status', 'host_key', 'main_image', 'title', 'intro_summary', 'address_detail', 'price', 'created_at','address',
          [model.Sequelize.fn('AVG', model.Sequelize.col('Activity->Docs.activity_key')), 'rating_avg'],
          [model.Sequelize.fn('COUNT', model.Sequelize.col('Activity->Docs.activity_key')), 'review_count'],
          [model.Sequelize.fn('COUNT', model.Sequelize.col('Favorite')), 'total']
        ],
      model: model.Activity,
        include: [{ model: model.Host }, { model: model.Doc, attributes: [], where: { type: 1 }, required: false }] }]
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(val => {
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val)
  })
}


exports.putData = (req, res) => {
  model.sequelize.transaction(t => {
    
    return model.Favorite.find({
      where: {
        user_key: req.params.user_key,
        activity_key: req.params.activity_key
      },
      transaction: t
    })
    .then(v => {
      if(v) {
        return model.Favorite.destroy({
          where: {
            user_key: req.params.user_key,
            activity_key: req.params.activity_key
          },
          returning: true,
          transaction: t
        })
        .then(result => returnMsg.success200RetObj(res, result))
        .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
        
      } else {
        return model.Favorite.create({
          user_key: req.params.user_key,
          activity_key: req.params.activity_key
        }, {
          transaction: t
        })
        .then(result => returnMsg.success200RetObj(res, result))
        .catch(val => { returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', val) })
      }
    })
  })
}

const model = require('../../../model')

exports.getMainActivityModel = (activity_key) => {
  return new Promise((resolve, reject) => {
    model.Activity.findOne({
      attributes: ['activity_key', 'main_image', 'title', 'price',
        [model.Sequelize.fn('AVG', model.Sequelize.col('Docs.activity_rating')), 'rating_avg'],
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Favorites.fav_key')), 'favorite_count'],
        [model.Sequelize.fn('COUNT', model.Sequelize.col('Docs.doc_key')), 'review_count']
      ],
      group: ['Activity.activity_key', 'Host.host_key', 'Favorites.fav_key', 'Wekins.wekin_key'],
      where: { activity_key: activity_key },
      include: [
        {
          attributes: ['host_key', 'profile_image', 'name'],
          model: model.Host
        }, {
          attributes: ['wekin_key', 'max_user', 'start_date', [model.Sequelize.fn('COUNT', model.Sequelize.col('Wekins->Orders.order_key')), 'current_user']],
          model: model.Wekin,
          include: { model: model.Order, attributes: [], where: { status: {$in: ['order', 'ready', 'paid']} }, required: false }
        }, { model: model.Favorite, attributes: [], required: false }, { model: model.Doc, attributes: [], where: { type: 1 }, required: false }
      ]
    })
    .then(resolve).catch(reject)
  })
}

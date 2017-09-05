const model = require('../../../model')
const userService = require('../user/service')
const activityService = require('../activity/service')
const docService = require('../doc/service')
const hostService = require('../host/service')
const followService = require('../follow/service')


const ADMIN_KEY = 2

let postNotiByAdmin = (target, name, active, msg) => {
  return new Promise((reslove, reject) => {
    let tmp = {}

    model.User.findById(target)
    .then(v => {
      tmp.target = v
      return model.Noti.create({
        user_key: ADMIN_KEY,
        user_name: '위킨',
        target_user_key: tmp.target.user_key,
        target_user_name: tmp.target.name,
        active_name: name,
        active_target: active,
        message_text: msg,
        type: 'admin'
      })
    })
  })
}

let postNotiByHost = (me, target, active, msg) => {
  return new Promise((reslove, reject) => {
    let tmp = {}

    model.User.findById(me)
    .then(v => {
      tmp.me = v
      return model.User.findById(target)
    })
    .then(v => {
      tmp.target = v
      return model.Noti.create({
        user_key: tmp.me.user_key,
        user_name: tmp.me.name,
        target_user_key: tmp.target.user_key,
        target_user_name: tmp.target.name,
        active_name: active.name,
        active_target: active.target,
        message_text: msg,
        type: 'host'
      })
    })
  })
}

let postNotiByUser = (me, target, active, msg) => {
  return new Promise((reslove, reject) => {
    let tmp = {}

    model.User.findById(me)
    .then(v => {
      tmp.me = v
      return model.User.findById(target)
    })
    .then(v => {
      tmp.target = v
      return model.Noti.create({
        user_key: tmp.me.user_key,
        user_name: tmp.me.name,
        target_user_key: tmp.target.user_key,
        target_user_name: tmp.target.name,
        active_name: active.name,
        active_target: active.target,
        message_text: msg,
        type: 'user'
      })
    })
  })
}

/*
let postNoti = (me, target, active, msg) => {
  return new Promise((resolve, reject) => {
    model.Noti.create({
      user_key: me.user_key,
      user_name: me.name,
      target_user_key: target.user_key,
      target_user_name: target.name,
      active_name: active.name,
      active_target: active.target,
      type: active.type,
      message_text: msg,
      extra: JSON.parse(active.extra)
    })
    .then(resolve).catch(reject)
  })
}
*/

exports.getNotiList = (me) => {
  return new Promise((resolve, reject) => {
    model.Noti.findAll({
      where: {
        target_user_key: me.user_key
      },
      order: [['created_at', 'DESC']],
      include: {
        attributes: ['user_key', 'profile_image'],
        model: model.User,
        as: 'User',
        include: {
          attributes: ['host_key', 'profile_image'],
          model: model.Host
        }
      }
    })
    .then(resolve).catch(reject)
  })
}

/**
 * 메이커신청 승인
 */
exports.approveHost = (user_key) => {
  postNotiByAdmin(user_key, '메이커 신청', '승인', '메이커 신청을 승인되었습니다.')
}
/**
 * 위킨이 태그된 글에대한 동작
 * - 나의 위킨에 QNA
 * - 나의 위킨에 대한 후기
 */
exports.postNotiActiviryKey = (user_key, activity_key, target) => {
  activityService.getActivityByKey(activity_key)
  .then(activity => {
    if (target === '후기') {
      postNotiByUser(user_key, activity.Host.User.user_key, {name: activity.title, target: target}, '후기에 댓글이 추가되었습니다.')  
    } else if (target === '질문') {
      postNotiByUser(user_key, activity.Host.User.user_key, {name: activity.title, target: target}, '질문에 댓글이 추가되었습니다.')
    }
  })
}
/**
 * 나의 위킨이 태그된 후기에 좋아요
 */
exports.wekinTagLike = (user_key, doc_key) => {
  docService.getDocByKey(doc_key)
  .then(doc => {
    postNotiByUser(user_key, doc.Activity.Host.User.user_key, {name: doc.Activity.title, target: '좋아요'}, '후기에 좋아요가 추가되었습니다.')
  })
}
/**
 * 나의 위킨이 태그된 후기에 댓글, 내가 작성한 피드에 댓글
 */ 
exports.wekinTagComment = (user_key, doc_key) => {
  docService.getDocByKey(doc_key)
  .then(doc => {
    if(doc.Activity) {
      postNotiByUser(user_key, doc.Activity.Host.User.user_key, {name: doc.Activity.title, target: '댓글'}, '위킨이 태그된 글에 댓글이 추가되었습니다.')
    }
    if (user_key !== doc.user_key) {
      postNotiByUser(user_key, doc.user_key, {name: '피드', target: '댓글'}, '작성한 피드에 댓글이 추가되었습니다.')
    }
  })
}
/**
 * 위킨 대기신청
 */
exports.waitingApply = (user_key, target_key) => {
  postNotiByUser(user_key, target_key, {name: '위킨', target: '대기'}, '대기신청을 하였습니다.')
  postNotiByHost(target_key, user_key, {name: '위킨', target: '대기'}, '대기신청이 완료되었습니다.')
}
/**
 * 위킨 대기 예약가능 
 */
exports.waitingBookable = order => {
  postNotiByHost(order.host_key, order.user_key, {name: '위킨', target: '참석'}, '참석이 가능합니다.')
}
/**
 * 위킨 구매시
 */
exports.wekinPay = order => {
  postNotiByUser(order.user_key, order.host_key, {name: '위킨', target: '구매'}, '구매하였습니다.')
  postNotiByHost(order.host_key, order.user_key, {name: '위킨', target: '구매'}, '구매하였습니다.')
}
/**
 * 내가 작성한 QNA에 댓글
 */
exports.qnaReply = doc_key => {
  docService.getDocByKey(doc_key)
  .then(doc => {
    postNotiByHost(doc.Activity.Host.User.user_key, doc.user_key, {name: doc.Activity.title, target: '답변'}, '답변이 추가되었습니다.')
  })
}
/**
 * 내가 작성한 글에 좋아요
 */
exports.docLike = (user_key, doc_key) => {
  docService.getDocByKey(doc_key)
  .then(doc => {
    postNotiByUser(user_key, doc.user_key, {name: doc.type, target: '좋아요'}, '좋아요가 추가되었습니다.')
  })
}
/**
 * 팔로우한 메이커가 신규 위킨 등록
 */
exports.activityNotiToFollow = (activity) => {
  let stack = []
  hostService.getHostByKey(activity.host_key)
  .then(host => {
    return followService.getFollowList(host.User.user_key)
  })
  .then(followList => {
    followList.forEach(v => {
      v.User.user_key
      stack.push(postNotiByHost(host.User.user_key, v.User.user_key, {name: activity.title, target: '위킨등록'}), '메이커가 신규 위킨을 등록하였습니다.')
    })
    Promise.all(stack)
  })
}

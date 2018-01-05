const sms = require('../../../util/sms')
const mail = require('../../../util/mail')
const slack = require('../../../util/slack')
const wekinService = require('../wekin/service')
const orderService = require('../order/service')
const userService = require('../user/service')
const hostService = require('../host/service')
const moment = require('moment')
const WEKIN_MAIL = 'wekin@wekiner.com'
// const WEKIN_MAIL = 'haneu89@naver.com'
const MAIL_HEADER = `<img src="https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/mail%2Fmail_top.jpg?alt=media" style="width: 100%;">`
const MAIL_FOOTER = `<img src="https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/mail%2Fmail_bottom.jpg?alt=media" style="width: 100%;">`

let MAIL_FORM = (textarea, bodyarea, buttonarea) => {
  return `<div style="width: 600px; margin: 0 auto;">
  ${MAIL_HEADER}
  <div style="background-color: #D3D3D5; width: 100%; text-align: center; padding: 10px 0;">
    <p style="padding: 0 30px; line-height: 40px;">
      ${textarea}
    </p>
  </div>
  <div style="width: 100%; text-align: center; padding: 10px 0;">
    ${bodyarea}
  </div>
  <div style="background-color: #D3D3D5; width: 100%; text-align: center; padding: 10px 0;">
    ${buttonarea}
  </div>
  ${MAIL_FOOTER}
</div>`
}
let MAIL_TEXT_FORM = (textitle, textbody, button) => {
  return MAIL_FORM(
  textitle, 
  `<div style="width: 500px; text-align: left; margin: 0 auto; padding: 80px 0; line-height: 30px;">
  ${textbody}
  </div>`,
  `<p style="padding: 0 30px;">
    ${button}
  </p>`)
}

exports.sendMail = (to, title, msg) => {
  return new Promise((resolve, reject) => {
    mail.sendMail(to, title, msg)
    .then(resolve).catch(reject)
  })
}

exports.sendSms = (to, msg, title = '위킨') => {
  return new Promise((resolve, reject) => {
    sms.sendSms(to, msg, title)
    .then(resolve).catch(reject)
  })
}
exports.sendSmsShort = (to, msg) => {
  return new Promise((resolve, reject) => {
    sms.sendSmsShort(to, msg)
    .then(resolve).catch(reject)
  })
}

exports.slackLog = (msg) => {
  return new Promise((resolve, reject) => {
    slack.sendMsg('#_jinhyung', 'wekin', JSON.stringify(msg))
    .then(resolve).catch(reject)
  })
}


/**
 * 무통장 입금시
 */
exports.sendOrderReadySms = (objectData) => {
  return new Promise((resolve, reject) => {
    let msg = `${objectData.user_name} 위키너님, [${objectData.wekin_name}] 위킨을 신청해 주셔서 정말 감사합니다. 가상계좌 유효기간은 결제시각으로부터 48시간오니 그 전에 입금을 해주셔야 하며, 이후에는 자동으로 가상계좌가 닫히게 되므로 이 점 유의하여 주시기 바랍니다.\n\n은행명 : ${objectData.order_extra.vbank_name}\n계좌번호 : ${objectData.order_extra.vbank_num}\n예금주 : ${objectData.order_extra.vbank_holder}\n입금 금액 : [${objectData.order_total_price}]원\n\n* 문의\n- 위키너카카오톡: @위킨\n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
    this.sendSms(objectData.user_phone, msg, `[위킨] 입금 대기 중`)
    .then(_ => resolve(objectData)).catch(reject)
  })
}
/**
 * 
 */
exports.sendOrderCancellRequest = (objectData) => {
  return new Promise((resolve, reject) => {
    let msg = `[${objectData.user_name}] 위키너님, [${objectData.wekin_name}]에 대한 취소요청이 정상 접수 되었습니다. 취소 처리가 완료되면 다시 안내드리겠습니다. 추가적인 문의사항은 아래번호로 연락 바랍니다. 감사합니다.\n\n* 문의\n* 위키너카카오톡 : @위킨\n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
    this.sendSms(objectData.user_phone, msg, `[위킨] 취소 요청 접수`)
    .then(_ => resolve(objectData)).catch(reject)
  })
}

// 환불요청시 메이커에게 문자
exports.sendOrderCancellRequestToHost = (userName, start_date, ActivityName, hostTel, hostName) => {
  return new Promise((resolve, reject) => {
    let msg = `[${hostName}] 메이커님, [${ActivityName}]에 대한 참가취소 요청이 한 건 접수 되었습니다.\n 취소자: ${ userName },\n 신청활동일:${ start_date }, \n  추가적인 문의사항은 아래번호로 연락 바랍니다. 감사합니다.\n\n* 문의\n* 전화번호:031-211-0410 \n* 위키너카카오톡 : @위킨\n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
    this.sendSms(hostTel, msg, `[위킨] 취소 요청 접수`)
    .then(_ => resolve(hostName)).catch(reject)
  })
}
exports.sendOrderConcellSuccess = (objectData) => {
  return new Promise((resolve, reject) => {
    let msg = `[${objectData.user_name}] 위키너님, [${objectData.wekin_name}]에 대한 취소 처리가 완료되었습니다. 신용카드로 결제한 경우 전표 취소까지 카드사에 따라 2~5일정도 소요될 수 있으며, 혹은 가상계좌에 입금의 경우 은행 영업일 기준 2~3일 정도 소요될 수 있음을 알려드립니다.\n추가적인 문의사항은 아래번호로 연락 바랍니다. 감사합니다.\n\n* 문의\n* 위키너카카오톡 : @위킨\n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
    this.sendSms(objectData.user_phone, msg, `[위킨] 취소 완료`)
    .then(_ => resolve(objectData)).catch(reject)
  })
}


/**
 * 가입 완료 후
 */
exports.senJoinAfterLms = (user) => {
  return new Promise((resolve, reject) => {
    let msg = `${user.name}님 위키너가 되신것을 축하 드립니다! 앞으로 우리(We)와 즐(KIN)거운 위킨 함께해요 ~^^\n위킨 구경하기 ☞ http://m.we-kin.com\n\n* 문의\n-위키너카카오톡: @위킨\n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
    this.sendSms(user.phone, msg, `[위킨] 가입완료`)
    .then(resolve).catch(reject)
  })
}
exports.sendJoinAfterMail = (user) => {
  return new Promise((resolve, reject) => {
    let msg = MAIL_FORM(
      `${user.name}님, 위키너가 되신 것을 축하드립니다!<br>
        앞으로 우리(WE)와 즐(KIN) 거운 위킨 함께해요`,
      `<img src="https://firebasestorage.googleapis.com/v0/b/wekin-9111d.appspot.com/o/mail%2Fmail_intro.png?alt=media" style="width: 100%;">`,
      `<p style="padding: 0 30px;">
        <a href="http://we-kin.com" target="new"><button style="width: 200px; height: 50px; background-color: #0263AF; border: 0; border-radius: 5px; color: white; font-size: 20px;">위킨 보기</button></a>
      </p>`
    )
    this.sendMail(user.email, `[위킨] 가입이 완료되었습니다.`, msg)
    .then(resolve).catch(reject)
  })
}

/** 
 * 대기신청 완료 후
 */
exports.sendWaitingRequestLms = (user, activity) => {
  return new Promise((resolve, reject) => {
    const SMS_MESSAGE = `${user.name} 위키너님 대기 신청이 완료되었습니다. 자리가 생기면 바로 알려 드릴게요! 기다리는 동안 비슷한 분야의 다른 위킨도 한 번 보세요~  다른 위킨 보기 ☞ http://we-kin.com\n\n* 문의\n- 위키너카카오톡: @위킨\n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
    this.sendSms(user.phone, SMS_MESSAGE, `[위킨] 대기신청 완료 `)
    .then(resolve).catch(reject)
  })
}

exports.sendWaitingRequestMail = (user, wekin) => {
  return new Promise((resolve, reject) => {
    const MAIL_MESSAGE = MAIL_FORM(
      `${user.name}위키너님, 대기 신청 완료!<br>
        자리가 생기면 빠르게 알려드릴게요.`,
      `<img src="${wekin.Activity.main_image.image[0]}" width="500px">
      <div style="width: 400px; text-align: left; margin: 0 auto;">
        <h3 style="color: #851A1B; text-align: center;">${wekin.Activity.title}</h3>
        시작 일자 : ${moment(wekin.start_date).format('YYYY-MM-DD HH:mm')}<br>
        신청 마감 :${wekin.due_date}<br>
      </div>
      <div style="width: 400px; margin: 0 auto; font-size: 20px; margin-top: 100px;">
        <p>기다리는 동안 다른 위킨들도 구경해보세요.</p>
        <p>더 다양한 위킨들이 위키너님을 기다리고 있어요</p>
      </div>`,
      `<p style="padding: 0 30px;">
        <a href="http://we-kin.com" target="new"><button style="width: 200px; height: 50px; background-color: #0263AF; border: 0; border-radius: 5px; color: white; font-size: 20px;">다른 위킨 보기</button></a>
      </p>`
    )
    this.sendMail(user.email, `[위킨] 참가신청이 완료되었습니다.`, MAIL_MESSAGE)
    .then(resolve).catch(reject)
  })
}
/**
 * 대기신청 후, 빈자리 발생 시
 */
exports.sendWaitingSms = (user, wekin) => {
  return new Promise((resolve, reject) => {
    const SMS_MESSAGE = `${user.name} 위키너님 대기신청 하신 위킨에 자리가 났습니다! 바로 지금이에요!선착순이니 서둘러 예약하세요.\n\n위킨 신청하기 ☞ http://m.we-kin.com/activity/${wekin.Activity.activity_key}\n\n* 문의\n- 위키너카카오톡: @위킨\n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
    this.sendSms(user.phone, SMS_MESSAGE, `[위킨] 대기신청 위킨`)
    .then(resolve).catch(reject)
  })
}

exports.sendWaitingMail = (user, wekin) => {
  return new Promise((resolve, reject) => {
    const MAIL_MESSAGE = MAIL_FORM(
      `${user.name}위키너님, 지금이에요!`,
      `<img src="${wekin.Activity.main_image.image[0]}" width="500px">
      <div style="width: 400px; text-align: left; margin: 0 auto;">
        <h3 style="color: #851A1B; text-align: center;">${wekin.Activity.title}</h3>
        시작 일자 : ${moment(wekin.start_date).format('YYYY-MM-DD HH:mm')}<br>
        신청 마감 :${wekin.due_date}<br>
      </div>
      <div style="width: 400px; margin: 0 auto; font-size: 20px; margin-top: 100px;">
        <p>기다리는 동안 다른 위킨들도 구경해보세요.</p>
        <p>더 다양한 위킨들이 위키너님을 기다리고 있어요</p>
      </div>`,
      `<p style="padding: 0 30px;">
        <a href="http://we-kin.com" target="new"><button style="width: 200px; height: 50px; background-color: #0263AF; border: 0; border-radius: 5px; color: white; font-size: 20px;">다른 위킨 보기</button></a>
      </p>`
    )
    this.sendMail(user.email, `[위킨] 참가신청이 가능합니다.`, MAIL_MESSAGE)
    .then(resolve).catch(reject)
  })
}
exports.sendOrderConfirm = order => {
  let stack = []
  stack.push(sendOrderConfirmSms(order))
  stack.push(sendOrderConfirmSmsToMaker(order))
  stack.push(sendOrderConfirmMail(order))
  return Promise.all(stack)
}
/**
 * 결제 성공시
 */
exports.sendOrderConfirmSms = (objectData) => {
  return new Promise((resolve, reject) => {
    wekinService.getWekinByKey(objectData.wekin_key)
    .then(wekin => {
      let msg = `${objectData.user_name} 위키너님 [${objectData.wekin_name}] 우리(We)와 함께 즐(KIN)길 준비 되셨나요?\n\n-- 위킨 시작 일: ${moment(wekin.start_date).format('YYYY-MM-DD')}\n- 시작 시각:  ${moment(wekin.start_time).format('HH:mm')}\n- 메이커: ${objectData.wekin_host_name}\n- 장소: ${wekin.ActivityNew.address_detail.meet_area}\n- 준비물: ${wekin.ActivityNew.preparation}\n- 예약인원: ${objectData.wekin_amount}\n\n\n* 문의\n- 위키너카카오톡: @위킨\n- 메이커전화: ${wekin.ActivityNew.Host.tel}\n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
      return this.sendSms(objectData.user_phone, msg, `[위킨] 참가신청 완료`)
    })
    .then(_ => resolve(objectData)).catch(reject)
  })
}
let sendOrderConfirmSms = (objectData) => {
  return new Promise((resolve, reject) => {
    wekinService.getWekinByKey(objectData.wekin_key)
    .then(wekin => {
      console.log("문자보내기에 사용되는 스타트타임", wekin.start_time)
      let msg = `${objectData.user_name} 위키너님 [${objectData.wekin_name}] 우리(We)와 함께 즐(KIN)길 준비 되셨나요??\n\n-- 위킨 시작 일: ${moment(wekin.start_date).format('YYYY-MM-DD')}\n- 시작 시각:  ${moment(wekin.start_time).format('HH:mm')}\n- 메이커: ${objectData.wekin_host_name}\n- 장소: ${wekin.ActivityNew.address_detail.meet_area}\n- 준비물: ${wekin.ActivityNew.preparation}\n- 예약인원: ${objectData.wekin_amount}\n\n\n* 문의\n- 위키너카카오톡: @위킨\n- 메이커전화: ${wekin.ActivityNew.Host.tel}\n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
      return this.sendSms(objectData.user_phone, msg, `[위킨] 참가신청 완료`)
    })
    .then(_ => resolve(objectData)).catch(reject)
  })
}

// 결제 완료시 메이커에게 보낼 SMS
exports.sendOrderConfirmSmsToMaker = (objectData) => {
  return new Promise((resolve, reject) => {
    wekinService.getWekinByKey(objectData.wekin_key)
    .then(wekin => {
      let msg = `${wekin.ActivityNew.Host.name} 메이커님 [${objectData.wekin_name}] 위킨의 예약자가 결제를 완료했습니다.\n\n\n* 해당 위킨\n- 위킨 시작 일: ${moment(wekin.start_date).format('YYYY-MM-DD')}\n- 시작 시각:  ${moment(wekin.start_time).format('HH:mm')}\n- 예약자: ${objectData.user_name}\n- 예약인원: ${objectData.wekin_amount}\n- 예약고객님 전화번호: ${objectData.user_phone}\n\n\n* 문의\n- 위키너카카오톡: @위킨\n 혹은 we-kin.com \n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN 언제나 감사합니다. 메이커님`
      return this.sendSms(wekin.ActivityNew.Host.tel, msg)
    })
    .then(_ => resolve(objectData)).catch(reject)
  })
}

let sendOrderConfirmSmsToMaker = (objectData) => {
  return new Promise((resolve, reject) => {
    wekinService.getWekinByKey(objectData.wekin_key)
    .then(wekin => {
      let msg = `${wekin.ActivityNew.Host.name} 메이커님 [${objectData.wekin_name}] 위킨의 예약자가 결제를 완료했습니다.\n\n\n* 해당 위킨\n- 위킨 시작 일: ${moment(wekin.start_date).format('YYYY-MM-DD')}\n- 시작 시각:  ${moment(wekin.start_time).format('HH:mm')}\n- 예약자: ${objectData.user_name}\n- 예약인원: ${objectData.wekin_amount}\n- 예약고객님 전화번호: ${objectData.user_phone}\n\n\n* 문의\n- 위키너카카오톡: @위킨\n 혹은 we-kin.com \n(평일 10:00 ~ 19:00)\n(점심시간 13:00 ~ 14:00)\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN 언제나 감사합니다. 메이커님`
      return this.sendSms(wekin.ActivityNew.Host.tel, msg)
    })
    .then(_ => resolve(objectData)).catch(reject)
  })
}


let sendOrderConfirmMail = (objectData) => {
  return new Promise((resolve, reject) => {
    wekinService.getWekinByKey(objectData.wekin_key)
    .then(wekin => {
      let msg = MAIL_FORM(
        `${objectData.user_name} 위키너님, 위킨 신청 완료!<br>
        우리(We)와 함께 즐(KIN)길 준비 되셨나요?`,
        `<img src="${wekin.ActivityNew.main_image.image[0]}" width="500px">
        <div style="width: 400px; text-align: left; margin: 0 auto;">
          <h3 style="color: #851A1B; text-align: center;">${objectData.wekin_name}</h3>
          위킨 시간 : ${moment(wekin.start_date).format('YYYY-MM-DD')} ${moment(wekin.start_time).format('HH:mm')}<br>
          메이커 :${objectData.wekin_host_name}<br>
          장소 :${wekin.ActivityNew.address_detail.meet_area}<br>
          준비물 :${wekin.ActivityNew.preparation}<br>
          예약인원 :${objectData.wekin_amount}<br>
        </div>
        <div style="width: 400px; margin: 0 auto; font-size: 20px; margin-top: 100px;">
          <p>기다리는 동안 다른 위킨들도 구경해보세요.</p>
          <p>더 다양한 위킨들이 위키너님을 기다리고 있어요</p>
        </div>
        <div style="width: 350px; margin: 0 auto; font-size: 15px; margin-top: 100px; text-align: left;">
          <p>문의</p>
          <p>위키너카카오톡: @위킨</p>
          <p>메이커전화: ${wekin.ActivityNew.Host.tel}</p>
          <p>(평일: 10:00 ~ 19:00)</p>
          <p>(점심시간: 13:00 ~ 14:00)</p>
        </div>`,
        `<p style="padding: 0 30px;">
          <a href="http://we-kin.com/activity/${wekin.ActivityNew.activity_key}" target="new"><button style="width: 200px; height: 50px; background-color: #0263AF; border: 0; border-radius: 5px; color: white; font-size: 20px;">위킨에서 확인하기</button></a>
        </p>`
      )
      return this.sendMail(objectData.user_email, '[위킨] 참가신청 완료', msg)
    })
    .then(_ => resolve(objectData)).catch(reject)
  })
}

/**
 * 위킨 시작 24시간전 (신청마감후)
 */
exports.sendOrderReConfirmSms = (objectData) => {
  wekinService.getWekinByKey(objectData.wekin_key)
  .then(wekin => {
    let msg = `${objectData.user_name} 위키너님 [${objectData.wekin_name}] 잊지 않으셨겠죠? 오늘 우리(We) 즐(KIN)길 위킨데이~\n\n- 일시: ${moment(wekin.start_date).format('YYYY-MM-DD HH:mm')}\n- 장소: ${wekin.ActivityNew.address_detail.meet_area}\n- 준비물: ${wekin.ActivityNew.preparation}\n- 예약인원: ${objectData.wekin_amount}\n- 메이커: ${objectData.wekin_host_name}(${wekin.ActivityNew.Host.tel})\n\n늦으면 안돼요…\n빨리 보고싶어서 현기증 난단 말이에요.\n\n* 문의\n- 위키너 카카오톡: @위킨\n  (매일 10:00 ~ 19:00)\n  (점심시간 13:00 ~ 14:00)\n- 메이커번호:${wekin.ActivityNew.Host.tel} \n당일 문의는 위 메이커 번호로 전화주시기 바랍니다.\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN`
    return this.sendSms(objectData.user_phone, msg, `[위킨] 진행 사전 안내`)
  })
  .then(_ => resolve(objectData)).catch(reject)
}
exports.sendOrderReConfirmMail = (objectData) => {
  return new Promise((resolve, reject) => {
    let msg = `${objectData.user_name} 위키너님, 잊지 않으셨겠죠?\n하룻밤만 자고 나면 드디어 위킨데이!`
    this.sendMail(objectData.user_email, `[위킨] 곧 신청하신 위킨이 시작합니다.`, msg)
    .then(_ => resolve(objectData)).catch(reject)
  })
}
/**
 * 위킨 완료 후, 24시간 후 (완료날짜기준)
 */
exports.sendOrderAfter = (wekinModel) => {
  let stack = []
  orderService.getPaidListByWekinKey(wekinModel.wekin_key)
  .then(orderList => {
    orderList.forEach(v => {
      // stack.push(sendOrderAfterMail(v))
      // stack.push(sendOrderAfterSms(v))
    })
    return Promise.all(stack)
  })
}
let sendOrderAfterSms = (objectData) => {
  return new Promise((resolve, reject) => {
    let msg = `안녕하세요. ${objectData.user_name} 위키너님. [${objectData.wekin_name}] 위킨에 참가해주셔서 정말 감사합니다. 이번 위킨은 어떠셨나요? 더 나은 위킨을 위해 생생한 후기 및 피드를 남겨주세요! 또 다른 위키너님들의 후기도 보시고 다른 위킨들도 간접체험해 보세요.^^\n\n※ 후기를 남겨주신 분들 중 추첨을 통해 소정의 기념품을 쏩니다.\n\n<작성 방법>\n1. 앱 접속 후, ‘피드’ 탭 클릭\n2. 피드 작성 시, 하단 ‘위킨 검색’ 에서 참여한 위킨이름 검색\n3. 위킨에서 있었던 일, 느낌, 감정, 의견 등 자유롭게 피드 및 후기 작성\n4. 별점 부여 후, 완료\n\n후기 작성하러 가기: [앱 다운로드 주소]\n\n위(We)를 보면 즐(KIN)거움이 보인다. WE:KIN\n 결제코드 : ${objectData.order_id}`
    this.sendSms(objectData.user_phone, msg, `[위킨 - 후기 작성 이벤트]`)
    .then(_ => resolve(objectData)).catch(reject)
  })
}
let sendOrderAfterMail = (objectData) => {
  return new Promise((resolve, reject) => {
    let msg = MAIL_TEXT_FORM(
      `${objectData.user_name} 위키너님, 위킨 어떠셨나요?`, 
      `위킨에 참여해주셔서 감사합니다.<br>
      더 나은 위킨을 위해 생생한 후기 및 피드를 남겨주세요!<br>
      다른 위키너님들의 후기도 보고 다른 위킨들도 간접체험해 보세요^^<br>
      그럼 앞으로 더 재미있고 다양한 위킨들로 다시 만나요~<br>`, 
      `<a href="http://we-kin.com/feed" target="new"><button style="width: 200px; height: 50px; background-color: #0263AF; border: 0; border-radius: 5px; color: white; font-size: 20px;">피드 남기</button></a>`)
    this.sendMail(objectData.user_email, `[위킨] 후기 작성 이벤트 참여가 가능합니다.`, msg)
    .then(_ => resolve(objectData)).catch(reject)
  })
}
/**
 * 메이커 신청 승인 완료
 */
exports.sendMakerConfirmSuccess = (user_key) => {
  let stack = []
  userService.getUserByKey(user_key)
  .then(user => {
    stack.push(sendMakerConfirmSuccessMail(user))
    stack.push(sendMakerConfirmSuccessLms(user))
    // stack.push(sendWekinMail(`메이커 신청`, `${user.name} 님의 메이커 신청 요청`))
    return Promise.all(stack)
  })
}
let sendMakerConfirmSuccessLms = (user) => {
  return new Promise((resolve, reject) => {
    let msg = `${user.name} 위키너님 메이커로서 위킨활동이 가능하게 되었습니다. 축하드립니다!!짝짝!! 앞으로 많은 위킨활동 부탁 드립니다.\n\n* 문의\n* 위키너카카오톡 : @위킨(평일 10:00 ~ 19:00)(점심시간 13:00 ~ 14:00)`
    this.sendSms(user.phone, msg, `메이커 신청 승인완료`)
    .then(_ => resolve(objectData)).catch(reject)
  })
}
let sendMakerConfirmSuccessMail = (user) => {
  return new Promise((resolve, reject) => {
    let msg = MAIL_TEXT_FORM(
      `메이커 신청 승인완료\n${user.name} <br>위키너님 메이커로서 위킨활동이 가능하게 되었습니다. `,
      `메이커 신청 승인완료\n${user.name} <br>위키너님 메이커로서 위킨활동이 가능하게 되었습니다. <br>축하드립니다!!짝짝!! 앞으로 많은 위킨활동 부탁 드립니다.<br>* 문의<br>* 위키너카카오톡 : @위킨(평일 10:00 ~ 19:00)(점심시간 13:00 ~ 14:00)`,
      `<a href="http://we-kin.com/" target="new"><button style="width: 200px; height: 50px; background-color: #0263AF; border: 0; border-radius: 5px; color: white; font-size: 20px;">위킨 바로가기</button></a>`
    )
    this.sendMail(user.email, `[위킨] 메이커 승인이 완료되었습니다.`, msg)
    .then(_ => resolve(objectData)).catch(reject)
  })
}

/**
 * 위킨 만들기 승인 완료
 */
exports.sendWekinConfirmSuccess = (host_key) => {
  let stack = []
  hostService.getHostByKey(host_key)
  .then(host => {
    stack.push(sendWekinConfirmSuccessMail(host))
    stack.push(sendWekinConfirmSuccessLms(host))
    return Promise.all(stack)
  })
}
let sendWekinConfirmSuccessMail = host => {
  return new Promise((resolve, reject) => {
    let msg = MAIL_TEXT_FORM(
      `위킨 만들기 승인완료\n${host.User.name} <br>메이커님 요청하신 위킨의 승인이 완료 되었습니다. `,
      `위킨 만들기 승인완료\n${host.User.name} <br>메이커님 요청하신 위킨의 승인이 완료 되었습니다. <br>축하드립니다!!짝짝!! 안전하고 즐거운 활동 되시길 바랍니다<br>* 문의<br>* 위키너카카오톡 : @위킨(평일 10:00 ~ 19:00)(점심시간 13:00 ~ 14:00)`,
      `<a href="http://we-kin.com/" target="new"><button style="width: 200px; height: 50px; background-color: #0263AF; border: 0; border-radius: 5px; color: white; font-size: 20px;">위킨 바로가기</button></a>`
    )
    this.sendMail(host.User.email, `[위킨] 위킨 승인이 완료되었습니다.`, msg)
    .then(_ => resolve(user)).catch(reject)
  })
}
let sendWekinConfirmSuccessLms = host => {
  return new Promise((resolve, reject) => {
    let msg = `${host.name} 메이커님 요청하신 위킨의 승인이 완료 되었습니다. \n축하드립니다!!짝짝!! 안전하고 즐거운 활동 되시길 바랍니다`
    this.sendSms(host.User.phone, msg, `위킨 만들기 승인완료`)
    .then(_ => resolve(user)).catch(reject)
  })
}

/**
 * 위킨 내부용
 */
exports.sendWekinMail = (title, msg) => {
  return new Promise((resolve, reject) => {
    this.sendMail(WEKIN_MAIL, title, msg)
   .then(resolve).catch(reject)
  })
}

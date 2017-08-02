const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { pageable } = require('../util/page')
const { userService, utilService, fireHelper } = require('../service')
const request = require('request')

exports.getList = (req, res) => {
  model.User.findAll({paranoid: false})
  .then((results) => {
    returnMsg.success200RetObj(res, results) 
  })
  .catch((err) => {
    returnMsg.error500Server(res, err)
  })
}
exports.getOne = (req, res) => {
  let tmp = {}
  model.User.findById(req.params.user_key, {paranoid: false})
  .then(u => {
    tmp = u
    return fireHelper.admin.auth().getUser(u.uuid)
  })
  .then(r => {
    tmp.email_valid = r.emailVerified
    if (r.emailVerified != tmp.email_valid) {
      model.User.update({
        where: {
          user_key: tmp.user_key
        }
      }, {
        email_valid: r.emailVerified
      })
    }
    return tmp
  })
  .then(result => returnMsg.success200RetObj(res, result))
  .catch(err => returnMsg.error500Server(res, err))
}
exports.withdraw = (req, res) => {
  userService.getUserByToken(req)
  .then(r => {
    return model.User.destroy({
      where: {
        user_key: r.user_key
      },
      returning: true
    })
  })
  .then(r => {
    returnMsg.success200RetObj(res, {result: true})
  })
  .catch(e => {
    returnMsg.error400InvalidCall(res, 'ERROR_INVALID_PARAM', {result: false, msg: 'already deleted'})
  })
}

exports.createUser = (req, res, next) => {
  let tmp = {}
  fireHelper.admin.auth().createUser({
    email: req.body.email,
    displayName: req.body.name,
    password: req.body.password,
    disabled: false
  })
  .then(r => {
    tmp = r
    return model.User.findOrCreate({
      where: {
        uuid: r.uid
      }, defaults: {
        email: r.email,
        name: r.displayName,
        profile_image: r.photoURL || '/static/images/default-profile.png',
        uuid: r.uid
      }
    })
  })
  .then(user => {
    if (user[1] === true) {
      utilService.slackLog(user + '님 회원가입 완료')
      utilService.sendJoinAfterMail(user[0])
    }
    // return tmp.getIdToken()
    console.log(tmp)
    return fireHelper.admin.auth().createCustomToken(tmp.uid)
  })
  .then(r => {
    res.json(r)
  })
  .catch(e => {
    console.log(e)
  })
} 

exports.getFrontList = (req, res, next) => {
  model.User.findAll({
    attributes: ['user_key', 'profile_image', 'name']
  }).then((results) => {
    res.json(results)
  }).catch((err) => {
    next(err)
  })
}
exports.getFrontSignUp = (req, res, next) => {
  let jwtToken = req.body.accessToken
  let name = req.body.name
  let profileImage = req.body.profileImage
  createUserDBFromToken(jwtToken, name, profileImage)
    .then(user => res.json(user))
    .catch(err => {
      console.log(err)
      res.status(500).send('잠시 후 다시 시도해주세요.')
    })
}
exports.createCustomToken = (req, res, next) => {
  let token = req.body.accessToken
  let tokenUrlOptions = {
    url: 'https://kapi.kakao.com/v1/user/me',
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  }
  try {
    request(tokenUrlOptions, (error, response, body) => {
      if (!error) {
        body = JSON.parse(body)
        let additionalClaims = {
          email: body.kaccount_email
        }
        if (body.properties && body.properties.nickname && body.properties.profile_image) {
          additionalClaims.profile_image = body.properties.profile_image
          additionalClaims.name = body.properties.nickname
        }
        fireHelper.createCustomToken(body.id, additionalClaims)
          .then((customToken) => { res.json(customToken) })
          .catch(err => next(err))
      } else {
        console.log(error)
      }
    })
  } catch (e) {
    console.log(e)
    res.status(500).send('잠시 후 다시 시도해주세요.')
  }
}
exports.signUpWithCustomToken = (req, res, next) => {
  let customToken = req.body.customToken
  createUserDBFromToken(customToken, req.body.name, req.body.profile_image)
    .then(user => res.json(user))
    .catch(() => res.status(500).send('잠시 후 다시 시도해주세요.'))
}
exports.verify = (req, res, next) => {
  res.json(req.user)
}
exports.verifyPhone = (req, res, next) => {
  let userKey = req.user.user_key
  let phoneNumber = req.body.phoneNumber
  let verifyCode = req.body.verifyCode

  let modelData = { phone: phoneNumber, phone_valid: true }
  let queryOptions = { where: { user_key: userKey } }

  fireHelper.verifySmsCode(phoneNumber, verifyCode)
    .then((isSuccess) => {
      model.User.update(modelData, queryOptions)
        .then(result => res.json({ success: isSuccess }))
        .catch(err => next(err))
    })
}
exports.postVerifyPhone = (req, res, next) => {
  let phoneNumber = req.body.phoneNumber
  let verifyCode = fireHelper.sendSmsValidationCode(phoneNumber)
  let message = `위킨 핸드폰 인증번호 : ${verifyCode}`

  utilService.sendSms(phoneNumber, message)
  .then(r => {
    res.sendStatus(200)
  })
  .catch(e => { console.log(e) })
}
exports.postFrotUser = (req, res, next) => {
  var options = req.fetchParameter(['profile_image', 'name', 'gender', 'introduce', 'email', 'phone'])
    if (req.checkParamErr(options)) return next(options)

    model.User.create({
      profileImage: options.profileImage,
      name: options.name,
      gender: options.gender,
      introduce: options.introduce,
      email: options.email,
      phone: options.phone,
      phoneValid: false,
      notification: true
    }).then(result => {
      res.json(result)
    }).catch(err => {
      next(err)
    })
}
exports.getFrontUserInfo = (req, res, next) => {
  let queryOptions = {
    where: { user_key: req.params.user_key },
    attributes: [
      'user_key',
      'profile_image',
      'name',
      'introduce',
      'gender',
      'email',
      'email_noti',
      'push_noti',
      'sms_noti'
    ]
  }
  model.User.findOne(queryOptions)
    .then(result => res.json(result))
    .catch(err => next(err))
}
exports.putFrontUserInfo = (req, res, next) => {
  req.checkBody('name', '이름은 필수입니다.').notEmpty()
  req.getValidationResult().then(result => {
    if (!result.isEmpty()) {
      res.status(400).json(util.inspect(result.array()))
      return
    }
    let user = req.body
    let modelData = {
      name: user.name,
      introduce: user.introduce,
      profileImage: user.profile_image,
      gender: user.gender,
      email_noti: user.email_noti,
      push_noti: user.push_noti
    }
    if (user.profile_image) {
      modelData.profile_image = user.profile_image
    }
    let queryOptions = {
      where: { user_key: req.user.user_key }
    }
    model.User.update(modelData, queryOptions)
      .then(result => res.json(result))
      .catch(err => next(err))
  })
}
exports.getUsersActiviry = (req, res, next) => {
  let queryOptions = {
    where: { user_key: req.params.user_key },
    include: { model: model.Host }
  }
  model.Activity.findAll(queryOptions)
    .then((results) => res.json({ results: results }))
    .catch((err) => next(err))
}
exports.getUsersQna = (req, res, next) => {
  let queryOptions = {
    where: { user_key: req.params.user_key, type: 2 },
    include: [{ model: model.Activity }, { model: model.User }]
  }
  model.Doc.findAll(queryOptions)
    .then((results) => res.json({ results: results }))
    .catch((err) => next(err))
}

/**
 * 토큰을 이용하여 유저 데이터베이스를 생성한다.
 * @param {string} jwtToken
 */
function createUserDBFromToken (jwtToken, name, profileImage) {
  return new Promise((resolve, reject) => {
    fireHelper.admin.auth().verifyIdToken(jwtToken).then(decoded => {
      model.User.findOrCreate({
        where: {
          uuid: decoded.sub
        },
        defaults: {
          email: decoded.email,
          name: name || decoded.name,
          profile_image: profileImage || decoded.profile_image || '/static/images/default-profile.png',
          uuid: decoded.sub
        }
      }).then(user => {
        fireHelper.admin.auth().updateUser(decoded.sub, {
          displayName: name || decoded.name
        })
        return user
      }).then(user => {
        if (user[1] === true) {
          utilService.slackLog(user + '님 회원가입 완료')
        }
        resolve(user)
      }).catch(err => {
        console.log(err)
        reject(err)
      })
    })
  })
}

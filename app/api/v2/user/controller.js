const model = require('../../../model')
const returnMsg = require('../../../return.msg')
const { pageable } = require('../util/page')
const { userService, utilService, fireHelper } = require('../service')
const request = require('request')
const moment = require('moment')

exports.kakaoLogin = (req, res, next) => {
  if (req.params.type === "kakao") {
    request.post("https://kauth.kakao.com/oauth/token", {
      form: { 
        grant_type: 'authorization_code',
        client_id: '75c0694ad636bcca94fa48cbc7c9d8cf',
        redirect_url: 'http://175.195.139.99:8080/auth/kakao',
        code: req.params.code 
      }
    }, (err,httpResponse,body) => { 
      let userToken = JSON.parse(body)
      var options = {
        url: 'https://kapi.kakao.com/v1/user/signup',
        headers: {
          Authorization: 'Bearer ' + userToken.access_token
        }
      }
      request(options, (err, response, body) => {
        let userRegistration = JSON.parse(body)
        if (userRegistration.msg === "already registered") {
          var options = {
            url: 'https://kapi.kakao.com/v1/user/me',
            headers: {
              Authorization: 'Bearer ' + userToken.access_token
            }
          }
          request(options, (err, response, body) => {
            // 이미 앱과 연동이 되어있다면 엑세스 토큰을 이용해서 유저 정보를 가져온다음
            let userInfo = JSON.parse(body)
            console.log(userInfo)
            let additionalClaims = {
              email: userInfo.kaccount_email,
              id: userInfo.id,
              photo: userInfo.properties ? userInfo.properties.profile_image : null,
              name: userInfo.properties ? userInfo.properties.nickname : null
            }
            fireHelper.createCustomToken(userInfo.id, additionalClaims)
              .then( customToken => {

                res.json({ customToken: customToken, userInfo: userInfo }) 
              })
              .catch( err => next(err))
          })
          // 유저 정보를 이용해서 커스텀 토큰을 만든 후 프론트에게 넘겨준 후 프론트에서 커스텀 토큰으로 signInWithCustomToken로 파배 가입시킨다.
        } else {
          console.log(userRegistration)
        }
      })
    })
  } else if (req.params.type === "androidnaver") {
    let accessToken = req.header('access-token')
    var options = {
      url: 'https://openapi.naver.com/v1/nid/me',
      headers: {
        Authorization: 'Bearer ' + accessToken
      }
    }
    request(options, (err, response, body) => {
      let userInfo = JSON.parse(body).response
      let additionalClaims = {
        email: userInfo.email,
        id: userInfo.id,
        photo: userInfo.profile_image || null,
        name: userInfo.name
      }
      fireHelper.createCustomToken(userInfo.id, additionalClaims)
        .then( customToken => {

          res.json({ customToken: customToken, userInfo: userInfo }) 
        })
        .catch( err => next(err))
      // 유저 정보를 이용해서 커스텀 토큰을 만든 후 프론트에게 넘겨준 후 프론트에서 커스텀 토큰으로 signInWithCustomToken로 파배 가입시킨다.
    })
  } else if (req.params.type === "naver") {
    request.post("https://nid.naver.com/oauth2.0/token", {
      form: { 
        grant_type: 'authorization_code',
        client_id: 'rTHYGlmyZuVKSzR4_45d',
        redirect_url: 'http://175.195.139.99:8080/auth/naver',
        code: req.params.code,
        client_secret: '5Wo2kSoe2R'
      }
    }, (err,httpResponse,body) => { 
      let userToken = JSON.parse(body)
      var options = {
        url: 'https://openapi.naver.com/v1/nid/me',
        headers: {
          Authorization: 'Bearer ' + userToken.access_token
        }
      }
      request(options, (err, response, body) => {
        let userInfo = JSON.parse(body).response
        let additionalClaims = {
          email: userInfo.email,
          id: userInfo.id,
          photo: userInfo.profile_image || null,
          name: userInfo.name
        }
        fireHelper.admin.auth().getUserByEmail(userInfo.email)
          .then(function(userRecord) {
            let err = {
              message: 'fail already email exist',
              data: userRecord
            }
            next(err) 
          })
          .catch(function(error) {
            fireHelper.createCustomToken(userInfo.id, additionalClaims)
              .then( customToken => {

                res.json({ customToken: customToken, userInfo: userInfo }) 
              })
              .catch( err => next(err))
          });
      })
      // 유저 정보를 이용해서 커스텀 토큰을 만든 후 프론트에게 넘겨준 후 프론트에서 커스텀 토큰으로 signInWithCustomToken로 파배 가입시킨다.
    })
  }
}

exports.dbCreateWithIdtoken = (req, res, next) => {
  fireHelper.admin.auth().verifyIdToken(req.body.idToken)
    .then(decoded => {
      model.User.findOrCreate({
        where: {
          email: decoded.email
        },
        defaults: {
          email: decoded.email,
          name: decoded.name,
          profile_image: decoded.profile_image || '/static/images/default-profile.png',
          uuid: decoded.sub
        }
      })
        .then(user => {
          let uuid = user[0].dataValues.uuid
          fireHelper.admin.auth().updateUser(decoded.sub, {
            displayName: decoded.name,
            email: decoded.email
          })
            .then( user => {
              res.send(user)
            })
            .catch( err => {
              fireHelper.admin.auth().getUser(uuid)
                .then( user => res.send(user) )
                .catch( error => next(error) )
            })
        })
        .catch(err => {
          console.log(err)
          next(err)
        })
    })
    .catch( error => next(error) )
}

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
  let user = JSON.parse(req.body.userObject)
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
          email_company: user.email_company ? user.email_company : null,
          email_company_valid: user.email_company ? true : false,
          birthday: moment().set({ 'year': user.birthday.year, 'month': user.birthday.month, 'date': user.birthday.day }).format(),
          gender: user.gender,
          phone: user.phoneNumber,
          phone_valid: true,
          name: r.displayName,
          profile_image: r.photoURL || user.photo || '/static/images/default-profile.png',
          uuid: r.uid,
          country: user.country || 'Korea'
        }
      })
    })
    .then(user => {
      return fireHelper.admin.auth().createCustomToken(tmp.uid)
    })
    .then(r => {
      res.json(r)
    })
    .catch(e => {
      next(e)
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
  let phoneNumber = req.body.phoneNumber
  let verifyCode = req.body.verifyCode
  let modelData = { phone: phoneNumber, phone_valid: true }

  fireHelper.verifySmsCode(phoneNumber, verifyCode)
    .then((isSuccess) => {
      res.json({ success: isSuccess })
    })
    .catch(err => next(err))
}
exports.postVerifyPhone = (req, res, next) => {
  let phoneNumber = req.body.phoneNumber
  let verifyCode = fireHelper.sendSmsValidationCode(phoneNumber)
  let message = `위킨 핸드폰 인증번호 : ${verifyCode}`

  utilService.sendSmsShort(phoneNumber, message)
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
      'sms_noti',
      'introduce',
      'work_balance_point',
      'work_balance_point_history',
      // 추가로 불러와야 할 정보들 입력
    ],
    include: [
      { model: model.WekinNew, include: { model: model.ActivityNew, attributes: [ 'category' ] } }
    ]
  }
  model.User.findOne(queryOptions)
    .then(result => res.json(result))
    .catch(err => next(err))
}
exports.putFrontUserInfo = (req, res, next) => {
  // req.checkBody('name', '이름은 필수입니다.').notEmpty()
  req.getValidationResult().then(result => {
    let user = req.body
    let modelData = {
      name: user.name,
      introduce: user.introduce,
      profileImage: user.profile_image,
      gender: user.gender,
      email_noti: user.email_noti,
      push_noti: user.push_noti,
      phone: user.phone,
      phone_valid: user.phone_valid
    }
    if (user.profile_image) {
      modelData.profile_image = user.profile_image
    }
    let queryOptions = {
      where: { user_key: req.params.user_key }
    }
    model.User.update(modelData, queryOptions)
      .then(result => res.send('success'))
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
          email: decoded.email
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

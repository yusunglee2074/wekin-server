const errorCodeMap = {
  ERROR_UNKNOWN: 0,
  ERROR_MISSING_PARAM: -1,
  ERROR_INVALID_PARAM: -2,
  ERROR_DUPLICATE: -3,
  ERROR_INVALID_ACCESS_TOKEN: -4,
  ERROR_NO_CONNECTION: -5,
  ERROR_NO_MODIFIED_PARAM: -6
}

// undefined 체크
exports.undefinedCheck = v => v !== undefined

// JSON Valid check
exports.jsonValidation = data => {
  try {
    return JSON.parse(data)
  } catch (e) {
    return false
  }
}

// 200 - success
exports.success200 = res => res.status(200).json({})

// 200 - return Model
exports.success200RetObj = (res, obj) => res.status(200).json(obj)

// No Data
exports.successNoData = res => res.status(200).json({})

// 201 - create
exports.success201 = res => res.status(201).json({})

// 204 - delete
exports.success204 = res => res.status(204).send()

// 400 - 인자값 누락
exports.error400InvalidCall = (res, errorCode, data) => res.status(400).json({
  errorCode: errorCodeMap[errorCode],
  data: data
})

// 401 - 리소스 접근권한 없음
exports.error401Unauthorized = res => res.sendStatus(401)

// 403- 서버가 요청을 거부하고 있다.
exports.error403Forbidden = (res, data) => res.status(403).json(data)

exports.error404NotFound = res => res.status(404).send()

// 500 - 서버 error
exports.error500Server = (res, err) => res.status(500).json(err)

exports.errorInvalidAccessToken = res => res.status(403).json({
  success: false,
  message: '로그인이 필요한 서비스 입니다.'
})

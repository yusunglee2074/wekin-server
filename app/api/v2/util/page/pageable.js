
/**
 * @method storage springPageable
 * @description springpageable 과 같은 인터페이스의 pageable
 * @param {Object} model sequelize model
 * @param {Object} query request.query
 * @param {Object} option 기타 기본쿼리들
 * @version v1.0
 * @author jinhyung
 * @logs 170615 : [jinhyung] 최초생성
 *
 * @returns {Promise<Object>}
 */
exports.springPageable = function(model, query, option) {

  let buildQuery = (query) => {
    let data = query.split(',')
    if (data.length == 1) {
      return [data[0], 'ASC']
    } else if (data.length == 2) {
      return [data[0], data[1]]
    }
  }
  return new Promise((resolve, reject) => {
    let page = parseInt(query.page) || 1
    let sort = query.sort
    let order = []

    option.limit = parseInt(query.size) || 10
    option.offset = (page - 1) * option.limit
    

    if (sort == undefined) {

    } else if (Array.isArray(sort)) {
      sort.forEach(v => {
        order.push(buildQuery(v))
      })
    } else {
      order.push(buildQuery(sort))
    }
    
    option.order = order

    model.findAndCountAll(option)
    .then(result => {
      let total = result.count
      resolve({
        content: result.rows,
        totalPages: Math.ceil(total / option.limit),
        last: (Math.ceil(total / option.limit) == option.offset) ? true : false,
        totalElements: total,
        size: option.limit,
        number: page,
        sort: order,
        offset: option.offset,
        first: (option.offset == 1) ? true : false,
        numberOfElements: (Math.ceil(total / option.limit) > option.offset) ? option.limit : total % option.limit
      })

    })
    .catch(reject)
    

  })
  
  
  
/*
  let total = 100
  let content = []

  let buildQuery = (query) => {
    let data = query.split(',')
    if (data.length == 1) {
      return [data[0], 'ASC']
    } else if (data.length == 2) {
      return [data[0], data[1]]
    }
  }

  
  let result = {
    content: content,
    totalPages: Math.ceil(this.totalElements / query.limit),
    last: (this.totalPages == query.offset) ? true : false,
    totalElements: total,
    size: query.limit,
    number: query.offset,
    sort: order,
    first: (query.offset == 1) ? true : false,
    numberOfElements: (this.totalPages > query.offset) ? query.limit : this.totalElements % query.limit
  }
  if (additional_query) { Object.assign(additional_query, query) }

  this.getQuery = () => {
    console.log(additional_query)
    return additional_query
  }
  this.setQuery = (inputQuery) => {
    if (Object.keys(inputQuery).includes('order') ) {
      inputQuery.order.forEach(v => {
        order.push(v)
      })
    }
  }
  this.setRows = (param) => {
    content = param
  }
  this.setCount = (param) => {
    total = param
  }
  this.setResult = function(param) {
    this.setRows(param.rows)
    this.setCount(param.count)
  }
  this.getResult = () => {
    return {
      content: content,
      totalPages: Math.ceil(total / query.limit),
      last: (Math.ceil(total / query.limit) == query.offset) ? true : false,
      totalElements: total,
      size: query.limit,
      number: query.offset,
      sort: order,
      first: (query.offset == 1) ? true : false,
      numberOfElements: (Math.ceil(total / query.limit) > query.offset) ? query.limit : total % query.limit
    }
  }
  */
}

exports.page2 = function(req, additional_query) {
  let order = []
  let sort = req.query.sort
  let total = 100
  let content = []

  let buildQuery = (query) => {
    let data = query.split(',')
    if (data.length == 1) {
      return [data[0], 'ASC']
    } else if (data.length == 2) {
      return [data[0], data[1]]
    }
  } 
  
  if (sort == undefined ) {

  } else if (Array.isArray(sort)) {
    sort.forEach(v => {
      order.push(buildQuery(v))
    })
  } else {
    order.push(buildQuery(sort))
  }

  let query = {
    limit: parseInt(req.query.size) || 10,
    offset: req.query.page || 1,
    order: order
  }
  let result = {
    content: content,
    totalPages: Math.ceil(this.totalElements / query.limit),
    last: (this.totalPages == query.offset) ? true : false,
    totalElements: total,
    size: query.limit,
    number: query.offset,
    sort: order,
    first: (query.offset == 1) ? true : false,
    numberOfElements: (this.totalPages > query.offset) ? query.limit : this.totalElements % query.limit
  }
  if (additional_query) { Object.assign(query, additional_query) }

  this.getQuery = () => {
    return {
      limit: parseInt(req.query.size) || 10,
      offset: query.limit * query.offset,
      order: order
    }
  }
  this.setQuery = (inputQuery) => {
    if (Object.keys(inputQuery).includes('order') ) {
      inputQuery.order.forEach(v => {
        order.push(v)
      })
    }
  }
  this.setRows = (param) => {
    content = param
  }
  this.setCount = (param) => {
    total = param
  }
  this.setResult = function(param) {
    this.setRows(param.rows)
    this.setCount(param.count)
  }
  this.getResult = () => {
    return {
      content: content,
      totalPages: Math.ceil(total / query.limit),
      last: (Math.ceil(total / query.limit) == query.offset) ? true : false,
      totalElements: total,
      size: query.limit,
      number: query.offset,
      sort: order,
      first: (query.offset == 1) ? true : false,
      numberOfElements: (Math.ceil(total / query.limit) > query.offset) ? query.limit : total % query.limit
    }
  }
}

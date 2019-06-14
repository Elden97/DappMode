const http = (baseUrl, url, body, successFn, method) => {
  const response = await fetch(appendSlash(baseUrl) + url, {
    method,
    body: body ? JSON.stringify(body) : undefined,
    headers: {
      'content-type': 'application/json'
    },
    credentials: 'omit'
  })
  const json = await response.json()
  if (response.ok) {
    return successFn ? successFn(json) : json
  }
  return Promise.reject(JSON.stringify(json))
}

const stringParams = (parameters) => {
  const objectKeys = Object.keys(parameters)
  let stringParams = objectKeys
    .map(key => key + '=' + parameters[key])
    .join('&')
  return (objectKeys.length === 0 ? '' : '?') + stringParams
}

const post = (url, parameters, body, successFn) => {
  let stringParams = stringParams(parameters)

  return await http(
    serverUrl,
    url + stringParams,
    body,
    successFn,
    'POST'
  )
}

const get = (url, parameters, successFn) => {
  let stringParams = stringParams(parameters)

  return await http(
    serverUrl,
    url + stringParams,
    undefined,
    successFn,
    'GET'
  )
}

module.exports = {
  get,
  post
}
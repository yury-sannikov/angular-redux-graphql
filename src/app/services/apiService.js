
const API_CALL_TIMEOUT = 15000

const requestHeaders = (identity = null) => {
  const authorizationHeader = identity ? {authorization: identity.auth_token} : {};
  return Object.assign({
    'Content-Type': 'application/json'
  }, authorizationHeader);
}

const parseJSON = response => response.json();

const checkStatus = response => {
  if (response.status >= 200 && response.status < 300) {
    return response
  }
  else {
    let error = new Error(response.statusText)
    error.response = response
    error.httpError = true;
    throw error;
  }
}

class ApiService {
  constructor($timeout) {
    this.$timeout = $timeout
  }

  executeRequest(payload, meta, url, fetchFactory) {
    const { identity = null } = meta;
    let fetchParams = fetchFactory ? fetchFactory(payload, meta) : {};
    fetchParams.headers = requestHeaders(identity);
    fetchParams.method = fetchParams.method || 'GET';

    return new Promise((resolve, reject) => {
      this.$timeout(() => {
        let err = new Error('Network Timeout');
        err.errorDetails = 'We are unable to retrieve the information you requested.';
        reject(err)
      }, API_CALL_TIMEOUT)

      fetch(url, fetchParams)
      .then(checkStatus)
      .then(parseJSON)
      .then(resolve)
      .catch(reject)
    })
  }

  getRCStatus(payload, meta) {
    return this.executeRequest(payload, meta, `${ROQOS_URL}/device/status`);
  }
  
}

export const asRequest = actionName => `${actionName}_REQUEST`
export const asResponse = actionName => `${actionName}_RESPONSE`
export const asError = actionName => `${actionName}_ERROR`

export const fakeFetch = (url, params, fakeResult) => new Promise((resolve, reject) => {
    setTimeout(() => {
        if (fakeResult !== undefined) {
            resolve({
                ok: true,
                json: () => fakeResult
            });
        } else {
            reject(new Error('fetch failed'));
        }
    }, 1000);
}) 
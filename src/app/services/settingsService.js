export class SettingsService {
  constructor(toastr) {
    this.toastr = toastr
  }

  showToast(payload, meta) {
    if (!meta) {
      this.toastr.success(payload);
    } else {
      const { origin: {payload : originPayload, error} } = meta
      if (error) {
        this.toastr.error(originPayload, payload);
      } else {
        this.toastr.success(payload);
        
      }
    }
  }

  setReadonly(payload, meta) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        if (meta.fakeResult !== undefined) {
          resolve({
            ok: true,
            json: () => meta.fakeResult
          });
        } else {
          reject(new Error('fetch failed'));
        }
      }, 1000);
    })
  }
}

SettingsService.$inject = ['toastr'];
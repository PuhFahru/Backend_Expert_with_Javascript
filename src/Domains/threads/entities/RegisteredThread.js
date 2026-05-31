import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

class RegisteredThread {
  constructor(payload) {
    if (!payload) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
    this._verifyPayload(payload);

    this.id = payload.id;
    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
    this.createdAt = payload.created_at;
  }

  _verifyPayload(payload) {
    if (!payload.id || !payload.title || !payload.body || !payload.owner || !payload.created_at) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
  }
}

export default RegisteredThread;
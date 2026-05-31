import InvariantError from '../../../Commons/exceptions/InvariantError.js';

class NewThread {
  constructor(payload) {
    this._verifyPayload(payload);

    this.title = payload.title;
    this.body = payload.body;
    this.owner = payload.owner;
  }

  _verifyPayload(payload) {
    if (!payload.title || !payload.body) {
      throw new InvariantError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    }

    if (typeof payload.title !== 'string' || typeof payload.body !== 'string') {
      throw new InvariantError('NEW_THREAD.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE');
    }

    if (payload.title.trim() === '' || payload.body.trim() === '') {
      throw new InvariantError('NEW_THREAD.PROPERTY_MUST_NOT_BE_EMPTY');
    }
  }
}

export default NewThread;
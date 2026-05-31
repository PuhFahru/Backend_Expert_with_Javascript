import InvariantError from '../../../Commons/exceptions/InvariantError.js';

class NewReply {
  constructor(payload) {
    this._verifyPayload(payload);
    this.content = payload.content;
  }

  _verifyPayload(payload) {
    if (!payload.content) {
      throw new InvariantError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    }
    if (typeof payload.content !== 'string') {
      throw new InvariantError('NEW_REPLY.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE');
    }
    if (payload.content.trim() === '') {
      throw new InvariantError('NEW_REPLY.PROPERTY_MUST_NOT_BE_EMPTY');
    }
  }
}

export default NewReply;
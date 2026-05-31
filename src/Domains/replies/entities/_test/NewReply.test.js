import NewReply from '../NewReply.js';

describe('NewReply', () => {
  describe('constructor', () => {
    it('should create NewReply instance with correct properties', () => {
      const payload = {
        content: 'sebuah balasan',
      };

      const newReply = new NewReply(payload);

      expect(newReply.content).toEqual(payload.content);
    });
  });

  describe('_verifyPayload', () => {
    it('should throw error when content is not provided', () => {
      const payload = {};

      expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when content is not a string', () => {
      const payload = {
        content: 123,
      };

      expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE');
    });

    it('should throw error when content is empty string', () => {
      const payload = {
        content: '',
      };

      expect(() => new NewReply(payload)).toThrowError('NEW_REPLY.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  });
});
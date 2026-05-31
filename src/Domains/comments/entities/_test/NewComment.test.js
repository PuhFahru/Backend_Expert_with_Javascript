import NewComment from '../NewComment.js';

describe('NewComment', () => {
  describe('constructor', () => {
    it('should create NewComment instance with correct properties', () => {
      const payload = {
        content: 'sebuah comment',
      };

      const newComment = new NewComment(payload);

      expect(newComment.content).toEqual(payload.content);
    });
  });

  describe('_verifyPayload', () => {
    it('should throw error when content is not provided', () => {
      const payload = {};

      expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when content is not a string', () => {
      const payload = {
        content: 123,
      };

      expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE');
    });

    it('should throw error when content is empty string', () => {
      const payload = {
        content: '',
      };

      expect(() => new NewComment(payload)).toThrowError('NEW_COMMENT.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  });
});
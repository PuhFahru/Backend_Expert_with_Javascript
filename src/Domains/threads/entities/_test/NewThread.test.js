import NewThread from '../NewThread.js';

describe('NewThread', () => {
  describe('constructor', () => {
    it('should create NewThread instance with correct properties', () => {
      const payload = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };

      const newThread = new NewThread(payload);

      expect(newThread.title).toEqual(payload.title);
      expect(newThread.body).toEqual(payload.body);
    });
  });

  describe('_verifyPayload', () => {
    it('should throw error when title is not provided', () => {
      const payload = {
        body: 'sebuah body thread',
      };

      expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when body is not provided', () => {
      const payload = {
        title: 'sebuah thread',
      };

      expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when title is not a string', () => {
      const payload = {
        title: 123,
        body: 'sebuah body thread',
      };

      expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE');
    });

    it('should throw error when body is not a string', () => {
      const payload = {
        title: 'sebuah thread',
        body: true,
      };

      expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.PROPERTY_MUST_HAVE_CORRECT_DATA_TYPE');
    });

    it('should throw error when title is empty string', () => {
      const payload = {
        title: '',
        body: 'sebuah body thread',
      };

      expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });

    it('should throw error when body is empty string', () => {
      const payload = {
        title: 'sebuah thread',
        body: '',
      };

      expect(() => new NewThread(payload)).toThrowError('NEW_THREAD.NOT_CONTAIN_NEEDED_PROPERTY');
    });
  });
});
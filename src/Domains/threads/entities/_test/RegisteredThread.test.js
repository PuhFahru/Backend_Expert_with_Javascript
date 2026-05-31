import RegisteredThread from '../RegisteredThread.js';
import NotFoundError from '../../../../Commons/exceptions/NotFoundError.js';

describe('RegisteredThread entity', () => {
  describe('Constructor', () => {
    it('should throw NotFoundError when payload is null', () => {
      expect(() => new RegisteredThread(null))
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError when payload is undefined', () => {
      expect(() => new RegisteredThread(undefined))
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError when payload is empty object', () => {
      expect(() => new RegisteredThread({}))
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError when payload is missing id', () => {
      const payload = {
        title: 'title',
        body: 'body',
        owner: 'user-123',
        created_at: new Date().toISOString(),
      };
      expect(() => new RegisteredThread(payload))
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError when payload is missing title', () => {
      const payload = {
        id: 'thread-123',
        body: 'body',
        owner: 'user-123',
        created_at: new Date().toISOString(),
      };
      expect(() => new RegisteredThread(payload))
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError when payload is missing body', () => {
      const payload = {
        id: 'thread-123',
        title: 'title',
        owner: 'user-123',
        created_at: new Date().toISOString(),
      };
      expect(() => new RegisteredThread(payload))
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError when payload is missing owner', () => {
      const payload = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        created_at: new Date().toISOString(),
      };
      expect(() => new RegisteredThread(payload))
        .toThrow(NotFoundError);
    });

    it('should throw NotFoundError when payload is missing created_at', () => {
      const payload = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
      };
      expect(() => new RegisteredThread(payload))
        .toThrow(NotFoundError);
    });

    it('should create RegisteredThread correctly with valid payload', () => {
      const payload = {
        id: 'thread-123',
        title: 'title',
        body: 'body',
        owner: 'user-123',
        created_at: '2024-01-01T00:00:00.000Z',
      };

      const registeredThread = new RegisteredThread(payload);

      expect(registeredThread.id).toEqual(payload.id);
      expect(registeredThread.title).toEqual(payload.title);
      expect(registeredThread.body).toEqual(payload.body);
      expect(registeredThread.owner).toEqual(payload.owner);
      expect(registeredThread.createdAt).toEqual(payload.created_at);
    });
  });
});
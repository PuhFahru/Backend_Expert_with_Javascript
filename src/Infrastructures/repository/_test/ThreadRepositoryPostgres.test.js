import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import ThreadRepositoryPostgres from '../ThreadRepositoryPostgres.js';

describe('ThreadRepositoryPostgres', () => {
  afterEach(async () => {
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addThread function', () => {
    it('should persist new thread correctly', async () => {
      const uniqueUserId = `user-${Date.now()}`;
      await UsersTableTestHelper.addUser({ id: uniqueUserId, username: `user_${Date.now()}` });

      const newThread = {
        title: 'sebuah thread',
        body: 'sebuah body thread',
      };
      const fakeIdGenerator = () => '123';
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, fakeIdGenerator);

      const result = await threadRepositoryPostgres.addThread(newThread, uniqueUserId);

      expect(result.id).toEqual('thread-123');
      expect(result.title).toEqual(newThread.title);
      expect(result.body).toEqual(newThread.body);
      expect(result.owner).toEqual(uniqueUserId);

      const threads = await ThreadsTableTestHelper.findThreadsById('thread-123');
      expect(threads).toHaveLength(1);
    });
  });

  describe('getThreadById function', () => {
    it('should return thread correctly', async () => {
      const uniqueUserId = `user-${Date.now()}`;
      const uniqueThreadId = `thread-${Date.now()}`;
      await UsersTableTestHelper.addUser({ id: uniqueUserId, username: `user_${Date.now()}` });
      await ThreadsTableTestHelper.addThread({
        id: uniqueThreadId,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: uniqueUserId,
      });
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const result = await threadRepositoryPostgres.getThreadById(uniqueThreadId);

      expect(result.id).toEqual(uniqueThreadId);
      expect(result.title).toEqual('sebuah thread');
      expect(result.body).toEqual('sebuah body thread');
    });

    it('should return null when thread not found', async () => {
      const threadRepositoryPostgres = new ThreadRepositoryPostgres(pool, {});

      const result = await threadRepositoryPostgres.getThreadById('thread-xxx');

      expect(result).toBeNull();
    });
  });
});
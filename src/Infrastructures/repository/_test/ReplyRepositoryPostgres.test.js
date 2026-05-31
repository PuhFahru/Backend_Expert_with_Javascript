import RepliesTableTestHelper from '../../../../tests/RepliesTableTestHelper.js';
import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import ReplyRepositoryPostgres from '../ReplyRepositoryPostgres.js';

describe('ReplyRepositoryPostgres', () => {
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(7)}`;

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addReply function', () => {
    it('should persist new reply correctly', async () => {
      const uniqueUserId = generateId();
      const uniqueThreadId = generateId();
      const uniqueCommentId = generateId();
      const uniqueUsername = `user_${generateId()}`;

      await UsersTableTestHelper.addUser({ id: uniqueUserId, username: uniqueUsername });
      await ThreadsTableTestHelper.addThread({
        id: uniqueThreadId,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: uniqueUserId,
      });
      await CommentsTableTestHelper.addComment({
        id: uniqueCommentId,
        content: 'sebuah comment',
        thread_id: uniqueThreadId,
        owner: uniqueUserId,
      });

      const newReply = {
        content: 'sebuah balasan',
      };
      const fakeIdGenerator = () => generateId();
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, fakeIdGenerator);

      const result = await replyRepositoryPostgres.addReply(newReply, uniqueCommentId, uniqueUserId);

      expect(result.id).toBeDefined();
      expect(result.content).toEqual(newReply.content);
      expect(result.owner).toEqual(uniqueUserId);

      const replies = await RepliesTableTestHelper.findRepliesById(result.id);
      expect(replies).toHaveLength(1);
    });
  });

  describe('getReplyById function', () => {
    it('should return reply correctly', async () => {
      const uniqueUserId = generateId();
      const uniqueThreadId = generateId();
      const uniqueCommentId = generateId();
      const uniqueReplyId = generateId();
      const uniqueUsername = `user_${generateId()}`;

      await UsersTableTestHelper.addUser({ id: uniqueUserId, username: uniqueUsername });
      await ThreadsTableTestHelper.addThread({
        id: uniqueThreadId,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: uniqueUserId,
      });
      await CommentsTableTestHelper.addComment({
        id: uniqueCommentId,
        content: 'sebuah comment',
        thread_id: uniqueThreadId,
        owner: uniqueUserId,
      });
      await RepliesTableTestHelper.addReply({
        id: uniqueReplyId,
        content: 'sebuah balasan',
        comment_id: uniqueCommentId,
        owner: uniqueUserId,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const result = await replyRepositoryPostgres.getReplyById(uniqueReplyId);

      expect(result.id).toEqual(uniqueReplyId);
      expect(result.content).toEqual('sebuah balasan');
    });

    it('should return null when reply not found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const result = await replyRepositoryPostgres.getReplyById('reply-xxx');

      expect(result).toBeNull();
    });
  });

  describe('deleteReply function', () => {
    it('should soft delete reply correctly', async () => {
      const uniqueUserId = generateId();
      const uniqueThreadId = generateId();
      const uniqueCommentId = generateId();
      const uniqueReplyId = generateId();
      const uniqueUsername = `user_${generateId()}`;

      await UsersTableTestHelper.addUser({ id: uniqueUserId, username: uniqueUsername });
      await ThreadsTableTestHelper.addThread({
        id: uniqueThreadId,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: uniqueUserId,
      });
      await CommentsTableTestHelper.addComment({
        id: uniqueCommentId,
        content: 'sebuah comment',
        thread_id: uniqueThreadId,
        owner: uniqueUserId,
      });
      await RepliesTableTestHelper.addReply({
        id: uniqueReplyId,
        content: 'sebuah balasan',
        comment_id: uniqueCommentId,
        owner: uniqueUserId,
      });
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      await replyRepositoryPostgres.deleteReply(uniqueReplyId);

      const result = await RepliesTableTestHelper.findRepliesById(uniqueReplyId);
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe('getRepliesByCommentId function', () => {
    it('should return replies by comment id correctly', async () => {
      const uniqueUserId = generateId();
      const uniqueThreadId = generateId();
      const uniqueCommentId = generateId();
      const uniqueReplyId = generateId();
      const uniqueUsername = `user_${generateId()}`;

      await UsersTableTestHelper.addUser({ id: uniqueUserId, username: uniqueUsername });
      await ThreadsTableTestHelper.addThread({
        id: uniqueThreadId,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: uniqueUserId,
      });
      await CommentsTableTestHelper.addComment({
        id: uniqueCommentId,
        content: 'sebuah comment',
        thread_id: uniqueThreadId,
        owner: uniqueUserId,
      });
      await RepliesTableTestHelper.addReply({
        id: uniqueReplyId,
        content: 'sebuah balasan',
        comment_id: uniqueCommentId,
        owner: uniqueUserId,
      });

      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});
      const result = await replyRepositoryPostgres.getRepliesByCommentId(uniqueCommentId);

      expect(result).toHaveLength(1);
      expect(result[0].id).toEqual(uniqueReplyId);
      expect(result[0].content).toEqual('sebuah balasan');
      expect(result[0].username).toEqual(uniqueUsername);
    });

    it('should return empty array when no replies found', async () => {
      const replyRepositoryPostgres = new ReplyRepositoryPostgres(pool, {});

      const result = await replyRepositoryPostgres.getRepliesByCommentId('comment-xxx');

      expect(result).toHaveLength(0);
    });
  });
});
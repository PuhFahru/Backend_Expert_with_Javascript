import CommentsTableTestHelper from '../../../../tests/CommentsTableTestHelper.js';
import ThreadsTableTestHelper from '../../../../tests/ThreadsTableTestHelper.js';
import UsersTableTestHelper from '../../../../tests/UsersTableTestHelper.js';
import pool from '../../database/postgres/pool.js';
import CommentRepositoryPostgres from '../CommentRepositoryPostgres.js';

describe('CommentRepositoryPostgres', () => {
  const generateId = () => `${Date.now()}-${Math.random().toString(36).substring(7)}`;

  afterEach(async () => {
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addComment function', () => {
    it('should persist new comment correctly', async () => {
      const uniqueUserId = generateId();
      const uniqueThreadId = generateId();
      const uniqueUsername = `user_${generateId()}`;

      await UsersTableTestHelper.addUser({ id: uniqueUserId, username: uniqueUsername });
      await ThreadsTableTestHelper.addThread({
        id: uniqueThreadId,
        title: 'sebuah thread',
        body: 'sebuah body thread',
        owner: uniqueUserId,
      });

      const newComment = {
        content: 'sebuah comment',
      };
      const fakeIdGenerator = () => generateId();
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, fakeIdGenerator);

      const result = await commentRepositoryPostgres.addComment(newComment, uniqueThreadId, uniqueUserId);

      expect(result.id).toBeDefined();
      expect(result.content).toEqual(newComment.content);
      expect(result.owner).toEqual(uniqueUserId);

      const comments = await CommentsTableTestHelper.findCommentsById(result.id);
      expect(comments).toHaveLength(1);
    });
  });

  describe('getCommentById function', () => {
    it('should return comment correctly', async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const result = await commentRepositoryPostgres.getCommentById(uniqueCommentId);

      expect(result.id).toEqual(uniqueCommentId);
      expect(result.content).toEqual('sebuah comment');
    });

    it('should return null when comment not found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const result = await commentRepositoryPostgres.getCommentById('comment-xxx');

      expect(result).toBeNull();
    });
  });

  describe('deleteComment function', () => {
    it('should soft delete comment correctly', async () => {
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
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      await commentRepositoryPostgres.deleteComment(uniqueCommentId);

      const result = await CommentsTableTestHelper.findCommentsById(uniqueCommentId);
      expect(result[0].is_delete).toEqual(true);
    });
  });

  describe('getCommentsByThreadId function', () => {
    it('should return comments by thread id correctly', async () => {
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

      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});
      const result = await commentRepositoryPostgres.getCommentsByThreadId(uniqueThreadId);

      expect(result).toHaveLength(1);
      expect(result[0].id).toEqual(uniqueCommentId);
      expect(result[0].content).toEqual('sebuah comment');
      expect(result[0].username).toEqual(uniqueUsername);
    });

    it('should return empty array when no comments found', async () => {
      const commentRepositoryPostgres = new CommentRepositoryPostgres(pool, {});

      const result = await commentRepositoryPostgres.getCommentsByThreadId('thread-xxx');

      expect(result).toHaveLength(0);
    });
  });
});
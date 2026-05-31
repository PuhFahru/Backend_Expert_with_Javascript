import { describe, it, expect, beforeAll, afterAll, afterEach } from 'vitest';
import request from 'supertest';
import createServer from '../src/Infrastructures/http/createServer.js';
import container from '../src/Infrastructures/container.js';
import pool from '../src/Infrastructures/database/postgres/pool.js';
import UsersTableTestHelper from './UsersTableTestHelper.js';
import AuthenticationsTableTestHelper from './AuthenticationsTableTestHelper.js';
import ThreadsTableTestHelper from './ThreadsTableTestHelper.js';
import CommentsTableTestHelper from './CommentsTableTestHelper.js';
import RepliesTableTestHelper from './RepliesTableTestHelper.js';

describe('Threads, Comments, and Replies HTTP API', () => {
  let app;
  let accessToken;
  let userId;

  beforeAll(async () => {
    app = await createServer(container);
  });

  afterAll(async () => {
    await pool.end();
  });

  afterEach(async () => {
    await RepliesTableTestHelper.cleanTable();
    await CommentsTableTestHelper.cleanTable();
    await ThreadsTableTestHelper.cleanTable();
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  const getAccessToken = async () => {
    // Register user
    const userPayload = {
      username: 'dicoding',
      password: 'supersecretpassword',
      fullname: 'Dicoding Indonesia',
    };
    await request(app).post('/users').send(userPayload);

    // Login user
    const loginPayload = {
      username: 'dicoding',
      password: 'supersecretpassword',
    };
    const response = await request(app).post('/authentications').send(loginPayload);

    // Parse JWT to get userId is not needed if we use the token,
    // but we can query UsersTableTestHelper to get the ID if needed.
    const users = await UsersTableTestHelper.findUsersById('user-123'); // Usually it's dynamically generated ID, let's find by username instead
    const allUsers = await pool.query("SELECT id FROM users WHERE username = 'dicoding'");
    userId = allUsers.rows[0].id;
    return response.body.data.accessToken;
  };

  describe('A. Fitur Thread', () => {
    it('POST /threads -> Berhasil membuat thread baru (Response 201)', async () => {
      accessToken = await getAccessToken();
      const payload = {
        title: 'sebuah thread',
        body: 'isi body dari thread',
      };

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedThread).toBeDefined();
      expect(response.body.data.addedThread.title).toEqual(payload.title);
    });

    it('POST /threads -> Gagal jika payload tidak valid/kurang properti (Response 400)', async () => {
      accessToken = await getAccessToken();
      const payload = {
        title: 'sebuah thread',
        // missing body
      };

      const response = await request(app)
        .post('/threads')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('POST /threads -> Gagal jika tidak membawa access token/unauthenticated (Response 401)', async () => {
      const payload = {
        title: 'sebuah thread',
        body: 'isi body dari thread',
      };

      const response = await request(app)
        .post('/threads')
        .send(payload);

      // Depending on authentication strategy implementation, it might be 401.
      // If the error handler maps it to ClientError, it's checked.
      // Usually verifyPayload throws AuthenticationError (401).
      expect(response.status).toEqual(401);
      expect(response.body.status).toEqual('fail');
    });

    it('GET /threads/{threadId} -> Berhasil mendapatkan detail thread lengkap dengan komentar dan balasan (Response 200)', async () => {
      // Prepare data
      await UsersTableTestHelper.addUser({ id: 'user-123', username: 'dicoding' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-123' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-123' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-123' });

      const response = await request(app).get('/threads/thread-123');

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.thread).toBeDefined();
      expect(response.body.data.thread.comments).toHaveLength(1);
      expect(response.body.data.thread.comments[0].replies).toHaveLength(1);
    });

    it('GET /threads/{threadId} -> Gagal jika threadId tidak ditemukan di database (Response 404)', async () => {
      const response = await request(app).get('/threads/thread-not-found');

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('B. Fitur Comment', () => {
    it('POST /threads/{threadId}/comments -> Berhasil menambahkan komentar (Response 201)', async () => {
      accessToken = await getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const payload = { content: 'sebuah komentar' };
      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedComment).toBeDefined();
      expect(response.body.data.addedComment.content).toEqual(payload.content);
    });

    it('POST /threads/{threadId}/comments -> Gagal jika payload kosong (Response 400)', async () => {
      accessToken = await getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const payload = {};
      const response = await request(app)
        .post('/threads/thread-123/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('POST /threads/{threadId}/comments -> Gagal jika threadId tidak ada (Response 404)', async () => {
      accessToken = await getAccessToken();
      const payload = { content: 'sebuah komentar' };

      const response = await request(app)
        .post('/threads/thread-not-found/comments')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });

    it('DELETE /threads/{threadId}/comments/{commentId} -> Berhasil menghapus komentar milik sendiri (Response 200)', async () => {
      accessToken = await getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: userId });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('DELETE /threads/{threadId}/comments/{commentId} -> Gagal jika menghapus komentar milik orang lain (Response 403)', async () => {
      accessToken = await getAccessToken();
      await UsersTableTestHelper.addUser({ id: 'user-999', username: 'otheruser' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-999' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-999' });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
    });

    it('DELETE /threads/{threadId}/comments/{commentId} -> Gagal jika commentId tidak valid (Response 404)', async () => {
      accessToken = await getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-not-found')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(404);
      expect(response.body.status).toEqual('fail');
    });
  });

  describe('C. Fitur Reply', () => {
    it('POST /threads/{threadId}/comments/{commentId}/replies -> Berhasil menambahkan balasan (Response 201)', async () => {
      accessToken = await getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: userId });

      const payload = { content: 'sebuah balasan' };
      const response = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      expect(response.status).toEqual(201);
      expect(response.body.status).toEqual('success');
      expect(response.body.data.addedReply).toBeDefined();
      expect(response.body.data.addedReply.content).toEqual(payload.content);
    });

    it('POST /threads/{threadId}/comments/{commentId}/replies -> Gagal jika payload kosong (Response 400)', async () => {
      accessToken = await getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: userId });

      const payload = {};
      const response = await request(app)
        .post('/threads/thread-123/comments/comment-123/replies')
        .set('Authorization', `Bearer ${accessToken}`)
        .send(payload);

      expect(response.status).toEqual(400);
      expect(response.body.status).toEqual('fail');
    });

    it('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId} -> Berhasil menghapus balasan milik sendiri (Response 200)', async () => {
      accessToken = await getAccessToken();
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: userId });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: userId });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: userId });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(200);
      expect(response.body.status).toEqual('success');
    });

    it('DELETE /threads/{threadId}/comments/{commentId}/replies/{replyId} -> Gagal jika menghapus balasan milik orang lain (Response 403)', async () => {
      accessToken = await getAccessToken();
      await UsersTableTestHelper.addUser({ id: 'user-999', username: 'otheruser' });
      await ThreadsTableTestHelper.addThread({ id: 'thread-123', owner: 'user-999' });
      await CommentsTableTestHelper.addComment({ id: 'comment-123', threadId: 'thread-123', owner: 'user-999' });
      await RepliesTableTestHelper.addReply({ id: 'reply-123', commentId: 'comment-123', owner: 'user-999' });

      const response = await request(app)
        .delete('/threads/thread-123/comments/comment-123/replies/reply-123')
        .set('Authorization', `Bearer ${accessToken}`);

      expect(response.status).toEqual(403);
      expect(response.body.status).toEqual('fail');
    });
  });
});

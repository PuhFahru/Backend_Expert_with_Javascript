import pool from '../../Infrastructures/database/postgres/pool.js';
import CommentRepository from '../../Domains/comments/CommentRepository.js';

class CommentRepositoryPostgres extends CommentRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addComment(newComment, threadId, ownerId) {
    const id = `comment-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();
    const query = {
      text: 'INSERT INTO comments (id, content, thread_id, owner, created_at, is_delete) VALUES ($1, $2, $3, $4, $5, false) RETURNING id, content, owner, created_at',
      values: [id, newComment.content, threadId, ownerId, createdAt],
    };
    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getCommentById(id) {
    const query = {
      text: 'SELECT * FROM comments WHERE id = $1',
      values: [id],
    };
    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async getCommentsByThreadId(threadId) {
    const query = {
      text: 'SELECT c.id, c.content, c.owner, c.created_at, c.is_delete, u.username FROM comments c JOIN users u ON c.owner = u.id WHERE c.thread_id = $1 ORDER BY c.created_at ASC',
      values: [threadId],
    };
    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteComment(id) {
    const query = {
      text: 'UPDATE comments SET is_delete = true WHERE id = $1',
      values: [id],
    };
    await this._pool.query(query);
  }
}

export default CommentRepositoryPostgres;

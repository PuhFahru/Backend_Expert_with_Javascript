import pool from '../../Infrastructures/database/postgres/pool.js';
import ReplyRepository from '../../Domains/replies/ReplyRepository.js';

class ReplyRepositoryPostgres extends ReplyRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addReply(newReply, commentId, ownerId) {
    const id = `reply-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO replies (id, content, comment_id, owner, created_at, is_delete) VALUES ($1, $2, $3, $4, $5, false) RETURNING id, content, owner, created_at',
      values: [id, newReply.content, commentId, ownerId, createdAt],
    };

    const result = await this._pool.query(query);
    return result.rows[0];
  }

  async getReplyById(id) {
    const query = {
      text: 'SELECT * FROM replies WHERE id = $1',
      values: [id],
    };

    const result = await this._pool.query(query);
    return result.rows[0] || null;
  }

  async getRepliesByCommentId(commentId) {
    const query = {
      text: 'SELECT r.id, r.content, r.owner, r.created_at, r.is_delete, u.username FROM replies r JOIN users u ON r.owner = u.id WHERE r.comment_id = $1 ORDER BY r.created_at ASC',
      values: [commentId],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }

  async deleteReply(id) {
    const query = {
      text: 'UPDATE replies SET is_delete = true WHERE id = $1',
      values: [id],
    };

    await this._pool.query(query);
  }
}

export default ReplyRepositoryPostgres;
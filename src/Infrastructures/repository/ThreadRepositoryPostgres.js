import pool from '../../Infrastructures/database/postgres/pool.js';
import ThreadRepository from '../../Domains/threads/ThreadRepository.js';
import RegisteredThread from '../../Domains/threads/entities/RegisteredThread.js';

class ThreadRepositoryPostgres extends ThreadRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async addThread(newThread, ownerId) {
    const id = `thread-${this._idGenerator()}`;
    const createdAt = new Date().toISOString();

    const query = {
      text: 'INSERT INTO threads (id, title, body, owner, created_at) VALUES ($1, $2, $3, $4, $5) RETURNING id, title, body, owner, created_at',
      values: [id, newThread.title, newThread.body, ownerId, createdAt],
    };

    const result = await this._pool.query(query);

    return result.rows[0];
  }

  async getThreadById(id) {
    const query = {
      text: `SELECT t.id, t.title, t.body, t.owner, t.created_at, u.username
             FROM threads t
             JOIN users u ON t.owner = u.id
             WHERE t.id = $1`,
      values: [id],
    };

    const result = await this._pool.query(query);

    if (!result.rows.length) {
      return null;
    }

    return result.rows[0];
  }
}

export default ThreadRepositoryPostgres;
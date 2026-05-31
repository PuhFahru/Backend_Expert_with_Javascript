import { describe, expect, it, vi } from 'vitest';
import handleError from '../errorHandler.js';
import AuthenticationError from '../../../../../Commons/exceptions/AuthenticationError.js';
import AuthorizationError from '../../../../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../../../../Commons/exceptions/NotFoundError.js';
import InvariantError from '../../../../../Commons/exceptions/InvariantError.js';

describe('handleError', () => {
  const mockRes = () => {
    const res = {};
    res.status = vi.fn().mockReturnValue(res);
    res.json = vi.fn().mockReturnValue(res);
    return res;
  };

  it('should return 401 for AuthenticationError', () => {
    const res = mockRes();
    const error = new AuthenticationError('Missing authentication');

    handleError(error, res);

    expect(res.status).toBeCalledWith(401);
    expect(res.json).toBeCalledWith({
      status: 'fail',
      message: 'Missing authentication',
    });
  });

  it('should return 403 for AuthorizationError', () => {
    const res = mockRes();
    const error = new AuthorizationError('Anda tidak berhak mengakses resource ini');

    handleError(error, res);

    expect(res.status).toBeCalledWith(403);
    expect(res.json).toBeCalledWith({
      status: 'fail',
      message: 'Anda tidak berhak mengakses resource ini',
    });
  });

  it('should return 404 for NotFoundError', () => {
    const res = mockRes();
    const error = new NotFoundError('Thread tidak ditemukan');

    handleError(error, res);

    expect(res.status).toBeCalledWith(404);
    expect(res.json).toBeCalledWith({
      status: 'fail',
      message: 'Thread tidak ditemukan',
    });
  });

  it('should return 400 for InvariantError', () => {
    const res = mockRes();
    const error = new InvariantError('tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada');

    handleError(error, res);

    expect(res.status).toBeCalledWith(400);
    expect(res.json).toBeCalledWith({
      status: 'fail',
      message: 'tidak dapat membuat thread baru karena properti yang dibutuhkan tidak ada',
    });
  });

  it('should return 500 for unknown error', () => {
    const res = mockRes();
    const error = new Error('Unknown error');

    handleError(error, res);

    expect(res.status).toBeCalledWith(500);
    expect(res.json).toBeCalledWith({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });
});
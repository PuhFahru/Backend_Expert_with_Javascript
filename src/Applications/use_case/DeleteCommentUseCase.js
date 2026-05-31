import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class DeleteCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, ownerId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
    const comment = await this._commentRepository.getCommentById(commentId);
    if (!comment || comment.thread_id !== threadId) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }
    if (comment.owner !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak menghapus komentar ini');
    }
    return this._commentRepository.deleteComment(commentId);
  }
}

export default DeleteCommentUseCase;

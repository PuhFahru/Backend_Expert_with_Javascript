import AuthorizationError from '../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class DeleteReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(threadId, commentId, replyId, ownerId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const comment = await this._commentRepository.getCommentById(commentId);
    if (!comment || comment.thread_id !== threadId) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    const reply = await this._replyRepository.getReplyById(replyId);
    if (!reply || reply.comment_id !== commentId) {
      throw new NotFoundError('Balasan tidak ditemukan');
    }

    if (reply.owner !== ownerId) {
      throw new AuthorizationError('Anda tidak berhak menghapus balasan ini');
    }

    return this._replyRepository.deleteReply(replyId);
  }
}

export default DeleteReplyUseCase;
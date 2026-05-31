import NewReply from '../../Domains/replies/entities/NewReply.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class AddReplyUseCase {
  constructor({ replyRepository, commentRepository, threadRepository }) {
    this._replyRepository = replyRepository;
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, commentId, ownerId) {
    const newReply = new NewReply(useCasePayload);

    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const comment = await this._commentRepository.getCommentById(commentId);
    if (!comment || comment.thread_id !== threadId) {
      throw new NotFoundError('Komentar tidak ditemukan');
    }

    return this._replyRepository.addReply(newReply, commentId, ownerId);
  }
}

export default AddReplyUseCase;
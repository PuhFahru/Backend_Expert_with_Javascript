import NewComment from '../../Domains/comments/entities/NewComment.js';
import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class AddCommentUseCase {
  constructor({ commentRepository, threadRepository }) {
    this._commentRepository = commentRepository;
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, threadId, ownerId) {
    const newComment = new NewComment(useCasePayload);
    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new NotFoundError('Thread tidak ditemukan');
    }
    return this._commentRepository.addComment(newComment, threadId, ownerId);
  }
}

export default AddCommentUseCase;

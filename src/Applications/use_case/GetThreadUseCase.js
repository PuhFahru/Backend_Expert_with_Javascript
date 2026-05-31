import NotFoundError from '../../Commons/exceptions/NotFoundError.js';

class GetThreadUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(threadId) {
    const thread = await this._threadRepository.getThreadById(threadId);
    if (!thread) {
      throw new NotFoundError('Thread tidak ditemukan');
    }

    const comments = await this._commentRepository.getCommentsByThreadId(threadId);

    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await this._replyRepository.getRepliesByCommentId(comment.id);
        return {
          id: comment.id,
          username: comment.username,
          date: comment.created_at,
          content: comment.is_delete ? '**komentar telah dihapus**' : comment.content,
          replies: replies.map((r) => ({
            id: r.id,
            content: r.is_delete ? '**balasan telah dihapus**' : r.content,
            date: r.created_at,
            username: r.username,
          })),
        };
      })
    );

    return {
      id: thread.id,
      title: thread.title,
      body: thread.body,
      date: thread.created_at,
      username: thread.username,
      comments: commentsWithReplies,
    };
  }
}

export default GetThreadUseCase;
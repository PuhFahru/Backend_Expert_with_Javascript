import { vi } from 'vitest';
import DeleteReplyUseCase from '../DeleteReplyUseCase.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('DeleteReplyUseCase', () => {
  it('should orchestrating delete reply correctly', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const ownerId = 'user-123';

    const mockThread = {
      id: threadId,
    };
    const mockComment = {
      id: commentId,
      thread_id: threadId,
    };
    const mockReply = {
      id: replyId,
      comment_id: commentId,
      owner: ownerId,
    };

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn().mockResolvedValue(mockComment),
    };
    const mockReplyRepository = {
      getReplyById: vi.fn().mockResolvedValue(mockReply),
      deleteReply: vi.fn().mockResolvedValue(undefined),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteReplyUseCase.execute(threadId, commentId, replyId, ownerId);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(mockReplyRepository.getReplyById).toBeCalledWith(replyId);
    expect(mockReplyRepository.deleteReply).toBeCalledWith(replyId);
  });

  it('should throw NotFoundError when thread not found', async () => {
    const threadId = 'thread-xxx';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const ownerId = 'user-123';

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(null),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn(),
    };
    const mockReplyRepository = {
      getReplyById: vi.fn(),
      deleteReply: vi.fn(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteReplyUseCase.execute(threadId, commentId, replyId, ownerId))
      .rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when comment not found', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-xxx';
    const replyId = 'reply-123';
    const ownerId = 'user-123';

    const mockThread = {
      id: threadId,
    };
    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn().mockResolvedValue(null),
    };
    const mockReplyRepository = {
      getReplyById: vi.fn(),
      deleteReply: vi.fn(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteReplyUseCase.execute(threadId, commentId, replyId, ownerId))
      .rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when reply not found', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-xxx';
    const ownerId = 'user-123';

    const mockThread = {
      id: threadId,
    };
    const mockComment = {
      id: commentId,
      thread_id: threadId,
    };
    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn().mockResolvedValue(mockComment),
    };
    const mockReplyRepository = {
      getReplyById: vi.fn().mockResolvedValue(null),
      deleteReply: vi.fn(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteReplyUseCase.execute(threadId, commentId, replyId, ownerId))
      .rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError when user is not the owner', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const replyId = 'reply-123';
    const ownerId = 'user-123';
    const differentUserId = 'user-456';

    const mockThread = {
      id: threadId,
    };
    const mockComment = {
      id: commentId,
      thread_id: threadId,
    };
    const mockReply = {
      id: replyId,
      comment_id: commentId,
      owner: ownerId,
    };

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn().mockResolvedValue(mockComment),
    };
    const mockReplyRepository = {
      getReplyById: vi.fn().mockResolvedValue(mockReply),
      deleteReply: vi.fn(),
    };

    const deleteReplyUseCase = new DeleteReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteReplyUseCase.execute(threadId, commentId, replyId, differentUserId))
      .rejects.toThrow(AuthorizationError);
  });
});
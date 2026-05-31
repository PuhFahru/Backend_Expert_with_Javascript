import { vi } from 'vitest';
import DeleteCommentUseCase from '../DeleteCommentUseCase.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';
import AuthorizationError from '../../../Commons/exceptions/AuthorizationError.js';

describe('DeleteCommentUseCase', () => {
  it('should orchestrating delete comment correctly', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const ownerId = 'user-123';

    const mockThread = {
      id: threadId,
    };
    const mockComment = {
      id: commentId,
      thread_id: threadId,
      owner: ownerId,
    };

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn().mockResolvedValue(mockComment),
      deleteComment: vi.fn().mockResolvedValue(undefined),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await deleteCommentUseCase.execute(threadId, commentId, ownerId);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(mockCommentRepository.deleteComment).toBeCalledWith(commentId);
  });

  it('should throw NotFoundError when thread not found', async () => {
    const threadId = 'thread-xxx';
    const commentId = 'comment-123';
    const ownerId = 'user-123';

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(null),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn(),
      deleteComment: vi.fn(),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute(threadId, commentId, ownerId))
      .rejects.toThrow(NotFoundError);
  });

  it('should throw AuthorizationError when user is not the owner', async () => {
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const ownerId = 'user-123';
    const differentUserId = 'user-456';

    const mockThread = {
      id: threadId,
    };
    const mockComment = {
      id: commentId,
      thread_id: threadId,
      owner: ownerId,
    };

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn().mockResolvedValue(mockComment),
      deleteComment: vi.fn(),
    };

    const deleteCommentUseCase = new DeleteCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(deleteCommentUseCase.execute(threadId, commentId, differentUserId))
      .rejects.toThrow(AuthorizationError);
  });
});
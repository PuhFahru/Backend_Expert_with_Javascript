import { vi } from 'vitest';
import AddCommentUseCase from '../AddCommentUseCase.js';
import NewComment from '../../../Domains/comments/entities/NewComment.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('AddCommentUseCase', () => {
  it('should orchestrating add comment correctly', async () => {
    const useCasePayload = {
      content: 'sebuah comment',
    };
    const threadId = 'thread-123';
    const ownerId = 'user-123';

    const mockThread = {
      id: threadId,
    };
    const mockComment = {
      id: 'comment-123',
      content: useCasePayload.content,
      owner: ownerId,
      created_at: new Date().toISOString(),
    };

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      addComment: vi.fn().mockResolvedValue(mockComment),
    };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedComment = await addCommentUseCase.execute(useCasePayload, threadId, ownerId);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.addComment).toBeCalledWith(expect.any(NewComment), threadId, ownerId);
    expect(addedComment).toHaveProperty('id');
    expect(addedComment.content).toEqual(useCasePayload.content);
    expect(addedComment.owner).toEqual(ownerId);
  });

  it('should throw NotFoundError when thread not found', async () => {
    const useCasePayload = {
      content: 'sebuah comment',
    };
    const threadId = 'thread-xxx';
    const ownerId = 'user-123';

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(null),
    };
    const mockCommentRepository = {
      addComment: vi.fn(),
    };

    const addCommentUseCase = new AddCommentUseCase({
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(addCommentUseCase.execute(useCasePayload, threadId, ownerId))
      .rejects.toThrow(NotFoundError);
  });
});
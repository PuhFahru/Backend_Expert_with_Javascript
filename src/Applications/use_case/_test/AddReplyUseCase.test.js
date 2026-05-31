import { vi } from 'vitest';
import AddReplyUseCase from '../AddReplyUseCase.js';
import NewReply from '../../../Domains/replies/entities/NewReply.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('AddReplyUseCase', () => {
  it('should orchestrating add reply correctly', async () => {
    const useCasePayload = {
      content: 'sebuah balasan',
    };
    const threadId = 'thread-123';
    const commentId = 'comment-123';
    const ownerId = 'user-123';

    const mockThread = {
      id: threadId,
    };
    const mockComment = {
      id: commentId,
      thread_id: threadId,
    };
    const mockReply = {
      id: 'reply-123',
      content: useCasePayload.content,
      owner: ownerId,
      created_at: new Date().toISOString(),
    };

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn().mockResolvedValue(mockComment),
    };
    const mockReplyRepository = {
      addReply: vi.fn().mockResolvedValue(mockReply),
    };

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    const addedReply = await addReplyUseCase.execute(useCasePayload, threadId, commentId, ownerId);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentById).toBeCalledWith(commentId);
    expect(mockReplyRepository.addReply).toBeCalledWith(expect.any(NewReply), commentId, ownerId);
    expect(addedReply).toHaveProperty('id');
    expect(addedReply.content).toEqual(useCasePayload.content);
    expect(addedReply.owner).toEqual(ownerId);
  });

  it('should throw NotFoundError when thread not found', async () => {
    const useCasePayload = {
      content: 'sebuah balasan',
    };
    const threadId = 'thread-xxx';
    const commentId = 'comment-123';
    const ownerId = 'user-123';

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(null),
    };
    const mockCommentRepository = {
      getCommentById: vi.fn(),
    };
    const mockReplyRepository = {
      addReply: vi.fn(),
    };

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(addReplyUseCase.execute(useCasePayload, threadId, commentId, ownerId))
      .rejects.toThrow(NotFoundError);
  });

  it('should throw NotFoundError when comment not found', async () => {
    const useCasePayload = {
      content: 'sebuah balasan',
    };
    const threadId = 'thread-123';
    const commentId = 'comment-xxx';
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
      addReply: vi.fn(),
    };

    const addReplyUseCase = new AddReplyUseCase({
      replyRepository: mockReplyRepository,
      commentRepository: mockCommentRepository,
      threadRepository: mockThreadRepository,
    });

    await expect(addReplyUseCase.execute(useCasePayload, threadId, commentId, ownerId))
      .rejects.toThrow(NotFoundError);
  });
});
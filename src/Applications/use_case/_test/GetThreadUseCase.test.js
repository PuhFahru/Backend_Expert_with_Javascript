import { vi } from 'vitest';
import GetThreadUseCase from '../GetThreadUseCase.js';
import NotFoundError from '../../../Commons/exceptions/NotFoundError.js';

describe('GetThreadUseCase', () => {
  it('should orchestrating get thread correctly', async () => {
    const threadId = 'thread-123';
    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: new Date().toISOString(),
      username: 'dicoding',
    };
    const mockComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        created_at: new Date().toISOString(),
        is_delete: false,
        content: 'sebuah comment',
      },
    ];
    const mockReplies = [];

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: vi.fn().mockResolvedValue(mockComments),
    };
    const mockReplyRepository = {
      getRepliesByCommentId: vi.fn().mockResolvedValue(mockReplies),
    };

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadUseCase.execute(threadId);

    expect(mockThreadRepository.getThreadById).toBeCalledWith(threadId);
    expect(mockCommentRepository.getCommentsByThreadId).toBeCalledWith(threadId);
    expect(mockReplyRepository.getRepliesByCommentId).toBeCalledWith('comment-123');
    expect(thread).toHaveProperty('id');
    expect(thread.title).toEqual(mockThread.title);
    expect(thread.body).toEqual(mockThread.body);
    expect(thread.username).toEqual(mockThread.username);
  });

  it('should throw NotFoundError when thread not found', async () => {
    const threadId = 'thread-xxx';

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(null),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: vi.fn().mockResolvedValue([]),
    };
    const mockReplyRepository = {
      getRepliesByCommentId: vi.fn().mockResolvedValue([]),
    };

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    await expect(getThreadUseCase.execute(threadId)).rejects.toThrow(NotFoundError);
  });

  it('should show **komentar telah dihapus** for deleted comments', async () => {
    const threadId = 'thread-123';
    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: new Date().toISOString(),
      username: 'dicoding',
    };
    const mockComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        created_at: new Date().toISOString(),
        is_delete: true,
        content: 'sebuah comment',
      },
    ];
    const mockReplies = [];

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: vi.fn().mockResolvedValue(mockComments),
    };
    const mockReplyRepository = {
      getRepliesByCommentId: vi.fn().mockResolvedValue(mockReplies),
    };

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadUseCase.execute(threadId);

    expect(thread.comments[0].content).toEqual('**komentar telah dihapus**');
  });

  it('should show **balasan telah dihapus** for deleted replies', async () => {
    const threadId = 'thread-123';
    const mockThread = {
      id: threadId,
      title: 'sebuah thread',
      body: 'sebuah body thread',
      created_at: new Date().toISOString(),
      username: 'dicoding',
    };
    const mockComments = [
      {
        id: 'comment-123',
        username: 'dicoding',
        created_at: new Date().toISOString(),
        is_delete: false,
        content: 'sebuah comment',
      },
    ];
    const mockReplies = [
      {
        id: 'reply-123',
        username: 'dicoding',
        created_at: new Date().toISOString(),
        is_delete: true,
        content: 'sebuah balasan',
      },
    ];

    const mockThreadRepository = {
      getThreadById: vi.fn().mockResolvedValue(mockThread),
    };
    const mockCommentRepository = {
      getCommentsByThreadId: vi.fn().mockResolvedValue(mockComments),
    };
    const mockReplyRepository = {
      getRepliesByCommentId: vi.fn().mockResolvedValue(mockReplies),
    };

    const getThreadUseCase = new GetThreadUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const thread = await getThreadUseCase.execute(threadId);

    expect(thread.comments[0].replies[0].content).toEqual('**balasan telah dihapus**');
  });
});
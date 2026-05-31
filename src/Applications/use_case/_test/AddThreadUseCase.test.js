import { vi } from 'vitest';
import AddThreadUseCase from '../AddThreadUseCase.js';
import NewThread from '../../../Domains/threads/entities/NewThread.js';

describe('AddThreadUseCase', () => {
  it('should orchestrating add thread correctly', async () => {
    const useCasePayload = {
      title: 'sebuah thread',
      body: 'sebuah body thread',
    };
    const ownerId = 'user-123';

    const mockThreadRepository = {
      addThread: vi.fn().mockResolvedValue({
        id: 'thread-123',
        title: useCasePayload.title,
        body: useCasePayload.body,
        owner: ownerId,
        created_at: new Date().toISOString(),
      }),
    };

    const addThreadUseCase = new AddThreadUseCase({
      threadRepository: mockThreadRepository,
    });

    const addedThread = await addThreadUseCase.execute(useCasePayload, ownerId);

    expect(mockThreadRepository.addThread).toBeCalledWith(expect.any(NewThread), ownerId);
    expect(addedThread).toHaveProperty('id');
    expect(addedThread.title).toEqual(useCasePayload.title);
    expect(addedThread.body).toEqual(useCasePayload.body);
    expect(addedThread.owner).toEqual(ownerId);
  });
});
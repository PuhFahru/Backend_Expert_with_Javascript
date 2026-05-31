import { describe, expect, it } from 'vitest';
import ThreadRepository from '../ThreadRepository.js';

describe('ThreadRepository interface', () => {
  it('should throw error when addThread is not implemented', async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.addThread({}))
      .rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getThreadById is not implemented', async () => {
    const threadRepository = new ThreadRepository();

    await expect(threadRepository.getThreadById('thread-123'))
      .rejects.toThrow('THREAD_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
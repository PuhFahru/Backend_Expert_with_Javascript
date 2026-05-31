import { describe, expect, it } from 'vitest';
import CommentRepository from '../CommentRepository.js';

describe('CommentRepository interface', () => {
  it('should throw error when addComment is not implemented', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.addComment({}))
      .rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getCommentById is not implemented', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.getCommentById('comment-123'))
      .rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getCommentsByThreadId is not implemented', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.getCommentsByThreadId('thread-123'))
      .rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when deleteComment is not implemented', async () => {
    const commentRepository = new CommentRepository();

    await expect(commentRepository.deleteComment('comment-123'))
      .rejects.toThrow('COMMENT_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
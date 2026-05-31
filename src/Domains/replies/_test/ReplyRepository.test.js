import { describe, expect, it } from 'vitest';
import ReplyRepository from '../ReplyRepository.js';

describe('ReplyRepository interface', () => {
  it('should throw error when addReply is not implemented', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.addReply({}))
      .rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getReplyById is not implemented', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.getReplyById('reply-123'))
      .rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when getRepliesByCommentId is not implemented', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.getRepliesByCommentId('comment-123'))
      .rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });

  it('should throw error when deleteReply is not implemented', async () => {
    const replyRepository = new ReplyRepository();

    await expect(replyRepository.deleteReply('reply-123'))
      .rejects.toThrow('REPLY_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
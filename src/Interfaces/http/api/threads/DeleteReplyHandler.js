
class DeleteReplyHandler {
  constructor(container) {
    this._container = container;
  }

  async handleDeleteReply(req, res) {
    const authTokenManager = this._container.getInstance('AuthenticationTokenManager');
    const { id: userId } = await authTokenManager.verifyPayload(req.headers.authorization);

    const deleteReplyUseCase = this._container.getInstance('DeleteReplyUseCase');
    await deleteReplyUseCase.execute(
      req.params.threadId,
      req.params.commentId,
      req.params.replyId,
      userId
    );

    res.status(200).json({ status: 'success' });
  }
}

export default DeleteReplyHandler;
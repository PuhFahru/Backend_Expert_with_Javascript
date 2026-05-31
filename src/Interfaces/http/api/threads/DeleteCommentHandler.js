
class DeleteCommentHandler {
  constructor(container) {
    this._container = container;
  }

  async handleDeleteComment(req, res) {
    const authTokenManager = this._container.getInstance('AuthenticationTokenManager');
    const { id: userId } = await authTokenManager.verifyPayload(req.headers.authorization);

    const deleteCommentUseCase = this._container.getInstance('DeleteCommentUseCase');
    await deleteCommentUseCase.execute(req.params.threadId, req.params.commentId, userId);

    res.status(200).json({ status: 'success' });
  }
}

export default DeleteCommentHandler;
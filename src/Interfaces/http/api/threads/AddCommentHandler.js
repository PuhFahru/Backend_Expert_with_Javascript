
class AddCommentHandler {
  constructor(container) {
    this._container = container;
  }

  async handlePostComment(req, res) {
    const authTokenManager = this._container.getInstance('AuthenticationTokenManager');
    const { id: userId } = await authTokenManager.verifyPayload(req.headers.authorization);

    const addCommentUseCase = this._container.getInstance('AddCommentUseCase');
    const addedComment = await addCommentUseCase.execute(req.body, req.params.threadId, userId);

    res.status(201).json({ status: 'success', data: { addedComment } });
  }
}

export default AddCommentHandler;

class AddReplyHandler {
  constructor(container) {
    this._container = container;
  }

  async handlePostReply(req, res) {
    const authTokenManager = this._container.getInstance('AuthenticationTokenManager');
    const { id: userId } = await authTokenManager.verifyPayload(req.headers.authorization);

    const addReplyUseCase = this._container.getInstance('AddReplyUseCase');
    const addedReply = await addReplyUseCase.execute(
      req.body,
      req.params.threadId,
      req.params.commentId,
      userId
    );

    res.status(201).json({ status: 'success', data: { addedReply } });
  }
}

export default AddReplyHandler;
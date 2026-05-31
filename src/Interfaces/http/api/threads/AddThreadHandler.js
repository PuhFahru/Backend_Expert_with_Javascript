
class AddThreadHandler {
  constructor(container) {
    this._container = container;
  }

  async handlePostThread(req, res) {
    const authTokenManager = this._container.getInstance('AuthenticationTokenManager');
    const { id: userId } = await authTokenManager.verifyPayload(req.headers.authorization);

    const addThreadUseCase = this._container.getInstance('AddThreadUseCase');
    const addedThread = await addThreadUseCase.execute(req.body, userId);

    res.status(201).json({ status: 'success', data: { addedThread } });
  }
}

export default AddThreadHandler;
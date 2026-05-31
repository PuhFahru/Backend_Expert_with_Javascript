
class GetThreadHandler {
  constructor(container) {
    this._container = container;
  }

  async handleGetThread(req, res) {
    const getThreadUseCase = this._container.getInstance('GetThreadUseCase');
    const thread = await getThreadUseCase.execute(req.params.threadId);

    res.status(200).json({ status: 'success', data: { thread } });
  }
}

export default GetThreadHandler;
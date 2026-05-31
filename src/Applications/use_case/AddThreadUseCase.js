import NewThread from '../../Domains/threads/entities/NewThread.js';

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(useCasePayload, ownerId) {
    const newThread = new NewThread(useCasePayload);
    return this._threadRepository.addThread(newThread, ownerId);
  }
}

export default AddThreadUseCase;
import AuthenticationError from '../../../../Commons/exceptions/AuthenticationError.js';
import AuthorizationError from '../../../../Commons/exceptions/AuthorizationError.js';
import NotFoundError from '../../../../Commons/exceptions/NotFoundError.js';
import InvariantError from '../../../../Commons/exceptions/InvariantError.js';

const handleError = (error, res) => {
  if (error instanceof AuthenticationError) {
    return res.status(401).json({ status: 'fail', message: error.message });
  }
  if (error instanceof AuthorizationError) {
    return res.status(403).json({ status: 'fail', message: error.message });
  }
  if (error instanceof NotFoundError) {
    return res.status(404).json({ status: 'fail', message: error.message });
  }
  if (error instanceof InvariantError) {
    return res.status(400).json({ status: 'fail', message: error.message });
  }
  return res.status(500).json({ status: 'error', message: 'terjadi kegagalan pada server kami' });
};

export default handleError;
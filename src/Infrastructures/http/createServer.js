import express from 'express';
import ClientError from '../../Commons/exceptions/ClientError.js';
import DomainErrorTranslator from '../../Commons/exceptions/DomainErrorTranslator.js';
import users from '../../Interfaces/http/api/users/index.js';
import authentications from '../../Interfaces/http/api/authentications/index.js';
import threads from '../../Interfaces/http/api/threads/index.js';

const createServer = async (container) => {
  const app = express();
  app.use(express.json());

  app.use('/users', users(container));
  app.use('/authentications', authentications(container));
  app.use('/threads', threads(container));

  app.use((err, req, res, next) => {
    process.stderr.write(`[GLOBAL ERROR HANDLER] Error: ${err.message} ${err.name}\n`);
    const translatedError = DomainErrorTranslator.translate(err);
    process.stderr.write(`[GLOBAL ERROR HANDLER] Translated: ${translatedError.name} ${translatedError.statusCode}\n`);

    if (translatedError instanceof ClientError) {
      process.stderr.write('[GLOBAL ERROR HANDLER] Sending response\n');
      return res.status(translatedError.statusCode).json({
        status: 'fail',
        message: translatedError.message,
      });
    }
    process.stderr.write('[GLOBAL ERROR HANDLER] Falling through\n');
    return res.status(500).json({
      status: 'error',
      message: 'terjadi kegagalan pada server kami',
    });
  });

  app.use((req, res) => {
    res.status(404).json({
      status: 'fail',
      message: 'Route not found',
    });
  });

  return app;
};

export default createServer;

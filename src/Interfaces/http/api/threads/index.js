import express from 'express';
import AddThreadHandler from './AddThreadHandler.js';
import AddCommentHandler from './AddCommentHandler.js';
import DeleteCommentHandler from './DeleteCommentHandler.js';
import AddReplyHandler from './AddReplyHandler.js';
import DeleteReplyHandler from './DeleteReplyHandler.js';
import GetThreadHandler from './GetThreadHandler.js';
import handleError from '../helpers/errorHandler.js';

export default (container) => {
  const router = express.Router();

  const addThreadHandler = new AddThreadHandler(container);
  const addCommentHandler = new AddCommentHandler(container);
  const deleteCommentHandler = new DeleteCommentHandler(container);
  const addReplyHandler = new AddReplyHandler(container);
  const deleteReplyHandler = new DeleteReplyHandler(container);
  const getThreadHandler = new GetThreadHandler(container);

  router.post('/', async (req, res) => {
    try {
      await addThreadHandler.handlePostThread(req, res);
    } catch (error) {
      handleError(error, res);
    }
  });

  router.post('/:threadId/comments', async (req, res) => {
    try {
      await addCommentHandler.handlePostComment(req, res);
    } catch (error) {
      handleError(error, res);
    }
  });

  router.delete('/:threadId/comments/:commentId', async (req, res) => {
    try {
      await deleteCommentHandler.handleDeleteComment(req, res);
    } catch (error) {
      handleError(error, res);
    }
  });

  router.post('/:threadId/comments/:commentId/replies', async (req, res) => {
    try {
      await addReplyHandler.handlePostReply(req, res);
    } catch (error) {
      handleError(error, res);
    }
  });

  router.delete('/:threadId/comments/:commentId/replies/:replyId', async (req, res) => {
    try {
      await deleteReplyHandler.handleDeleteReply(req, res);
    } catch (error) {
      handleError(error, res);
    }
  });

  router.get('/:threadId', async (req, res) => {
    try {
      await getThreadHandler.handleGetThread(req, res);
    } catch (error) {
      handleError(error, res);
    }
  });

  return router;
};
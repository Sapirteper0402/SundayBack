import express from 'express'
import { addBoard, addBoardMsg, getBoardById, getBoards, removeBoard, removeBoardMsg, updateBoard } from './board.controller.js'
import { log } from '../../middlewares/logger.middleware.js'
import { requireAuth } from '../../middlewares/requireAuth.middleware.js'

const router = express.Router()

router.get('/', getBoards)
router.get('/:boardId', getBoardById)
router.delete('/:boardId', log, requireAuth, removeBoard)
router.post('/', requireAuth, addBoard)
router.put('/:boardId', requireAuth, updateBoard)

// router.post('/:boardId/msg', requireAuth, addBoardMsg)
// router.delete('/:boardId/msg/:msgId', requireAuth, removeBoardMsg)

export const boardRoutes = router
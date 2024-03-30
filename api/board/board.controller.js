import { boardService } from './board.service.js'
import { logger } from '../../services/logger.service.js'
import { socketService } from '../../services/socket.service.js'

export async function getBoards(req, res) {
    try {
        logger.debug('Getting Boards:', req.query)
        const filterBy = {
            title: req.query.title || ''
        }
        const boards = await boardService.query(filterBy)
        res.json(boards)
    } catch (err) {
        logger.error('Failed to get boards', err)
        res.status(400).send({ err: 'Failed to get boards' })
    }
}

export async function getBoardById(req, res) {
    const { boardId } = req.params
    // const lastBoardId = req.cookies.lastBoardId
    try {
        // if (lastBoardId === boardId) return res.status(400).send('Dont over do it')
        const board = await boardService.getById(boardId)
        // res.cookie('lastBoardId', boardId, { maxAge: 5 * 1000 })
        res.send(board)
    } catch (err) {
        logger.error('Failed to get board', err)
        res.status(400).send({ err: 'Failed to get board' })
    }
}

export async function addBoard(req, res) {

    logger.info('add board ',  req.body.title)
    const { loggedinUser } = req
    try {
        const BoardTitle = req.body.title || 'New Board'
        const addedBoard = await boardService.add(BoardTitle)
        socketService.broadcast({ type: 'board-added', data: addedBoard, userId: loggedinUser._id })
        res.json(addedBoard)
    } catch (err) {
        logger.error('Failed to add board', err)
        res.status(400).send({ err: 'Failed to add board' })
    }
}


export async function updateBoard(req, res) {
    const { loggedinUser } = req
    try {
        logger.info('update board',  req.body.title)
        const board = req.body
        const updatedBoard = await boardService.update(board)
        socketService.broadcast({ type: 'board-updated', data: updatedBoard, userId: loggedinUser._id })
        res.json(updatedBoard)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(400).send({ err: 'Failed to update board' })

    }
}

export async function removeBoard(req, res) {
    const { loggedinUser } = req
    const { boardId } = req.params
    try {
        const deletedCount = await boardService.remove(boardId)
        socketService.broadcast({ type: 'board-removed', data: boardId, userId: loggedinUser._id })
        res.json(deletedCount)
    } catch (err) {
        logger.error('Failed to remove board', err)
        res.status(400).send({ err: 'Failed to remove board' })
    }
}

export async function addBoardMsg(req, res) {
    const { loggedinUser } = req
    const { boardId } = req.params
    try {
        const msg = {
            txt: req.body.txt,
            by: loggedinUser
        }
        const savedMsg = await boardService.addBoardMsg(boardId, msg)
        res.json(savedMsg)
    } catch (err) {
        logger.error('Failed to update board', err)
        res.status(400).send({ err: 'Failed to update board' })

    }
}

export async function removeBoardMsg(req, res) {
    const { loggedinUser } = req
    const { msgId, boardId } = req.params

    try {
        const removedId = await boardService.removeBoardMsg(boardId, msgId)
        res.send(removedId)
    } catch (err) {
        logger.error('Failed to remove board msg', err)
        res.status(400).send({ err: 'Failed to remove board msg' })
    }
}
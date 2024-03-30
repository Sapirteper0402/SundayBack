import { logger } from "../../services/logger.service.js";
import { utilService } from "../../services/util.service.js";
import { dbService } from "../../services/db.service.js";
import { ObjectId } from "mongodb";
import { asyncLocalStorage } from "../../services/als.service.js";
import { userService } from "../user/user.service.js";

export const boardService = {
  query,
  getById,
  remove,
  add,
  update,
  addBoardMsg,
  removeBoardMsg,
};

const collectionName = "board";

async function query(filterBy = {}) {
  try {
    const criteria = _buildCriteria(filterBy);
    const collection = await dbService.getCollection(collectionName);
    const boardCursor = await collection.find(criteria).toArray();

    const boards = boardCursor.map((board) => ({
      _id: board._id,
      title: board.title,
      numOfGroups: board.groups?.length
    }))

    return boards;
  } catch (err) {
    logger.error(err);
    throw err;
  }
}

async function getById(boardId) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const board = await collection.findOne({ _id: new ObjectId(boardId) });

    if (!board) throw `Couldn't find board with _id ${boardId}`;
    
    const users = await userService.query();
    board.members = users.map((user) => ({
        _id: user._id,
        fullname: user.fullname,
        imgUrl: user.imgUrl
    }))

    return board;
  } catch (err) {
    logger.error(`while finding board ${boardId}`, err);
    throw err;
  }
}

async function remove(boardId) {
  try {
    const collection = await dbService.getCollection(collectionName);
    const { deletedCount } = await collection.deleteOne({
      _id: new ObjectId(boardId),
    });
    return deletedCount;
  } catch (err) {
    logger.error(`cannot remove board ${boardId}`, err);
    throw err;
  }
}

async function add(boardTitle) {
  try {
    console.log(boardTitle)
    const boardToSave = _getEmptyBoard();
    const { loggedinUser } = asyncLocalStorage.getStore();
    
    boardToSave.createdBy = loggedinUser;
    boardToSave.title = boardTitle

    const collection = await dbService.getCollection(collectionName);
    await collection.insertOne(boardToSave);
    return boardToSave;
  } catch (err) {
    logger.error("boardService, can not add board : " + err);
    throw err;
  }
}

async function update(board) {
  try {
    const boardToSave = {
      title: board.title,
      isStarred: board.isStarred,
      archivedAt: board.archivedAt,
      createdBy: board.archivedAt,
      members: board.members,
      groups: board.groups,
      statusPicker: board.statusPicker,
      priorityPicker: board.priorityPicker
    };

    const collection = await dbService.getCollection(collectionName);
    await collection.updateOne(
      { _id: new ObjectId(board._id) },{ $set: boardToSave }
    );
    return board;
  } catch (err) {
    logger.error(`cannot update board ${board._id}`, err);
    throw err;
  }
}

async function addBoardMsg(boardId, msg) {
  try {
    msg.id = utilService.makeId();
    const collection = await dbService.getCollection(collectionName);
    await collection.updateOne(
      { _id: new ObjectId(boardId) },
      { $push: { msgs: msg } }
    );
    return msg;
  } catch (err) {
    logger.error(`cannot add board msg ${boardId}`, err);
    throw err;
  }
}

async function removeBoardMsg(boardId, msgId) {
  try {
    const collection = await dbService.getCollection(collectionName);
    await collection.updateOne(
      { _id: new ObjectId(boardId) },
      { $pull: { msgs: { id: msgId } } }
    );
    return msgId;
  } catch (err) {
    logger.error(`cannot add board msg ${boardId}`, err);
    throw err;
  }
}

function _buildCriteria(filterBy) {
  const criteria = {};

  if (filterBy.title) {
    criteria.title = { $regex: filterBy.title, $options: "i" };
  }

  return criteria;
}

function _getEmptyBoard() {
    return {
      title: "New board",
      isStarred: false,
      archivedAt: 1589983468418,
      createdBy: {
        _id: "",
        fullname: "",
        imgUrl: "",
      },
      members: [
        {
          _id: "u101",
          fullname: "Sapir Teper",
          imgUrl: "",
        },
        {
          _id: "u102",
          fullname: "Nofar Melamed",
          imgUrl: "",
        },
        {
          _id: "u103",
          fullname: "Oren Melamed",
          imgUrl: "",
        },
      ],
      groups: [getEmptyGroup()],
      cmpsOrder: ["people", "status", "priority","timeLine"],
      statusPicker: [
        { label: "Done", backgroundColor: " rgb(0, 200, 117)" },
        { label: "Working on it", backgroundColor: "rgb(253, 171, 61)" },
        { label: "Stuck", backgroundColor: "rgb(226, 68, 92)" },
        { label: "Not Started", backgroundColor: "rgb(196, 196, 196)" },
      ],
      priorityPicker: [
        { label: "Critical ⚠", backgroundColor: "rgb(51, 51, 51)" },
      { label: "High", backgroundColor: "rgb(64, 22, 148)" },
      { label: "Medium", backgroundColor: "rgb(85, 89, 223)" },
      { label: "Low", backgroundColor: "rgb(87, 155, 252)" },
      { label: "", backgroundColor: "rgb(196, 196, 196)" },
    ],
      };
}

export function getEmptyGroup() {
  return {
    id: utilService.makeId(),
    title: "New Group",
    archivedAt: 1589983468418,
    tasks: [],
    style: utilService.getRandomColor(),
  };
}

function _getDefaultActivity() {
  return {
    id: makeId(),
    txt: "",
    createdAt: Date.now(),
    byMember: "" ,//userService.getLoggedinUser(),
    group: group,
    task: task,
  };
}

function _getEmptyTask() {
  return {
    id: utilService.makeId(),
    title: "",
    people: { _id: ""},
    priority: "",
    status: "",
    timeLine: {},
    // description: "",
    // comments: [
    //   {
    //     id: "",
    //     txt: "",
    //     createdAt: new Date(),
    //     byMember: {
    //       _id: "",
    //       fullname: "",
    //       imgUrl:
    //         "",
    //     },
    //   },
    // ],
    // checklists: [
    //   {
    //     id: "YEhmF",
    //     title: "Checklist",
    //     todos: [
    //       {
    //         id: "212jX",
    //         title: "To Do 1",
    //         isDone: false,
    //       },
    //     ],
    //   },
    // ],
    // memberIds: ["u101"],
    // labelIds: ["l101", "l102"],
    // dueDate: 16156215211,
  };
}

function _getComment(){
    return {
        id: utilService.makeId(),
        txt: "",
        createdAt: new Date(),
        byMember: {
          _id: "",
          fullname: "",
          imgUrl:
            "",
        },
      }
}

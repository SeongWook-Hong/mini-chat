import { writeDB } from "../dbController.js";
import { v4 } from "uuid";

const setMsgs = (data) => writeDB("messages", data);

const messageResolver = {
  Query: {
    messages: (parent, { cursor = "" }, { db }) => {
      const fromIndex = db.messages.findIndex((msg) => msg.id === cursor) + 1;
      return db.messages?.slice(fromIndex, fromIndex + 15) || [];
    },
    message: (parent, { id = "" }, { db }) => {
      return db.messages.find((msg) => msg.id === id);
    },
  },
  Mutation: {
    createMessage: (parent, { text, userId }, { db }) => {
      const newMsg = {
        id: v4(),
        text,
        userId,
        timestamp: Date.now(),
      };
      db.messages.unshift(newMsg);
      setMsgs(db.messages);
      return newMsg;
    },
    updateMessage: (parent, { id, text, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw Error("Not Found");
      if (db.messages[targetIndex].userId !== userId)
        throw Error("Different ID");

      const newMsg = { ...db.messages[targetIndex], text: text };
      db.messages.splice(targetIndex, 1, newMsg);
      setMsgs(db.messages);
      return newMsg;
    },
    deleteMessage: (parent, { id, userId }, { db }) => {
      const targetIndex = db.messages.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) throw "메시지가 없습니다";
      if (db.messages[targetIndex].userId !== userId) throw "사용자가 다릅니다";

      db.messages.splice(targetIndex, 1);
      setMsgs(db.messages);
      return id;
    },
  },
  Message: {
    user: (msg, args, { db }) => db.users[msg.userId],
  },
};

export default messageResolver;

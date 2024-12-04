import { useState } from "react";
import MsgItem from "@/components/MsgItems";
import MsgInput from "@/components/MsgInput";

const userIds = ["hong", "wook"];

const originalMsgs = Array(50)
  .fill(0)
  .map((_, index) => ({
    id: index,
    userId: userIds[1],
    timestamp: 1234567890123 + index * 1000 * 60,
    text: `${index} mock text`,
  }));

const MsgList = () => {
  const [msgs, setMsgs] = useState(originalMsgs);
  const onCreate = (text) => {
    const newMsg = {
      id: msgs.length,
      userId: userIds[0],
      timestamp: Date.now(),
      text: `${msgs.length} ${text}`,
    };
    setMsgs((msgs) => [...msgs, newMsg]);
  };
  const onDelete = (id) => {
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === id);
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };
  return (
    <>
      <MsgInput mutate={onCreate} />
      <ul className="flex flex-col p-3 gap-2 bg-gray-800">
        {msgs.map((x) => (
          <MsgItem key={x.id} {...x} onDelete={() => onDelete(x.id)} />
        ))}
      </ul>
    </>
  );
};

export default MsgList;

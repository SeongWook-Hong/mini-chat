import { useEffect, useState } from "react";
import MsgItem from "@/components/MsgItems";
import MsgInput from "@/components/MsgInput";
import fetcher from "@/fetcher";
import { useRouter } from "next/router";

const userIds = ["hong", "wook"];

const MsgList = () => {
  const {
    query: { userId = "" },
  } = useRouter();

  const [msgs, setMsgs] = useState([]);
  const onCreate = async (text) => {
    const newMsg = await fetcher("post", "messages", { text, userId });
    setMsgs((msgs) => [...msgs, newMsg]);
  };
  const onDelete = async (id) => {
    const receivedId = await fetcher("delete", `/messages/${id}`, {
      params: { userId },
    });
    setMsgs((msgs) => {
      const targetIndex = msgs.findIndex((msg) => msg.id === receivedId + "");
      if (targetIndex < 0) return msgs;
      const newMsgs = [...msgs];
      newMsgs.splice(targetIndex, 1);
      return newMsgs;
    });
  };

  const getMessages = async () => {
    const msg = await fetcher("get", "/messages");
    setMsgs(msg);
  };

  useEffect(() => {
    getMessages();
  }, []);

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="flex flex-col p-3 gap-2 bg-gray-800">
        {msgs.map((x) => (
          <MsgItem
            key={x.id}
            {...x}
            onDelete={() => onDelete(x.id)}
            myId={userId}
          />
        ))}
      </ul>
    </>
  );
};

export default MsgList;

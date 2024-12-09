import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import MsgItem from "@/components/MsgItems";
import MsgInput from "@/components/MsgInput";
import fetcher from "@/fetcher";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";

const userIds = ["hong", "wook"];

const MsgList = ({ smsgs, users }) => {
  const {
    query: { userId = "" },
  } = useRouter();

  const [msgs, setMsgs] = useState(smsgs);
  const [hasNext, setHasNext] = useState(true);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

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
    const newMsgs = await fetcher("get", "/messages", {
      params: { cursor: msgs[msgs.length - 1]?.id || "" },
    });
    if (newMsgs.length === 0) {
      setHasNext(false);
      return;
    }
    setMsgs([...msgs, ...newMsgs]);
  };

  useEffect(() => {
    if (intersecting && hasNext) getMessages();
  }, [intersecting]);

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
            user={users[x.userId]}
          />
        ))}
      </ul>
      <div ref={fetchMoreEl}></div>
    </>
  );
};

export default MsgList;

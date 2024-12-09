import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import MsgItem from "@/components/MsgItems";
import MsgInput from "@/components/MsgInput";
import { fetcher, QueryKeys } from "@/queryClient";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGES,
} from "@/graphql/message";

const MsgList = ({ smsgs, users }) => {
  const client = useQueryClient();
  const {
    query: { userId = "" },
  } = useRouter();

  const [msgs, setMsgs] = useState(smsgs);

  const { mutate: onCreate } = useMutation({
    mutationFn: ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    onSuccess: ({ createMessage }) => {
      client.setQueryData(QueryKeys.MESSAGES, (old) => {
        return {
          messages: [createMessage, ...old.messages],
        };
      });
    },
  });

  const { mutate: onDelete } = useMutation({
    mutationFn: (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    onSuccess: ({ deleteMessage: deletedId }) => {
      client.setQueryData(QueryKeys.MESSAGES, (old) => {
        const targetIndex = old.messages.findIndex(
          (msg) => msg.id === deletedId
        );
        if (targetIndex < 0) return old;
        const newMsgs = [...old.messages];
        newMsgs.splice(targetIndex, 1);
        return { messages: newMsgs };
      });
    },
  });

  const { data, error, isError } = useQuery({
    queryKey: QueryKeys.MESSAGES,
    queryFn: () => fetcher(GET_MESSAGES),
  });

  useEffect(() => {
    if (!data?.messages) return;
    setMsgs(data.messages);
  }, [data?.messages]);

  if (isError) {
    console.error(error);
    return null;
  }

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

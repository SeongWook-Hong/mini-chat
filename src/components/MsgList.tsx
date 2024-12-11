import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import MsgItem from "@/components/MsgItems";
import MsgInput from "@/components/MsgInput";
import {
  fetcher,
  findTargetMsgIndex,
  QueryKeys,
  getNewMessages,
} from "@/queryClient";
import useInfiniteScroll from "@/hooks/useInfiniteScroll";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import {
  CREATE_MESSAGE,
  DELETE_MESSAGE,
  GET_MESSAGES,
} from "@/graphql/message";

const MsgList = ({ smsgs }) => {
  const client = useQueryClient();
  const {
    query: { userId = "" },
  } = useRouter();

  const [msgs, setMsgs] = useState([{ messages: smsgs }]);
  const fetchMoreEl = useRef(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const { mutate: onCreate } = useMutation({
    mutationFn: ({ text }) => fetcher(CREATE_MESSAGE, { text, userId }),
    onSuccess: ({ createMessage }) => {
      client.setQueryData(QueryKeys.MESSAGES, (old) => {
        return {
          pageParam: old.pageParam,
          pages: [
            { messages: [createMessage, ...old.pages[0].messages] },
            ...old.pages.slice(1),
          ],
        };
      });
    },
  });

  const { mutate: onDelete } = useMutation({
    mutationFn: (id) => fetcher(DELETE_MESSAGE, { id, userId }),
    onSuccess: ({ deleteMessage: deletedId }) => {
      client.setQueryData(QueryKeys.MESSAGES, (old) => {
        const { pageIndex, msgIndex } = findTargetMsgIndex(
          old.pages,
          deletedId
        );
        if (pageIndex < 0 || msgIndex < 0) return old;
        const newMsgs = getNewMessages(old);
        newMsgs.pages[pageIndex].messages.splice(msgIndex, 1);
        return newMsgs;
      });
    },
  });

  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    {
      queryKey: QueryKeys.MESSAGES,
      queryFn: ({ pageParam = "" }) =>
        fetcher(GET_MESSAGES, { cursor: pageParam }),
      getNextPageParam: ({ messages }) => {
        return messages?.[messages.length - 1]?.id;
      },
    }
  );

  useEffect(() => {
    if (!data?.pages) return;

    setMsgs(data.pages);
  }, [data?.pages]);

  useEffect(() => {
    if (intersecting && hasNextPage) fetchNextPage();
  }, [intersecting, hasNextPage]);

  if (isError) {
    console.error(error);
    return null;
  }

  return (
    <>
      {userId && <MsgInput mutate={onCreate} />}
      <ul className="flex flex-col p-3 gap-2 bg-gray-800">
        {msgs.map(({ messages }) =>
          messages.map((x) => (
            <MsgItem
              key={x.id}
              {...x}
              onDelete={() => onDelete(x.id)}
              myId={userId}
            />
          ))
        )}
      </ul>
      <div ref={fetchMoreEl} />
    </>
  );
};

export default MsgList;

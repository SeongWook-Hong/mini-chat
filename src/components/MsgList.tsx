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

interface Props {
  smsgs: [
    {
      id: string;
      text: string;
      userId: string;
      timestamp: string;
      user: {
        id: string;
        nickname: string;
      };
    }
  ];
}
const MsgList = ({ smsgs }: Props) => {
  const client = useQueryClient();
  const {
    query: { userId = "" },
  } = useRouter();

  const [msgs, setMsgs] = useState([{ messages: smsgs }]);
  const fetchMoreEl = useRef<HTMLDivElement>(null);
  const intersecting = useInfiniteScroll(fetchMoreEl);

  const TopRef = useRef<HTMLDivElement>(null);

  const { mutate: onCreate } = useMutation({
    mutationFn: ({ text }: { text: string }) =>
      fetcher(CREATE_MESSAGE, { text, userId }),
    onSuccess: ({ createMessage }: { createMessage: string }) => {
      client.setQueryData(
        [QueryKeys.MESSAGES],
        (old: { pageParams: []; pages: [{ messages: string }] }) => {
          return {
            pageParams: old.pageParams,
            pages: [
              { messages: [createMessage, ...old.pages[0].messages] },
              ...old.pages.slice(1),
            ],
          };
        }
      );
      TopRef.current?.scrollIntoView({ block: "start" });
    },
  });

  const { mutate: onDelete } = useMutation({
    mutationFn: (id: string) => fetcher(DELETE_MESSAGE, { id, userId }),
    onSuccess: ({ deleteMessage: deletedId }: { deleteMessage: string }) => {
      client.setQueryData(
        [QueryKeys.MESSAGES],
        (old: { pageParams: []; pages: [] }) => {
          const { pageIndex, msgIndex } = findTargetMsgIndex(
            old.pages,
            deletedId
          );
          if (pageIndex < 0 || msgIndex < 0) return old;
          const newMsgs = getNewMessages(old);
          newMsgs.pages[pageIndex].messages.splice(msgIndex, 1);
          return newMsgs;
        }
      );
    },
  });

  const { data, error, isError, fetchNextPage, hasNextPage } = useInfiniteQuery(
    {
      queryKey: [QueryKeys.MESSAGES],
      queryFn: ({ pageParam = "" }: { pageParam?: string }) => {
        return fetcher(GET_MESSAGES, { cursor: pageParam });
      },
      getNextPageParam: ({ messages }: { messages: [{ id: string }] }) => {
        return messages?.[messages.length - 1]?.id;
      },
    }
  );

  useEffect(() => {
    TopRef.current?.scrollIntoView({ block: "start" });
  }, []);

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
      <div ref={fetchMoreEl} />
      <div className="flex flex-col-reverse">
        <div ref={TopRef} />
        {userId && <MsgInput mutate={onCreate} />}
        <ul className="flex flex-col-reverse p-3 gap-2 bg-gray-800">
          {msgs.map(({ messages }) =>
            messages.map((info) => {
              return (
                <MsgItem
                  key={info.id}
                  {...info}
                  onDelete={() => onDelete(info.id)}
                  myId={userId}
                />
              );
            })
          )}
        </ul>
      </div>
    </>
  );
};

export default MsgList;

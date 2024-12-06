const MsgItem = ({ userId, timestamp, text, onDelete, myId }) => {
  return (
    <li>
      <h2 className="text-white pl-[2px] pb-[1px]">{userId}</h2>
      <div className="flex items-end gap-3">
        <div className="relative border-[1px] border-black rounded-md px-3 py-2 max-w-[50%] w-fit break-words text-xl bg-yellow-300">
          {text}
          {myId === userId && (
            <button
              className="absolute -top-5 right-0 text-xs text-gray-500 hover:text-red-500"
              onClick={onDelete}
            >
              ✕
            </button>
          )}
        </div>
        <div className="text-xs text-gray-500 whitespace-pre">
          {new Date(timestamp).toLocaleString("ko-KR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
          }) +
            "\n" +
            new Date(timestamp).toLocaleString("ko-KR", {
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            })}
        </div>
      </div>
    </li>
  );
};

export default MsgItem;

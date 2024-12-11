const MsgItem = ({ timestamp, text, onDelete, myId, user }) => {
  const isMyMsg = myId === user?.id;
  return (
    <li className={`flex ${isMyMsg ? "flex-row-reverse" : ""}`}>
      <div
        className={`flex items-end gap-3 max-w-[50%] ${
          isMyMsg ? "flex-row-reverse" : ""
        }`}
      >
        <div>
          <h2
            className={`text-white pl-[2px] pb-[1px] ${
              isMyMsg ? "text-end" : ""
            }`}
          >
            {user?.nickname}
          </h2>
          <div
            className={`relative border-[1px] border-black rounded-md px-3 py-2 w-fit break-words text-xl ${
              isMyMsg ? "bg-yellow-300" : "bg-gray-600 text-white"
            }`}
          >
            {text}
            {isMyMsg && (
              <button
                className={`absolute -top-5 text-xs text-gray-500 hover:text-red-500 ${
                  isMyMsg ? "left-0" : "right-0"
                }`}
                onClick={onDelete}
              >
                ✕
              </button>
            )}
          </div>
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

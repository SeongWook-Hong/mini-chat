const MsgItem = ({ userId, timestamp, text, onDelete }) => {
  return (
    <li className="border-[1px] border-black rounded-md p-2">
      <h3>
        {userId}{" "}
        <sub>
          {new Date(timestamp).toLocaleString("ko-KR", {
            year: "numeric",
            month: "numeric",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: true,
          })}
        </sub>
      </h3>
      {text}
      <button onClick={onDelete}>삭제</button>
    </li>
  );
};

export default MsgItem;

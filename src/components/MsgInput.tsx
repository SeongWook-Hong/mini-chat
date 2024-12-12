import { useRef } from "react";

const MsgInput = ({ mutate, id = undefined }) => {
  const textRef = useRef(null);

  const onSubmit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const text = textRef.current.value;
    textRef.current.value = "";
    mutate({ text, id });
  };
  return (
    <form
      className="flex justify-center w-[100%] px-10 py-4 gap-6 bg-gray-800"
      onSubmit={onSubmit}
    >
      <textarea
        className="w-[90%] text-center rounded-2xl bg-gray-600 text-white"
        ref={textRef}
        placeholder="내용을 입력하세요"
      />
      <button className="w-12 rounded-2xl bg-gray-600 text-white" type="submit">
        ▶
      </button>
    </form>
  );
};

export default MsgInput;

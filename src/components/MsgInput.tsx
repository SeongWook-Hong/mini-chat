import { useRef } from "react";

interface mutateType {
  text: string;
  id?: string;
}
interface Props {
  mutate: (data: mutateType) => void;
  id?: string;
}

const MsgInput = ({ mutate, id = undefined }: Props) => {
  const textRef = useRef<HTMLTextAreaElement>(null);

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (textRef.current) {
      const text = textRef.current.value;
      textRef.current.value = "";
      mutate({ text, id });
    }
  };
  return (
    <form
      className="flex justify-center w-[100%] px-10 py-4 gap-6 bg-gray-800"
      onSubmit={onSubmit}
    >
      <textarea
        className="w-[90%] text-center h-12 pt-3 rounded-2xl bg-gray-600 text-white"
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

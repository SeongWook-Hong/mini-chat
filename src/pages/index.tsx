import MsgList from "@/components/MsgList";
import { fetcher } from "@/queryClient";
import { GET_MESSAGES } from "@/graphql/message";
import { GET_USERS } from "@/graphql/user";

interface Props {
  smsgs: [
    {
      id: string;
      text: string;
      userId: string;
      timestamp: string;
      user: { id: string; nickname: string };
    }
  ];
  users: [{ id: string; nickname: string }];
}
const Home = ({ smsgs, users }: Props) => {
  return (
    <>
      <MsgList smsgs={smsgs} />
    </>
  );
};

export const getServerSideProps = async () => {
  const [{ messages: smsgs }, { users }] = await Promise.all([
    fetcher(GET_MESSAGES),
    fetcher(GET_USERS),
  ]);

  return {
    props: { smsgs, users },
  };
};

export default Home;

import { MessageItem } from "./message/message-item";

const messages = [
  {
    id: 1,
    message: "Hello, how are you?",
    date: new Date(),
    avatar: "https://avatars.githubusercontent.com/u/107223675?v=4",
    userName: "Kayque Goldner",
  },
];

export const MessageList = () => {
  return (
    <div className="relative h-full">
      <div className="h-full overflow-y-auto px-4">
        {messages.map((message) => (
          <MessageItem
            key={message.id}
            id={message.id}
            message={message.message}
            date={message.date}
            avatar={message.avatar}
            userName={message.userName}
          />
        ))}
      </div>
    </div>
  );
};

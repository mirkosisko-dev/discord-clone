"use client";

import { FC, Fragment } from "react";
import { Member, Message, Profile } from "@prisma/client";
import { Loader2, ServerCrash, Skull } from "lucide-react";
import { format } from "date-fns";

import useChatQuery from "@/hooks/useChatQuery";

import { ChatItem, ChatWelcome } from ".";

interface IChatMessagesProps {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, string>;
  paramKey: "channelId" | "conversationId";
  paramValue: string;
  type: "channel" | "conversation";
}

type MessageWithMemberWithProfile = Message & {
  member: Member & {
    profile: Profile;
  };
};

const DATE_FORMAT = "d MMM yyyy, HH:mm";

const ChatMessages: FC<IChatMessagesProps> = ({
  name,
  member,
  chatId,
  apiUrl,
  socketQuery,
  socketUrl,
  paramKey,
  paramValue,
  type,
}) => {
  const queryKey = `chat:${chatId}`;

  const { data, fetchNextPage, hasNextPage, isFetching, status } = useChatQuery(
    {
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    },
  );

  if (status === "pending")
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading messages...
        </p>
      </div>
    );

  if (status === "error")
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <ServerCrash className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong. Please try again.
        </p>
      </div>
    );

  if (data?.pages[0].items.length === 0)
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <Skull className="my-4 h-7 w-7 text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          No messages found.
        </p>
      </div>
    );

  return (
    <div className="flex flex-1 flex-col overflow-y-auto py-4">
      <div className="flex-1" />

      <ChatWelcome type={type} name={name} />

      <div className="mt-auto flex flex-col-reverse">
        {data?.pages?.map((group, i) => (
          <Fragment key={i}>
            {group?.items?.map((message: MessageWithMemberWithProfile) => (
              <ChatItem
                key={message.id}
                id={message.id}
                currentMember={member}
                member={message.member}
                timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                content={message.content}
                fileUrl={message.fileUrl}
                deleted={message.deleted}
                isUpdated={message.updatedAt !== message.createdAt}
                socketQuery={socketQuery}
                socketUrl={socketUrl}
              />
            ))}
          </Fragment>
        ))}
      </div>
    </div>
  );
};

export default ChatMessages;

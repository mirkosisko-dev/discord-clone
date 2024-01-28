import { FC } from "react";
import { Hash } from "lucide-react";

import MobileToggle from "../mobileToggle";
import UserAvatar from "../userAvatar";
import SocketIndicator from "../sockerIndicator";
import ChatVideoButton from "../chatVideoButton";

interface IChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "conversation";
  imageUrl?: string;
}

const ChatHeader: FC<IChatHeaderProps> = ({
  serverId,
  name,
  type,
  imageUrl,
}) => {
  return (
    <div className="text-md flex min-h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />

      {type === "channel" && (
        <Hash className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />
      )}

      {type === "conversation" && (
        <UserAvatar src={imageUrl} className="mr-2 h-8 w-8 md:h-8 md:w-8" />
      )}
      <p className="text-md font-semibold text-black dark:text-white">{name}</p>

      <div className="ml-auto flex items-center">
        {type === "conversation" && <ChatVideoButton />}
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;

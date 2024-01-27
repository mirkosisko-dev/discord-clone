import { FC } from "react";
import { Hash } from "lucide-react";

import MobileToggle from "../mobileToggle";

interface IChatHeaderProps {
  serverId: string;
  name: string;
  type: "channel" | "member";
  imageUrl?: string;
}

const ChatHeader: FC<IChatHeaderProps> = ({
  serverId,
  name,
  type,
  imageUrl,
}) => {
  return (
    <div className="text-md flex h-12 items-center border-b-2 border-neutral-200 px-3 font-semibold dark:border-neutral-800">
      <MobileToggle serverId={serverId} />

      <Hash className="mr-2 h-5 w-5 text-zinc-500 dark:text-zinc-400" />

      {type === "channel" && (
        <p className="text-md font-semibold text-black dark:text-white">
          {name}
        </p>
      )}
    </div>
  );
};

export default ChatHeader;

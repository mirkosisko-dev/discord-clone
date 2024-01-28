"use client";

import { FC } from "react";
import { usePathname, useSearchParams, useRouter } from "next/navigation";
import { Video, VideoOff } from "lucide-react";

import ActionTooltip from "../actionTooltip";
import qs from "query-string";

interface IChatVideoButtonProps {}

const ChatVideoButton: FC<IChatVideoButtonProps> = ({}) => {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const isVideo = searchParams?.get("video");

  const Icon = isVideo ? VideoOff : Video;
  const tooltipLabel = isVideo ? "End video call" : "Start video call";

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
        },
      },
      { skipNull: true },
    );

    router.push(url);
  };

  return (
    <ActionTooltip side="bottom" label={tooltipLabel}>
      <button onClick={onClick} className="mr-4 transition hover:opacity-75">
        <Icon className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
      </button>
    </ActionTooltip>
  );
};

export default ChatVideoButton;

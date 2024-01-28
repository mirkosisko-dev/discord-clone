"use client";

import { FC, useState, useEffect } from "react";
import { LiveKitRoom, VideoConference } from "@livekit/components-react";
import { Channel } from "@prisma/client";
import { useUser } from "@clerk/nextjs";
import { Loader2 } from "lucide-react";

import "@livekit/components-styles";

interface IMediaRoomProps {
  chatId: string;
  video: boolean;
  audio: boolean;
}

const MediaRoom: FC<IMediaRoomProps> = ({ chatId, video, audio }) => {
  const { user } = useUser();
  const [token, setToken] = useState("");

  useEffect(() => {
    let name: string;
    if (!user) return;

    if (!user?.firstName || !user?.lastName)
      name = user?.emailAddresses[0]?.emailAddress!;

    name = user.firstName + " " + user.lastName;

    (async () => {
      try {
        const response = await fetch(
          `/api/livekit?room=${chatId}&username=${name}`,
        );
        const data = await response.json();

        setToken(data.token);
      } catch (error) {
        console.log("liveKit error", error);
      }
    })();
  }, [chatId, user]);

  if (!token)
    return (
      <div className="flex h-full flex-1 flex-col items-center justify-center">
        <Loader2 className="my-4 h-7 w-7 animate-spin text-zinc-500" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">Loading...</p>
      </div>
    );

  return (
    <LiveKitRoom
      serverUrl={process.env.NEXT_PUBLIC_LIVEKIT_URL}
      token={token}
      connect={true}
      video={video}
      audio={audio}
      data-lk-theme="default "
    >
      <VideoConference />
    </LiveKitRoom>
  );
};

export default MediaRoom;

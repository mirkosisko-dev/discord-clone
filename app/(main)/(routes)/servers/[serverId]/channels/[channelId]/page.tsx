import { FC } from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

import { ChatHeader, ChatInput, ChatMessages } from "@/components/chat";
import { ChannelType } from "@prisma/client";
import MediaRoom from "@/components/mediaRoom";

interface IChannelPageProps {
  params: {
    serverId: string;
    channelId: string;
  };
}

const ChannelPage: FC<IChannelPageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const channel = await db.channel.findUnique({
    where: {
      id: params.channelId,
    },
  });

  const member = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        serverId={params.serverId}
        name={channel.name}
        type="channel"
      />
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            name={channel.name}
            chatId={channel.id}
            type="channel"
            apiUrl="/api/messages"
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            socketUrl="/api/socket/messages"
            paramKey="channelId"
            paramValue={channel.id}
          />

          <ChatInput
            name={channel.name}
            type="channel"
            apiUrl="/api/socket/messages"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}

      {channel.type === ChannelType.AUDIO && (
        <MediaRoom chatId={channel.id} video={false} audio />
      )}

      {channel.type === ChannelType.VIDEO && (
        <MediaRoom chatId={channel.id} video audio={false} />
      )}
    </div>
  );
};

export default ChannelPage;

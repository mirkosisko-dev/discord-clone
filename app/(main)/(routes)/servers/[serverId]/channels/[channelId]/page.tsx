import { FC } from "react";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { ChatHeader } from "@/components/chat";

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
        // serverId={params.serverId}
        // name={
        //   member.profile.name !== "null null"
        //     ? member.profile.name
        //     : member.profile.email
        // }
        // type="member"
        serverId={params.serverId}
        name={channel.name}
        type="channel"
      />
    </div>
  );
};

export default ChannelPage;

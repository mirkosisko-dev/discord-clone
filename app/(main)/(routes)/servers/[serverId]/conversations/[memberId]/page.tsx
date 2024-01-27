import { FC } from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";

import { ChatHeader } from "@/components/chat";

interface IMemberPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
}

const MemberPage: FC<IMemberPageProps> = async ({ params }) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const currentMember = await db.member.findFirst({
    where: {
      serverId: params.serverId,
      profileId: profile.id,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect("/");

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params.memberId,
  );

  console.log({ conversation });

  if (!conversation) return redirect(`/servers/${params.serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex h-full flex-col bg-white dark:bg-[#313338]">
      <ChatHeader
        name={
          otherMember.profile.name !== "null null"
            ? otherMember.profile.name
            : otherMember.profile.email
        }
        type="conversation"
        imageUrl={otherMember.profile.imageUrl}
        serverId={params.serverId}
      />
    </div>
  );
};

export default MemberPage;

import { FC } from "react";
import { redirect } from "next/navigation";
import { redirectToSignIn } from "@clerk/nextjs";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { getOrCreateConversation } from "@/lib/conversation";

import { ChatHeader, ChatInput, ChatMessages } from "@/components/chat";
import MediaRoom from "@/components/mediaRoom";

interface IMemberPageProps {
  params: {
    memberId: string;
    serverId: string;
  };
  searchParams: {
    video?: boolean;
  };
}

const MemberPage: FC<IMemberPageProps> = async ({ params, searchParams }) => {
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

      {searchParams.video ? (
        <MediaRoom chatId={conversation.id} video audio />
      ) : (
        <>
          <ChatMessages
            member={currentMember}
            name={
              otherMember.profile.name !== "null null"
                ? otherMember.profile.name
                : otherMember.profile.email
            }
            chatId={conversation.id}
            type="conversation"
            apiUrl="/api/direct-messages"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketQuery={{
              conversationId: conversation.id,
            }}
            socketUrl="/api/socket/direct-messages"
          />

          <ChatInput
            name={
              otherMember.profile.name !== "null null"
                ? otherMember.profile.name
                : otherMember.profile.email
            }
            type="conversation"
            apiUrl="/api/socket/direct-messages"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberPage;

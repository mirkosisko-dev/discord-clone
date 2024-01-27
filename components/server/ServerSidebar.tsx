import { FC } from "react";
import { redirect } from "next/navigation";
import { ChannelType, MemberRole } from "@prisma/client";
import { Hash, Mic, ShieldAlert, ShieldCheck, Video } from "lucide-react";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import {
  ServerChannel,
  ServerHeader,
  ServerMember,
  ServerSearch,
  ServerSection,
} from ".";
import { ScrollArea } from "../ui/scroll-area";
import { Separator } from "../ui/separator";

interface IServerSidebarProps {
  serverId: string;
  isMobileView?: boolean;
}

const ServerSidebar: FC<IServerSidebarProps> = async ({
  serverId,
  isMobileView = false,
}) => {
  const profile = await currentProfile();

  if (!profile) return redirect("/");

  const server = await db.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      channels: {
        orderBy: {
          createdAt: "asc",
        },
      },
      members: {
        include: {
          profile: true,
        },
        orderBy: {
          role: "asc",
        },
      },
    },
  });

  if (!server) return redirect("/");

  const textChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.TEXT,
  );
  const audioChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.AUDIO,
  );
  const videoChannels = server.channels.filter(
    (channel) => channel.type === ChannelType.VIDEO,
  );

  const members = server.members.filter(
    (member) => member.profileId !== profile.id,
  );

  const role = server.members.find(
    (member) => member.profileId === profile.id,
  )?.role;

  const iconMap = {
    [ChannelType.TEXT]: <Hash className="mr-2 h-4 w-4" />,
    [ChannelType.AUDIO]: <Mic className="mr-2 h-4 w-4" />,
    [ChannelType.VIDEO]: <Video className="mr-2 h-4 w-4" />,
  };

  const roleIconMap = {
    [MemberRole.GUEST]: null,
    [MemberRole.MODERATOR]: (
      <ShieldCheck className="mr-2 h-4 w-4 text-indigo-500" />
    ),
    [MemberRole.ADMIN]: <ShieldAlert className="mr-2 h-4 w-4 text-rose-500" />,
  };

  return (
    <div className="flex h-full w-full flex-col bg-[#F2F3F5] text-primary dark:bg-[#2B2D31]">
      <ServerHeader server={server} role={role} isMobileView={isMobileView} />
      <ScrollArea className="flex-1 px-3">
        <div className="mt-2">
          <ServerSearch
            data={[
              {
                label: "Text Channels",
                type: "channel",
                data: textChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Voice Channels",
                type: "channel",
                data: audioChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Video Channels",
                type: "channel",
                data: videoChannels.map((channel) => ({
                  id: channel.id,
                  name: channel.name,
                  icon: iconMap[channel.type],
                })),
              },
              {
                label: "Members",
                type: "member",
                data: members.map((member) => ({
                  id: member.id,
                  name:
                    member.profile.name !== "null null"
                      ? member.profile.name
                      : member.profile.email,
                  icon: roleIconMap[member.role],
                })),
              },
            ]}
          />
        </div>

        <Separator className="my-2 rounded-md bg-zinc-200 dark:bg-zinc-700" />

        {!!textChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="Text Channels"
              sectionType="channels"
              channelType={ChannelType.TEXT}
              role={role}
            />

            {textChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                server={server}
                role={role}
                channel={channel}
              />
            ))}
          </div>
        )}

        {!!audioChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="Voice Channels"
              sectionType="channels"
              channelType={ChannelType.AUDIO}
              role={role}
            />

            {audioChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                server={server}
                role={role}
                channel={channel}
              />
            ))}
          </div>
        )}

        {!!videoChannels.length && (
          <div className="mb-2">
            <ServerSection
              label="Video Channels"
              sectionType="channels"
              channelType={ChannelType.VIDEO}
              role={role}
            />

            {videoChannels.map((channel) => (
              <ServerChannel
                key={channel.id}
                server={server}
                role={role}
                channel={channel}
              />
            ))}
          </div>
        )}

        {!!members.length && (
          <div className="mb-2">
            <ServerSection
              label="Members"
              sectionType="members"
              role={role}
              server={server}
            />

            {members.map((member) => (
              <ServerMember key={member.id} server={server} member={member} />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};

export default ServerSidebar;

"use client";

import { FC } from "react";
import { useParams, useRouter } from "next/navigation";
import { Member, MemberRole, Profile } from "@prisma/client";

import { ShieldAlert, ShieldCheck } from "lucide-react";
import UserAvatar from "../userAvatar";

import { ServerWithMembersWithProfiles } from "@/types";
import { cn, truncate } from "@/lib/utils";

interface IServerMemberProps {
  member: Member & { profile: Profile };
  server?: ServerWithMembersWithProfiles;
}

const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="ml-2 h-4 w-4 text-indigo-500" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="ml-2 h-4 w-4 text-rose-500" />,
};

const ServerMember: FC<IServerMemberProps> = ({ member, server }) => {
  const router = useRouter();
  const params = useParams();

  const icon = roleIconMap[member.role];

  const handleOnClick = () =>
    router.push(`/servers/${params?.serverId}/conversations/${member.id}`);

  return (
    <button
      className={cn(
        "group mb-1 flex w-full items-center justify-between gap-x-2 rounded-md p-2 transition hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50",
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700",
      )}
      onClick={handleOnClick}
    >
      <UserAvatar src={member.profile.imageUrl} className="h-8 w-8" />
      <p
        className={cn(
          "text-sm font-semibold text-zinc-500 transition group-hover:text-zinc-600 dark:text-zinc-400 dark:group-hover:text-zinc-300",
          params?.memberId === member.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white",
        )}
      >
        {truncate(
          member.profile.name !== "null null"
            ? member.profile.name
            : member.profile.email,
          13,
        )}
      </p>
      {icon}
    </button>
  );
};

export default ServerMember;

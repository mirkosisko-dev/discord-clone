import { redirectToSignIn } from "@clerk/nextjs";
import { redirect } from "next/navigation";
import { FC } from "react";

import { ServerSidebar } from "@/components/server";
import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";

interface IServerPageLayoutProps {
  children: React.ReactNode;
  params: { serverId: string };
}

const ServerPageLayout: FC<IServerPageLayoutProps> = async ({
  children,
  params,
}) => {
  const profile = await currentProfile();

  if (!profile) return redirectToSignIn();

  const server = await db.server.findUnique({
    where: {
      id: params.serverId,
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) return redirect("/");

  return (
    <div className="h-full">
      <div className="fixed inset-y-0 z-20 hidden h-full w-60 flex-col md:flex">
        <ServerSidebar serverId={server.id} />
      </div>
      <main className="h-full md:pl-60">{children}</main>
    </div>
  );
};

export default ServerPageLayout;

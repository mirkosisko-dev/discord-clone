import { FC } from "react";

import { initialProfile } from "@/lib/initialProfile";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { InitialModal } from "@/components/modals";

interface ISetupPageProps {}

const SetupPage: FC<ISetupPageProps> = async ({}) => {
  const profile = await initialProfile();
  const server = await db.server.findFirst({
    where: {
      members: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (server) return redirect(`/servers/${server.id}`);

  return (
    <div>
      <InitialModal />
    </div>
  );
};

export default SetupPage;

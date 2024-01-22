import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";

export async function PATCH(
  req: Request,
  { params }: { params: { serverId: string } },
) {
  try {
    const profile = await currentProfile();
    const { name, imageUrl } = await req.json();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId)
      return new NextResponse("Server ID missing", { status: 404 });

    const server = await db.server.update({
      where: { id: params.serverId, profileId: profile.id },
      data: { name, imageUrl },
    });

    return NextResponse.json(server, { status: 200 });
  } catch (error) {
    console.log("updateServer error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

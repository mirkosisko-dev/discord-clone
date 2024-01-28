import { NextResponse } from "next/server";

import { currentProfile } from "@/lib/currentProfile";
import { db } from "@/lib/db";
import { DirectMessage } from "@prisma/client";

const DIRECT_MESSAGE_BATCH = 10;

export async function GET(req: Request) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    const { searchParams } = new URL(req.url);

    const cursor = searchParams.get("cursor");
    const conversationId = searchParams.get("conversationId");

    if (!conversationId)
      return new NextResponse("Conversation id missing", { status: 404 });

    let directMessages: DirectMessage[] = [];

    if (cursor)
      directMessages = await db.directMessage.findMany({
        take: DIRECT_MESSAGE_BATCH,
        skip: 1,
        cursor: {
          id: cursor,
        },
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });
    else
      directMessages = await db.directMessage.findMany({
        take: DIRECT_MESSAGE_BATCH,
        where: {
          conversationId,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    let nextCursor = null;

    if (directMessages.length === DIRECT_MESSAGE_BATCH)
      nextCursor = directMessages[DIRECT_MESSAGE_BATCH - 1].id;

    return NextResponse.json(
      {
        items: directMessages,
        nextCursor,
      },
      { status: 200 },
    );
  } catch (error) {
    console.log("getDirectMessages error:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}

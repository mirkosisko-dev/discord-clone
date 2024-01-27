"use client";

import { FC } from "react";

import { useSocket } from "../providers/SocketProvider";
import { Badge } from "../ui/badge";

interface ISocketIndicatorProps {}

const SocketIndicator: FC<ISocketIndicatorProps> = ({}) => {
  const { isConnected } = useSocket();

  if (!isConnected)
    return (
      <Badge variant="outline" className="border-none bg-yellow-600 text-white">
        Fallback: Polling every 1s
      </Badge>
    );

  return (
    <Badge variant="outline" className="border-none bg-emerald-600 text-white">
      Live: Real-time updates
    </Badge>
  );
};

export default SocketIndicator;

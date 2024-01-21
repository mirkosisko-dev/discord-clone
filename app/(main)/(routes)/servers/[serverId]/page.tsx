"use client";

import { FC } from "react";

interface IServerPageProps {
  params: {
    serverId: string;
  };
}

const ServerPage: FC<IServerPageProps> = ({ params }) => {
  return <div>{params.serverId}</div>;
};

export default ServerPage;

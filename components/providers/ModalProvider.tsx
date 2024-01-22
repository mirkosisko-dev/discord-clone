"use client";

import { useEffect, useState } from "react";
import {
  CreateChannelModal,
  CreateServerModal,
  EditServerModal,
  InviteModal,
  LeaveServerModal,
  MembersModal,
} from "../modals";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
    </>
  );
};

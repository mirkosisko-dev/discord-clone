"use client";

import { useEffect, useState } from "react";
import {
  CreateChannelModal,
  CreateServerModal,
  DeleteChannelModal,
  DeleteMessageModal,
  DeleteServerModal,
  EditChannelModal,
  EditServerModal,
  InviteModal,
  LeaveServerModal,
  MembersModal,
  MessageFileModal,
} from "../modals";
import { useModalStore } from "@/hooks/useModalStore";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  const { data } = useModalStore();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;

  if (!data) return <CreateServerModal />;

  return (
    <>
      <CreateServerModal />
      <InviteModal />
      <EditServerModal />
      <MembersModal />
      <CreateChannelModal />
      <LeaveServerModal />
      <DeleteServerModal />
      <DeleteChannelModal />
      <EditChannelModal />
      <MessageFileModal />
      <DeleteMessageModal />
    </>
  );
};

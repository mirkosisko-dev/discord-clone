"use client";

import { useEffect, useState } from "react";
import {
  CreateChannelModal,
  CreateServerModal,
  DeleteServerModal,
  EditServerModal,
  InviteModal,
  LeaveServerModal,
  MembersModal,
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
    </>
  );
};

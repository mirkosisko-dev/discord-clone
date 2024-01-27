"use client";

import axios from "axios";
import qs from "query-string";

import { FC, useState } from "react";
import { useRouter } from "next/navigation";

import { useModalStore } from "@/hooks/useModalStore";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";

interface IDeleteChannelModal {}

const DeleteChannelModal: FC<IDeleteChannelModal> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, type, onClose, data } = useModalStore();

  const router = useRouter();

  const { server, channel } = data;

  const onDeleteChannel = async () => {
    try {
      setIsLoading(true);

      const url = qs.stringifyUrl({
        url: `/api/channels/${channel?.id}`,
        query: { serverId: server?.id },
      });
      await axios.delete(url);

      onClose();

      router.refresh();
    } catch (error) {
      console.log("deleteChannel error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && type === "deleteChannel"} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Channel
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br /> #
            <span className="font-semibold text-indigo-500">
              {channel?.name}
            </span>{" "}
            will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <DialogFooter className="bg-gray-100 px-6 py-4">
          <div className="flex w-full items-center justify-between">
            <Button disabled={isLoading} onClick={onClose} variant="ghost">
              Cancel
            </Button>
            <Button
              disabled={isLoading}
              onClick={onDeleteChannel}
              variant="destructive"
            >
              Confirm
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteChannelModal;

"use client";

import axios from "axios";

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

interface IDeleteServerModal {}

const DeleteServerModal: FC<IDeleteServerModal> = ({}) => {
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, type, onClose, data } = useModalStore();

  const router = useRouter();

  const { server } = data;

  const onDeleteServer = async () => {
    try {
      setIsLoading(true);

      await axios.delete(`/api/servers/${server?.id}`);

      onClose();

      router.refresh();
      router.push("/");
    } catch (error) {
      console.log("deleteServer error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && type === "deleteServer"} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Delete Server
          </DialogTitle>

          <DialogDescription className="text-center text-zinc-500">
            Are you sure you want to do this? <br />{" "}
            <span className="font-semibold text-indigo-500">
              {server?.name}
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
              onClick={onDeleteServer}
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

export default DeleteServerModal;

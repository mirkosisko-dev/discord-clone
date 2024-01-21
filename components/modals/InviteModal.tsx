"use client";

import { FC, useEffect, useState } from "react";
import { Check, Copy, RefreshCw } from "lucide-react";

import { useModalStore } from "@/hooks/useModalStore";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useOrigin } from "@/hooks/useOrigin";
import axios from "axios";

interface IInviteModalProps {}

const InviteModal: FC<IInviteModalProps> = ({}) => {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { isOpen, type, onClose, onOpen, data } = useModalStore();
  const origin = useOrigin();

  const { server } = data;

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteUrl);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  const onNewInvitationCode = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`,
      );

      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log("generateNewInviteCode error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen && type === "invite"} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Invite Friends
          </DialogTitle>
        </DialogHeader>

        <div className="p-6">
          <Label className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
            Server invite link
          </Label>
          <div className="mt-2 flex items-center gap-x-2">
            <Input
              disabled={isLoading}
              className="focus:visible:ring-0 focus:visible:ring-offset-0 border-0 bg-zinc-300/50 text-black"
              value={inviteUrl}
              onChange={() => {}}
            />
            <Button size="icon" onClick={handleCopy} disabled={isLoading}>
              {copied ? (
                <Check className="h-4 w-4" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </Button>
          </div>
          <Button
            variant="link"
            size="sm"
            className="mt-4 text-xs text-zinc-500"
            onClick={onNewInvitationCode}
            disabled={isLoading}
          >
            Generate a new link
            <RefreshCw className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default InviteModal;

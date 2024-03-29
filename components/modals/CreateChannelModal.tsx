"use client";

import * as z from "zod";
import qs from "query-string";
import axios from "axios";

import { FC, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";
import { ChannelType } from "@prisma/client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../ui/dialog";
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
  FormField,
  FormItem,
} from "../ui/form";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { useModalStore } from "@/hooks/useModalStore";

interface ICreateChannelModal {}

const formSchema = z.object({
  name: z
    .string()
    .min(1, "Channel name is required")
    .refine((name) => name !== "general", "Channel name cannot be 'general'"),
  type: z.nativeEnum(ChannelType),
});

const CreateChannelModal: FC<ICreateChannelModal> = ({}) => {
  const { isOpen, type, onClose, data } = useModalStore();

  const { channelType } = data;

  const router = useRouter();
  const params = useParams();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: channelType || ChannelType.TEXT,
    },
  });

  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const url = qs.stringifyUrl({
        url: "/api/channels",
        query: {
          serverId: params?.serverId,
        },
      });

      await axios.post(url, values);

      form.reset();
      router.refresh();

      onClose();
    } catch (error) {
      console.log("onSubmit error:", error);
    }
  };

  useEffect(() => {
    if (channelType) form.setValue("type", channelType);
    else form.setValue("type", ChannelType.TEXT);
  }, [channelType, form]);

  return (
    <Dialog
      open={isOpen && type === "createChannel"}
      onOpenChange={() => {
        form.reset();
        onClose();
      }}
    >
      <DialogContent className="overflow-hidden bg-white p-0 text-black">
        <DialogHeader className="px-6 pt-8">
          <DialogTitle className="text-center text-2xl font-bold">
            Create Channel
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="space-y-8 px-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                      Channel name
                    </FormLabel>
                    <FormControl>
                      <Input
                        disabled={isLoading}
                        placeholder="Enter channel name"
                        className="border-0 bg-zinc-300/50 text-black focus-visible:ring-0 focus-visible:ring-offset-0"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-xs font-bold uppercase text-zinc-500 dark:text-secondary/70">
                      Channel type
                    </FormLabel>
                    <Select
                      disabled={isLoading}
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-0 bg-zinc-300/50 capitalize text-black outline-none ring-offset-0 focus:ring-0 focus:ring-offset-0">
                          <SelectValue placeholder="Select a channel type" />
                        </SelectTrigger>
                      </FormControl>

                      <SelectContent>
                        {Object.values(ChannelType).map((type) => (
                          <SelectItem
                            key={type}
                            value={type}
                            className="capitalize"
                          >
                            {type.toLowerCase()}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter className="bg-gray-100 px-6 py-4">
              <Button disabled={isLoading} variant="primary">
                Create
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChannelModal;

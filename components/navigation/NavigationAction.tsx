"use client";

import { FC } from "react";
import { Plus } from "lucide-react";

import ActionTooltip from "../actionTooltip";
import { useModalStore } from "@/hooks/useModalStore";

interface INavigationActionProps {}

const NavigationAction: FC<INavigationActionProps> = ({}) => {
  const { onOpen } = useModalStore();
  return (
    <div>
      <ActionTooltip side="right" align="center" label="Add a server">
        <button
          className="group flex items-center"
          onClick={() => onOpen("createServer")}
        >
          <div className="mx-3 flex h-[48px] w-[48px] items-center justify-center overflow-hidden rounded-[24px] bg-background transition-all group-hover:rounded-[16px] group-hover:bg-emerald-500 dark:bg-neutral-700">
            <Plus
              className="text-emerald-500 transition group-hover:text-white"
              size={25}
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;

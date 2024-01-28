import { FC } from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "../ui/sheet";
import { Button } from "../ui/button";

import { NavigationSidebar } from "../navigation";
import { ServerSidebar } from "../server";

interface IMobileToggleProps {
  serverId: string;
}

const MobileToggle: FC<IMobileToggleProps> = ({ serverId }) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent side="left" className="flex gap-0 p-0">
        <div className="w-[72px]">
          <NavigationSidebar />
        </div>
        <ServerSidebar serverId={serverId} isMobileView />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;

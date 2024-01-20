import ModeToggle from "@/components/modeToggle";
import { UserButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <div className="flex flex-col">
      <UserButton afterSignOutUrl="/" />

      <ModeToggle />
    </div>
  );
}

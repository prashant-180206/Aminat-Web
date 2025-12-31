import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { DraftingCompass, Settings, PlayCircle, Videotape } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type SidebarProps = {
  children?: React.ReactNode;
};

const EditSidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();

  const isActive = (route: string) => pathname?.startsWith(route);

  return (
    <Collapsible className="transition-all ease-in-out duration-300">
      <div className="h-full flex flex-row bg-bg-light">
        <div className="flex flex-col pl-2 py-2 gap-2">
          <CollapsibleTrigger asChild>
            <Button size={"icon"}>☰</Button>
          </CollapsibleTrigger>

          <Button
            asChild
            variant={isActive("/edit/mobjects") ? "secondary" : "ghost"}
          >
            <Link href="/edit/mobjects" aria-label="Mobjects">
              <DraftingCompass size={28} strokeWidth={1.75} />
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive("/edit/animations") ? "secondary" : "ghost"}
          >
            <Link href="/edit/animations" aria-label="Animations">
              <PlayCircle size={28} strokeWidth={1.75} />
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive("/edit/settings") ? "secondary" : "ghost"}
          >
            <Link href="/edit/settings" aria-label="Settings">
              <Settings size={28} strokeWidth={1.75} />
            </Link>
          </Button>

          <Button
            asChild
            variant={isActive("/edit/trackers") ? "secondary" : "ghost"}
          >
            <Link href="/edit/trackers" aria-label="Trackers">
              <Videotape size={28} strokeWidth={1.75} />
            </Link>
          </Button>
        </div>

        <div className="bg-bg-dark">
          <CollapsibleContent className="w-[250px]">
            {children}
          </CollapsibleContent>
        </div>
      </div>
    </Collapsible>
  );
};

export default EditSidebar;

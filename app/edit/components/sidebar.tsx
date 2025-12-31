import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DraftingCompass,
  Settings,
  PlayCircle,
  Videotape,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

type SidebarProps = {
  children?: React.ReactNode;
};

const EditSidebar: React.FC<SidebarProps> = ({ children }) => {
  const pathname = usePathname();

  const isActive = (route: string) => pathname?.startsWith(route);

  const navItems = [
    { route: "/edit/mobjects", icon: DraftingCompass, label: "Mobjects" },
    { route: "/edit/animations", icon: PlayCircle, label: "Animations" },
    { route: "/edit/trackers", icon: Videotape, label: "Trackers" },
    { route: "/edit/settings", icon: Settings, label: "Settings" },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <Collapsible
        defaultOpen
        className="transition-all ease-in-out duration-300"
      >
        <div className=" flex h-screen flex-row bg-card border-r border-border">
          {/* Icon Bar */}
          <div className="flex flex-col p-2 gap-2 bg-muted/30">
            <CollapsibleTrigger asChild>
              <Button size="icon" variant="ghost" className="mb-2">
                <Menu size={20} />
              </Button>
            </CollapsibleTrigger>

            {navItems.map((item) => (
              <Tooltip key={item.route}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    size="icon"
                    variant={isActive(item.route) ? "default" : "ghost"}
                    className={
                      isActive(item.route)
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }
                  >
                    <Link href={item.route} aria-label={item.label}>
                      <item.icon size={20} />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Collapsible Content Panel */}
          <CollapsibleContent className="w-[280px] h-screen border-l border-border">
            {children}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </TooltipProvider>
  );
};

export default EditSidebar;

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
  // Videotape,
  Menu,
  Sigma,
  // SquareCode,
} from "lucide-react";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";
import React from "react";

type SidebarProps = {
  children?: React.ReactNode;
};

const EditSidebar: React.FC<SidebarProps> = ({ children }) => {
  const { projectId } = useParams();
  const path = usePathname();

  const isActive = (route: string) => path.endsWith(route);

  const navItems = [
    {
      route: `/project/${projectId}/edit/mobjects`,
      icon: DraftingCompass,
      label: "Mobjects",
    },
    {
      route: `/project/${projectId}/edit/animations`,
      icon: PlayCircle,
      label: "Animations",
    },
    {
      route: `/project/${projectId}/edit/trackers`,
      icon: Sigma,
      label: "Trackers",
    },
    {
      route: `/project/${projectId}/edit/settings`,
      icon: Settings,
      label: "Settings",
    },
  ];

  return (
    <TooltipProvider delayDuration={300}>
      <Collapsible
        defaultOpen={false}
        className="transition-all ease-in-out duration-300 h-full"
      >
        <div className="flex h-full max-w-[320px] flex-row bg-card border-r border-border">
          {/* Icon Bar - Vertical on all screens */}
          <div className="flex flex-col p-1 sm:p-1.5 md:p-2 gap-1 sm:gap-1.5 md:gap-2 bg-muted/30 min-w-fit">
            <CollapsibleTrigger asChild>
              <Button
                size="icon"
                variant="ghost"
                className="mb-0.5 sm:mb-1 md:mb-2 h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 shrink-0"
              >
                <Menu size={16} className="sm:w-4 sm:h-4 md:w-5 md:h-5" />
              </Button>
            </CollapsibleTrigger>

            {navItems.map((item) => (
              <Tooltip key={item.route}>
                <TooltipTrigger asChild>
                  <Button
                    asChild
                    size="icon"
                    variant={isActive(item.route) ? "default" : "ghost"}
                    className={`h-7 w-7 sm:h-8 sm:w-8 md:h-10 md:w-10 shrink-0 ${
                      isActive(item.route)
                        ? "bg-primary text-primary-foreground"
                        : ""
                    }`}
                  >
                    <Link href={item.route} aria-label={item.label}>
                      <item.icon
                        size={16}
                        className="sm:w-4 sm:h-4 md:w-5 md:h-5"
                      />
                    </Link>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ))}
          </div>

          {/* Collapsible Content Panel - Responsive width */}
          <CollapsibleContent className="w-full sm:w-60 md:w-64 lg:w-full xl:w-80 h-full border-l border-border overflow-hidden">
            {children}
          </CollapsibleContent>
        </div>
      </Collapsible>
    </TooltipProvider>
  );
};

export default EditSidebar;

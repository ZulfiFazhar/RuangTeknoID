// src/components/NavMain.jsx
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Calendar,
  Home,
  Inbox,
  Search,
  Settings,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

export const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/",
      items: [
        {
          title: "Home",
          url: "/",
          icon: Home,
        },
        {
          title: "Inbox",
          url: "/Inbox",
          icon: Inbox,
        },
        {
          title: "Calendar",
          url: "/Calendar",
          icon: Calendar,
        },
        {
          title: "Search",
          url: "/Search",
          icon: Search,
        },
        {
          title: "Settings",
          url: "/Settings",
          icon: Settings,
        },
      ],
    },
  ],
};

export function NavMain() {
  return (
    <>
      {data.navMain.map((item) => (
        <Collapsible
          key={item.title}
          title={item.title}
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <span className="font-bold">{item.title} </span>
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {item.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={item.isActive}>
                        <Link to={item.url}>
                          <item.icon />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
      ))}
    </>
  );
}

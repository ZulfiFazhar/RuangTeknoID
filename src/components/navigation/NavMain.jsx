// src/components/NavMain.jsx
import { Link } from "react-router-dom";
import {
  ChevronRight,
  Home,
  Newspaper,
  Sparkles,
  Bookmark,
  ScrollText,
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
  navAction: [
    {
      title: "Action Menu",
      items: [
        {
          title: "Beranda",
          url: "/",
          icon: Home,
        },
        {
          title: "Penanda",
          url: "/bookmark",
          icon: Bookmark,
        },
        {
          title: "Asisten AI",
          url: "/chatbot",
          icon: Sparkles,
        },
      ],
    },
  ],
  navMain: [
    {
      title: "Komunitas",
      items: [
        {
          title: "Threads",
          url: "/threads",
          icon: Newspaper,
        },
        {
          title: "Posts",
          url: "/posts",
          icon: ScrollText,
        },
      ],
    },
  ],
};

export function NavMain() {
  return (
    <SidebarMenu>
      {data.navAction.map((item) => (
        <SidebarGroup key={item.title}>
          {/* <SidebarGroupLabel className="font-bold">
            {item.title}
          </SidebarGroupLabel> */}
          <SidebarGroupContent>
            <SidebarMenu>
              {item.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        // <SidebarMenuItem key={item.title}>
        //   <SidebarMenuButton asChild>
        //     <Link to={item.url}>
        //       <item.icon />
        //       <span>{item.title}</span>
        //     </Link>
        //   </SidebarMenuButton>
        // </SidebarMenuItem>
      ))}

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
                <span className="font-bold text-black/70">{item.title} </span>
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
    </SidebarMenu>
  );
}

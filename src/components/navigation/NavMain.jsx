// src/components/NavMain.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";
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
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandItem,
  CommandGroup,
} from "@/components/ui/command";
import { data } from "@/components/navigation/data";
import { AuthContext } from "../auth/auth-context";

export function NavMain() {
  const { authStatus } = React.useContext(AuthContext);
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prevOpen) => !prevOpen);
      }
    };

    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <SidebarMenu>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu className="gap-2">
            {data.NavSearch && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <span
                    onClick={() => setOpen(true)}
                    className="flex items-center justify-between w-full cursor-pointer border hover:border-2 hover:border-black bg-black text-white font-semibold"
                  >
                    <span className="flex items-center gap-2">
                      <data.NavSearch.icon width={16} />
                      <span>{data.NavSearch.title}</span>
                    </span>
                    <kbd className="inline-flex items-center gap-1 px-1.5 font-semibold">
                      <span className="text-xs">⌘</span>K
                    </kbd>
                  </span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}

            {authStatus.authStatus && data.NewPost && (
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    to={data.NewPost.url}
                    className="flex items-center gap-2 border hover:border-2 hover:border-black bg-black text-white font-semibold px-2 py-1"
                  >
                    <data.NewPost.icon width={16} />
                    <span>{data.NewPost.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>

      {data.navAction.map((actionGroup) => (
        <SidebarGroup key={actionGroup.title}>
          <SidebarGroupLabel className="font-bold">
            {actionGroup.title}
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {actionGroup.items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url} className="flex items-center gap-2">
                      <item.icon width={16} />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      ))}

      {data.navMain.map((mainGroup) => (
        <Collapsible
          key={mainGroup.title}
          defaultOpen
          className="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel
              asChild
              className="group/label text-sm text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            >
              <CollapsibleTrigger>
                <span className="font-bold text-black/70">
                  {mainGroup.title}
                </span>
                <ChevronRight className="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-90" />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu>
                  {mainGroup.items.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild>
                        <Link to={item.url} className="flex items-center gap-2">
                          <item.icon width={16} />
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

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="History">
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </SidebarMenu>
  );
}

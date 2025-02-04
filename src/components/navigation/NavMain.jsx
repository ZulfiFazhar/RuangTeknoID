// src/components/NavMain.jsx
import React from "react";
import { Link } from "react-router-dom";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { data } from "@/components/navigation/data";
import { AuthContext } from "../auth/auth-context";

export function NavMain() {
  const { authStatus } = React.useContext(AuthContext);

  return (
    <SidebarMenu>
      {authStatus.authStatus && (
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2">
              {data.NewPost && (
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

              {data.AskQuestion && (
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <Link
                      to={data.AskQuestion.url}
                      className="flex items-center gap-2 border hover:border-2 hover:border-black bg-black text-white font-semibold px-2 py-1"
                    >
                      <data.AskQuestion.icon width={16} />
                      <span>{data.AskQuestion.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      )}

      {data.navAction.map((actionGroup) => (
        <SidebarGroup key={actionGroup.title}>
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

      {/* {data.navMain.map((mainGroup) => (
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
      ))} */}
    </SidebarMenu>
  );
}

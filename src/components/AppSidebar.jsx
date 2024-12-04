// src/components/AppSidebar.jsx

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { NavIdentity } from "@/components/navigation/NavIdentity";
import { NavMain } from "@/components/navigation/NavMain";
import { NavUser } from "@/components/navigation/NavUser";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavIdentity />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

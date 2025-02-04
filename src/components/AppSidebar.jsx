// src/components/AppSidebar.jsx
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavMain } from "@/components/navigation/NavMain";

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" className="mt-16">
      <SidebarHeader className="pb-0">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between">
            <span className="menu-text ml-2 mt-1 font-bold">Menu</span>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
    </Sidebar>
  );
}

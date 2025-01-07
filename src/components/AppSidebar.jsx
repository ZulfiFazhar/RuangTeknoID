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
// import { useContext } from "react";
// import { AuthContext } from "../components/auth/auth-context";
// import { Button } from "../components/ui/button";
// import { Link } from "react-router-dom";

export function AppSidebar() {
  // const { authStatus } = useContext(AuthContext);

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

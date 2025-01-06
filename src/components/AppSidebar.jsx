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
import { useContext } from "react";
import { AuthContext } from "../App";
import { useNavigate } from "react-router-dom";

export function AppSidebar() {
  const { authStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <NavIdentity />
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        {authStatus.authStatus ?
          <NavUser /> :
          <div className="flex justify-center">
            <button className="btn-primary" onClick={() => navigate("/login")}>Login</button>
          </div>
        }
      </SidebarFooter>
    </Sidebar>
  );
}

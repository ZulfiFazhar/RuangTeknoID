// src/layout/MainLayout.jsx
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AppHeader } from "@/components/AppHeader";
import PropTypes from "prop-types";

const MainLayout = ({ children }) => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <AppHeader />
        <main className="flex flex-1 flex-col gap-4 p-4 pt-0 mt-14">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;

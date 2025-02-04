// src/layout/MainLayout.jsx
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
// import { AppHeader } from "@/components/AppHeader";s
import { Toaster } from "@/components/ui/toaster";
import PropTypes from "prop-types";
import { Header } from "@/components/Header";

const MainLayout = ({ children }) => {
  return (
    <div>
      <Header />
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* <AppHeader /> */}
          <main className="flex flex-1 flex-col gap-4 p-4 pt-20 bg-background">
            <SidebarTrigger className="fixed z-50" />
            {children}
          </main>
          <Toaster />
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
};

MainLayout.propTypes = {
  children: PropTypes.node,
};

export default MainLayout;

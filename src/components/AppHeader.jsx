// src/components/AppHeader.jsx
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  // BreadcrumbLink,
  BreadcrumbPage,
  // BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { data } from "@/components/navigation/NavMain";

export function AppHeader() {
  const location = useLocation();
  const currentPage = data.navMain[0].items.find(
    (item) => item.url === location.pathname
  );

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="mr-2 h-4" />
        <Breadcrumb>
          <BreadcrumbList>
            {currentPage ? (
              <BreadcrumbItem>
                <Link to={currentPage.url}>
                  <BreadcrumbPage>{currentPage.title}</BreadcrumbPage>
                </Link>
              </BreadcrumbItem>
            ) : (
              <BreadcrumbItem>
                <BreadcrumbPage>Page Not Found</BreadcrumbPage>
              </BreadcrumbItem>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </header>
  );
}

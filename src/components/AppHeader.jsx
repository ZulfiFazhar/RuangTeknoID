// src/components/AppHeader.jsx
import { Link } from "react-router-dom";
import { useLocation } from "react-router-dom";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { data } from "@/components/navigation/data";

export function AppHeader() {
  const location = useLocation();

  // Fungsi untuk menemukan halaman berdasarkan URL
  const findCurrentPage = (url) => {
    const allNavItems = [
      ...data.navAction.flatMap((nav) => nav.items),
      ...data.navMain.flatMap((nav) => nav.items),
      data.NewPost,
    ];
    return allNavItems.find((item) => item.url === url);
  };

  const currentPage = findCurrentPage(location.pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
      {/* Bagian kiri */}
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-2" />
        <Separator orientation="vertical" className="h-4" />
        <Breadcrumb className="items-start">
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

      {/* Bagian kanan */}
      <div>{/* <LoginButton /> */}</div>
    </header>
  );
}

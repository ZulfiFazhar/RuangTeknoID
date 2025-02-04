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
import { data, idBehindUrl, otherUrl } from "@/components/navigation/data";

export function AppHeader() {
  const location = useLocation();

  // Fungsi untuk menemukan halaman berdasarkan URL
  const findCurrentPage = (url) => {
    const allNavItems = [
      ...data.navAction.flatMap((nav) => nav.items),
      // ...data.navMain.flatMap((nav) => nav.items),
      data.NavSearch,
      data.NewPost,
    ];

    const regNav = allNavItems.find((item) => item.url === url);
    if (regNav) {
      return regNav;
    }

    // Jika tidak ditemukan, cari di idBehindUrl
    const unregNav = idBehindUrl.find((item) => {
      const regex = new RegExp("^\\/" + item.frontUrl + "\\/\\d+$");
      if (regex.test(url)) {
        return item;
      }
    });
    if (unregNav) {
      unregNav.url = url;
      return unregNav;
    }

    // Other navigation url
    const otherNav = otherUrl.find((item) => item.url === url);
    if (otherNav) {
      otherNav.url = url;
      return otherNav;
    }
    return null;
  };

  const currentPage = findCurrentPage(location.pathname);

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 px-4 justify-between transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12 fixed bg-background w-full z-50">
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
    </header>
  );
}

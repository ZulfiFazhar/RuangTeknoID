/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  // BadgeCheck,
  // Bell,
  ChevronsUpDown,
  // CreditCard,
  LogIn,
  LogOut,
  ChartArea,
  User,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import api from "@/api/api";
import { useContext, useEffect } from "react";
import { AuthContext } from "../auth/auth-context";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function NavUser() {
  const isMobile = window.innerWidth <= 768;
  const { authStatus, setAuthStatus } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      // Kirim request ke endpoint logout
      await api.post(
        "/user/logout",
        {},
        {
          headers: {
            userid: authStatus.user.userId,
          },
        }
      );

      // Reset authStatus
      setAuthStatus({ authStatus: false });

      // Hapus token dari localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Reload page
      window.location.reload();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  console.log("authStatus: ", authStatus);
  return (
    <div>
      {authStatus.authStatus ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              size="lg"
              className="flex gap-2 py-2 px-4 hover:bg-gray-100 rounded-lg"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={authStatus.user.profile_image_url}
                  alt={authStatus.user.name}
                />
                <AvatarFallback className="rounded-lg">CN</AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-semibold capitalize">
                  {authStatus.user.name}
                </span>
                <span className="truncate text-xs">
                  {authStatus.user.email}
                </span>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="min-w-56 rounded-lg mr-5">
            <DropdownMenuLabel className="p-0 font-normal cursor-default">
              <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarImage
                    src={authStatus.user.profile_image_url}
                    alt={authStatus.user.name}
                  />
                  <AvatarFallback className="rounded-lg">CN</AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-semibold capitalize">
                    {authStatus.user.name}
                  </span>
                  <span className="truncate text-xs">
                    {authStatus.user.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={() => navigate("/users/dashboard")}>
                <ChartArea />
                Dashboard
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/users/profile")}>
                <User />
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate("/users/settings")}>
                <Settings />
                Settings
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Button className="rounded-xl">
          <Link to="/login" className="flex justify-center items-center gap-3">
            <LogIn width={16} />
            <span>Login</span>
          </Link>
        </Button>
      )}
    </div>
  );
}

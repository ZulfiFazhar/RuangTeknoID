import { useLocation } from "react-router-dom";
import { SquareTerminal } from "lucide-react";
import { Link } from "react-router-dom";
import { LoginForm } from "@/components/auth/login-form";
import { RegisterForm } from "@/components/auth/register-form";

export default function AuthPage() {
  const location = useLocation(); // Mengambil path dari route
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Kiri: Kontainer Form */}
      <div className="flex flex-col gap-4 p-6 md:p-10">
        {/* Header */}
        <div className="flex justify-center gap-2 md:justify-start">
          <span className="flex items-center gap-2 font-medium cursor-default">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <SquareTerminal className="size-4" />
            </div>
            Ruang Teknologi Indonesia
          </span>
        </div>

        {/* Form Dinamis */}
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            {isLoginPage ? (
              <>
                <LoginForm />
                <div className="text-center text-sm mt-4">
                  Don&apos;t have an account?{" "}
                  <Link to="/register" className="underline underline-offset-4">
                    Sign up
                  </Link>
                </div>
              </>
            ) : (
              <>
                <RegisterForm />
                <div className="text-center text-sm mt-4">
                  Already have an account?{" "}
                  <Link to="/login" className="underline underline-offset-4">
                    Log in
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Kanan: Gambar */}
      <div className="relative hidden bg-muted lg:block">
        <img
          src="src/assets/placeholder.webp"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </div>
    </div>
  );
}

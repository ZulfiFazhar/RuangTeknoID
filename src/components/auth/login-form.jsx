import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import PropTypes from "prop-types";
import api from "@/api/api";
import { useNavigate } from "react-router-dom";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export function LoginForm({ className, ...props }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmitLogin = async (e) => {
    e.preventDefault();
    setError(null); // Reset error sebelum login
    setLoading(true);

    try {
      const response = await api.post("/user/login", { email, password });
      console.log(response.data);

      // Simpan token di localStorage
      localStorage.setItem("accessToken", response.data.data.accessToken);
      localStorage.setItem("refreshToken", response.data.data.refreshToken);

      // Redirect ke halaman utama atau dashboard
      navigate("/");
    } catch (err) {
      // Tampilkan pesan error
      setError(err.response?.data?.message || "Login failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleErrorReset = () => {
    // Reset error saat dialog Forgot Password dibuka
    setError(null);
  };

  return (
    <form
      onSubmit={handleSubmitLogin}
      className={cn("flex flex-col gap-6", className)}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>

            {/* DialogTrigger untuk Forgot Password */}
            <Dialog>
              <DialogTrigger
                asChild
                onClick={handleErrorReset} // Reset error saat membuka dialog
              >
                <Button
                  variant="link"
                  type="button"
                  className="ml-auto text-sm text-gray-500"
                >
                  Forgot your password?
                </Button>
              </DialogTrigger>
              <DialogContent>
                <ForgotPasswordForm onErrorReset={handleErrorReset} />
              </DialogContent>
            </Dialog>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </form>
  );
}

LoginForm.propTypes = {
  className: PropTypes.string,
};

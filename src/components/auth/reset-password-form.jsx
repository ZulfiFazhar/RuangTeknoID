import PropTypes from "prop-types";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import api from "@/api/api";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export function ResetPassword({ className, ...props }) {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [successDialog, setSuccessDialog] = useState(false);
  const navigate = useNavigate();
  const url = window.location.href;
  const urlObj = new URL(url);
  const token = urlObj.pathname.split("/").pop();

  console.log(token);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    setLoading(true);

    try {
      await api.post(`/user/reset-password/${token}`, {
        newPassword,
      });

      setSuccessDialog(true);
    } catch (err) {
      setError(
        err.response?.data?.error ||
          "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDialogClose = () => {
    setSuccessDialog(false);
    navigate("/login");
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-4">
          <h1 className="text-xl text-center font-bold cursor-default">
            Reset Password
          </h1>
          <p className="text-sm text-center">
            Your new password must be different from previously used passwords.
          </p>
          <div className="flex flex-col gap-6 mt-6">
            <div className="grid gap-2">
              <Label htmlFor="new-password">New Password</Label>
              <Input
                id="new-password"
                type="password"
                placeholder="••••••••"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirm-password">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                placeholder="••••••••"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Resetting..." : "Reset Password"}
            </Button>
          </div>
          <div className="flex items-center justify-center">
            <Link to="/login" className="text-balance">
              <Button variant="link">
                <ArrowLeft />
                Back to login
              </Button>
            </Link>
          </div>
        </div>
      </form>

      {successDialog && (
        <Dialog open={successDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Password Reset Successful</DialogTitle>
            </DialogHeader>
            <p>Your password has been reset successfully.</p>
            <DialogFooter>
              <Button onClick={handleDialogClose}>OK</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

ResetPassword.propTypes = {
  className: PropTypes.string,
};

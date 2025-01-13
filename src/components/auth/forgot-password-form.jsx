import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import PropTypes from "prop-types";
import api from "@/api/api";

export function ForgotPasswordForm({ onErrorReset }) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    // Reset error saat komponen dimount
    onErrorReset();
  }, [onErrorReset]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccessMessage("");
    setLoading(true);

    try {
      const response = await api.post("/user/forgot-password", { email });
      console.log(response.data);

      setSuccessMessage(
        "A password reset link has been sent to your email address."
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to send reset link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Reset Your Password</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email address below to receive a password reset link.
        </p>
      </div>
      <div className="grid gap-4 mb-4">
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
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <>
              <Spinner size="small" className="text-white" />
              Sending..
            </>
          ) : (
            "Send Reset Link"
          )}
        </Button>
        {successMessage && (
          <p className="text-green-500 text-sm">{successMessage}</p>
        )}
        {error && <p className="text-red-500 text-sm">{error}</p>}
      </div>
    </form>
  );
}

ForgotPasswordForm.propTypes = {
  onErrorReset: PropTypes.func.isRequired,
};

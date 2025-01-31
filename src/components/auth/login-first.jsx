import PropTypes from "prop-types";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function LoginFirst({ isOpen, onClose }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Login First</DialogTitle>
        </DialogHeader>
        <p>Anda harus login terlebih dahulu untuk mengakses halaman ini.</p>
        <Link to="/login">
          <Button>Login</Button>
        </Link>
      </DialogContent>
    </Dialog>
  );
}

LoginFirst.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
};

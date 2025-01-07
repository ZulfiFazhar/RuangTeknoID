import { useContext, useState } from "react";
import { AuthContext } from "../components/auth/auth-context";
import LoginFirst from "../components/auth/login-first";

function Bookmark() {
  const { authStatus } = useContext(AuthContext);
  const [isDialogOpen, setIsDialogOpen] = useState(!authStatus.authStatus);

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
  };

  return (
    <div>
      <LoginFirst isOpen={isDialogOpen} onClose={handleCloseDialog} />
      {authStatus.authStatus ? <div>Beranda</div> : null}
    </div>
  );
}

export default Bookmark;

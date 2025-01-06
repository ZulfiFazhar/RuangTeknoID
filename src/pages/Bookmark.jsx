import { useContext } from "react"
import { AuthContext } from "../App"

function Bookmark() {
    const { authStatus } = useContext(AuthContext)
    if (!authStatus.authStatus) {
        return (
            <div>
                <h1>Anda harus login terlebih dahulu untuk melihat bookmark.</h1>
            </div>
        )
    }

  return (
    <div>Beranda</div>
  )
}

export default Bookmark
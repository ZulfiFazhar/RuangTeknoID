import { useContext } from 'react';
import { AuthContext } from '../../App';

function NewPost() {
    const { authStatus } = useContext(AuthContext);

    if (!authStatus.authStatus) {
        return (
            <div>
                <h1>Anda harus login terlebih dahulu untuk membuat postingan baru.</h1>
            </div>
        )
    }

  return (
    <div>New Post Page</div>
  )
}

export default NewPost

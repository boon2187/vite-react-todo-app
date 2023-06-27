import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import { Button } from "@chakra-ui/react";
export const SignIn = () => {
  function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider);
    // const currentUser = auth.currentUser?.displayName;
    // console.log(currentUser);
  }
  return (
    <div>
      <Button onClick={signInWithGoogle}>Googleのアカウントでログイン</Button>
    </div>
  );
};

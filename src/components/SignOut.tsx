import { auth } from "../firebase.ts";
import { Button } from "@chakra-ui/react";

export const SignOut = () => {
  console.log(auth.currentUser?.displayName);
  return (
    <div className="header">
      <Button>サインアウト</Button>
      <h3>{auth.currentUser?.displayName}</h3>
    </div>
  );
};

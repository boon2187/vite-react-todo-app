import { auth } from "../firebase.ts";
import { Avatar, IconButton, Flex, Text } from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";

export const SignOut = () => {
  const photoURL = auth.currentUser?.photoURL;
  console.log(photoURL);
  return (
    <Flex
      bg="#8758ff"
      color="white"
      flexDirection="row-reverse"
      alignItems="center"
      h="50px"
      gap={2}
    >
      <IconButton
        aria-label="Sign Out"
        icon={<UnlockIcon />}
        onClick={() => auth.signOut()}
      >
        サインアウト
      </IconButton>
      <Text>{auth.currentUser?.displayName}</Text>
      <Avatar name="login user name" src={`${photoURL}`} />
    </Flex>
  );
};

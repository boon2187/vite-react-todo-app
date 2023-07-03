import { auth } from "../firebase.ts";
import { Button, Flex, Text } from "@chakra-ui/react";

export const SignOut = () => {
  console.log(auth.currentUser?.displayName);
  return (
    <Flex
      bg="#8758ff"
      color="white"
      flexDirection="row-reverse"
      alignItems="center"
    >
      <Button onClick={() => auth.signOut()} ml="20px">
        サインアウト
      </Button>
      <Text>{auth.currentUser?.displayName}</Text>
    </Flex>
  );
};

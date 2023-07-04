import { auth } from "../firebase.ts";
import { Avatar, IconButton, Flex, Text } from "@chakra-ui/react";
import { UnlockIcon } from "@chakra-ui/icons";

export const SignOut = () => {
  return (
    <Flex
      bg="#1a1a40"
      color="white"
      flexDirection="row-reverse"
      alignItems="center"
      h="50px"
      gap={5}
      mb="30px"
    >
      <IconButton
        colorScheme="purple"
        aria-label="Sign Out"
        icon={<UnlockIcon />}
        onClick={() => auth.signOut()}
      >
        サインアウト
      </IconButton>
      <Text fontSize="xl" fontWeight="bold">
        {auth.currentUser?.displayName}
      </Text>
      <Avatar
        size="sm"
        name="login user name"
        src={`${auth.currentUser?.photoURL}`}
      />
    </Flex>
  );
};

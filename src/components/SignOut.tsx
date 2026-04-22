import { auth } from '../firebase.ts';
import { Avatar, Flex, IconButton, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';

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
        colorPalette="purple"
        aria-label="Sign Out"
        onClick={() => auth.signOut()}
      >
        <FontAwesomeIcon icon={faUnlock} />
      </IconButton>
      <Text fontSize="xl" fontWeight="bold">
        {auth.currentUser?.displayName}
      </Text>
      <Avatar.Root size="sm">
        <Avatar.Fallback name="login user name" />
        <Avatar.Image src={`${auth.currentUser?.photoURL}`} />
      </Avatar.Root>
    </Flex>
  );
};

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { Button, Flex } from '@chakra-ui/react';
import { ArrowRightIcon } from '@chakra-ui/icons';

export const SignIn = () => {
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    // const currentUser = auth.currentUser?.displayName;
    // console.log(currentUser);
  }
  return (
    <Flex>
      <Button mx="auto" colorScheme="teal" onClick={signInWithGoogle}>
        Googleのアカウントでログイン
        <ArrowRightIcon ml="10px" />
      </Button>
    </Flex>
  );
};

import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase.ts';
import { Button, Flex } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';

export const SignIn = () => {
  async function signInWithGoogle() {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }
  return (
    <Flex>
      <Button mx="auto" colorPalette="teal" onClick={signInWithGoogle}>
        Googleのアカウントでログイン
        <FontAwesomeIcon icon={faArrowRight} style={{ marginLeft: '10px' }} />
      </Button>
    </Flex>
  );
};

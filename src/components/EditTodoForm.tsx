import React, { useEffect, useRef, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  HStack,
  Input,
  Portal,
  Text,
  useDisclosure,
} from '@chakra-ui/react';

// propsの型を定義
type EditTodoFormProps = {
  id: string;
  task: string;
  editTask: (id: string, todo: string) => void;
};

export const EditTodoForm = ({ id, task, editTask }: EditTodoFormProps) => {
  // formの内容を保持するstate
  const [value, setValue] = useState<string>(task);
  // Modal用のDisclosureを作成
  const { open, onOpen, onClose } = useDisclosure();

  // formを参照するrefを作成
  const inputRef = useRef<HTMLInputElement>(null);

  // formが表示された時にinputにフォーカスする
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, []);

  // formのsubmit時の処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // idがidのtodoに対して、formの内容(value)でtaskの内容を更新してformの内容を空にする
    // その前にModalをオープンする
    if (!value) {
      onOpen();
      setValue(task);
      return;
    }
    editTask(id, value);
    setValue('');
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Box mt="1rem" mb="2rem">
          <HStack>
            <Input
              ref={inputRef}
              type="text"
              placeholder="What is the task today?"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              bg="#E2E8F0"
              h="45px"
            />
            <Button type="submit" bg="#8758ff" color="white" h="45px">
              <Text px="12px" fontSize="sm">
                Update Task
              </Text>
            </Button>
          </HStack>
        </Box>
      </form>
      <Dialog.Root
        open={open}
        onOpenChange={(e) => {
          if (!e.open) onClose();
        }}
      >
        <Portal>
          <Dialog.Backdrop />
          <Dialog.Positioner>
            <Dialog.Content>
              <Dialog.Header>
                <Dialog.Title>Warning!</Dialog.Title>
              </Dialog.Header>
              <Dialog.Body>
                Empty tasks cannot be accepted. Please enter a task.
              </Dialog.Body>
              <Dialog.Footer>
                <Button colorPalette="blue" mr={3} onClick={onClose}>
                  OK
                </Button>
              </Dialog.Footer>
            </Dialog.Content>
          </Dialog.Positioner>
        </Portal>
      </Dialog.Root>
    </>
  );
};

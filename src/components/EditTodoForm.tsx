import React, { useRef, useState } from 'react';
import { Button, FormControl, HStack, Input, Text } from '@chakra-ui/react';

// propsの型を定義
type EditTodoFormProps = {
  id: string;
  task: string;
  editTask: (id: string, todo: string) => void;
};

export const EditTodoForm = ({ id, task, editTask }: EditTodoFormProps) => {
  // formの内容を保持するstate
  const [value, setValue] = useState<string>(task);
  // formを参照するrefを作成
  const inputRef = useRef<HTMLInputElement>(null);

  // formのsubmit時の処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // idがidのtodoに対して、formの内容(value)でtaskの内容を更新してformの内容を空にする
    if (!value) {
      setValue(task);
      return;
    }
    editTask(id, value);
    setValue('');
    // console.log(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mt="1rem" mb="2rem">
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
      </FormControl>
    </form>
  );
};

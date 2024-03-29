import { Button, FormControl, HStack, Input } from '@chakra-ui/react';
import React, { useState } from 'react';

// propsの型を定義
type TodoFormProps = {
  addTodo: (todo: string) => void;
  // addTodo: Function;
};

export const TodoForm = ({ addTodo }: TodoFormProps) => {
  // formの内容を保持するstate
  const [value, setValue] = useState<string>('');

  // formのsubmit時の処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // formの内容(value)を追加してformの内容を空にする
    if (!value) return;
    addTodo(value);
    setValue('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mt="1rem" mb="1.5rem">
        <HStack>
          <Input
            type="text"
            placeholder="What is the task today?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            bg="whiteAlpha.800"
            h="45px"
          />
          <Button type="submit" colorScheme="purple" color="white" h="45px">
            Add Task
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
};

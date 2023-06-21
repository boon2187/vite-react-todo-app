import React, { useState } from "react";
import { Button, FormControl, HStack, Input } from "@chakra-ui/react";

// propsの型を定義
type EditTodoFormProps = {
  id: string;
  task: string;
  editTask: (id: string, todo: string) => void;
};

export const EditTodoForm = ({ id, task, editTask }: EditTodoFormProps) => {
  // formの内容を保持するstate
  const [value, setValue] = useState<string>(task);

  // formのsubmit時の処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // idがidのtodoに対して、formの内容(value)でtaskの内容を更新してformの内容を空にする
    editTask(id, value);
    setValue("");
    // console.log(value);
  };

  return (
    <form onSubmit={handleSubmit}>
      <FormControl mt="1rem" mb="2rem">
        <HStack>
          <Input
            type="text"
            placeholder="What is the task today?"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            bg="whiteAlpha.800"
          />
          <Button type="submit" bg="#8758ff" color="white">
            Add Task
          </Button>
        </HStack>
      </FormControl>
    </form>
  );
};

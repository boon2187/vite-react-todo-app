import { Button, FormControl, HStack, Input } from "@chakra-ui/react";
import React, { useState } from "react";

// propsの型を定義
type TodoFormProps = {
  addTodo: (todo: string) => void;
  // addTodo: Function;
};

export const TodoForm = ({ addTodo }: TodoFormProps) => {
  // formの内容を保持するstate
  const [value, setValue] = useState<string>("");

  // formのsubmit時の処理
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // formの内容(value)を追加してformの内容を空にする
    if (!value) return;
    addTodo(value);
    setValue("");
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

/* <form className="TodoForm" onSubmit={handleSubmit}>
<input
  type="text"
  className="todo-input"
  placeholder="What is the task today?"
  value={value}
  onChange={(e) => setValue(e.target.value)}
/>
<button type="submit" className="todo-btn">
  Add Task
</button>
</form> */

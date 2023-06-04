import React, { useState } from "react";

// propsの型を定義
type TodoFormProps = {
  addTodo: (todo: string) => void;
  // addTodo: Function;
};

export const TodoForm = ({ addTodo }: TodoFormProps) => {
  const [value, setValue] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    addTodo(value);
    setValue("");
    // console.log(value);
  };

  return (
    <form className="TodoForm" onSubmit={handleSubmit}>
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
    </form>
  );
};

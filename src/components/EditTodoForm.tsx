import React, { useState } from "react";

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
    <form className="TodoForm" onSubmit={handleSubmit}>
      <input
        type="text"
        className="todo-input"
        placeholder="Update the task"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button type="submit" className="todo-btn">
        Update Task
      </button>
    </form>
  );
};

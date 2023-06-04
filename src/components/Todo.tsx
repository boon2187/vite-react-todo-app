// import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";

type TodoProps = {
  id: string;
  task: string;
  completed: boolean;
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string) => void;
};

export const Todo = ({
  id,
  task,
  completed,
  toggleComplete,
  deleteTodo,
  editTodo,
}: TodoProps) => {
  return (
    <div className="Todo">
      <p
        onClick={() => toggleComplete(id)}
        className={`${completed ? "completed" : ""}`}
      >
        {task}
      </p>
      <div>
        <FontAwesomeIcon icon={faPenToSquare} onClick={() => editTodo(id)} />
        <FontAwesomeIcon onClick={() => deleteTodo(id)} icon={faTrash} />
      </div>
    </div>
  );
};

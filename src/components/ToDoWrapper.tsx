import { useState } from "react";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";
uuidv4();

// todoの型を定義
export type Todotype = {
  id: string;
  task: string;
  completed: boolean;
  isEditing: boolean;
};

export const ToDoWrapper = () => {
  // todoの配列をステートとして定義
  const [todos, setTodos] = useState<Todotype[]>([]);

  // todoを追加する関数
  const addTodo = (todo: string) => {
    setTodos([
      ...todos,
      { id: uuidv4(), task: todo, completed: false, isEditing: false },
    ]);
    // console.log(todos);
  };

  // todoの完了状態を変更する関数
  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // todoを削除する関数
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // todoを編集する関数
  const editTodo = (id: string) => {
    // console.log(id);
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  // todoを更新する関数
  const editTask = (id: string, newTask: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, task: newTask, isEditing: !todo.isEditing }
          : todo
      )
    );
  };

  return (
    <div className="TodoWrapper">
      <h1>Get Things Done!</h1>
      <TodoForm addTodo={addTodo} />
      {todos.map((todo, index) =>
        todo.isEditing ? (
          <EditTodoForm
            key={index}
            id={todo.id}
            task={todo.task}
            editTask={editTask}
          />
        ) : (
          <Todo
            key={index}
            id={todo.id}
            task={todo.task}
            completed={todo.completed}
            toggleComplete={toggleComplete}
            deleteTodo={deleteTodo}
            editTodo={editTodo}
          />
        )
      )}
    </div>
  );
};

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
  // todoの中身を保持するステート
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
  // todoコンポーネントに渡す
  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // todoを削除する関数
  // todoコンポーネントに渡す
  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // todoの編集を開始する関数
  // 開始する関数なので、isEditingを反転させるだけ
  // todoコンポーネントに渡す
  const editTodo = (id: string) => {
    // console.log(id);
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo
      )
    );
  };

  // todoを実際に更新する関数
  // 編集開始されたtodoのidと、新しいtodoを受け取ってtodoの中身を更新する
  // isEditingを反転させて戻す
  // editTodoFormコンポーネントに渡す
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
      {/* todoの数だけTodoコンポーネントを作成する */}
      {/* isEditingの状態によって、TodoコンポーネントとEditTodoFormコンポーネント（編集・更新用）を切り替える */}
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

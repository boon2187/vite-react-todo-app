import { useEffect, useState } from "react";
import { TodoForm } from "./TodoForm";
import { v4 as uuidv4 } from "uuid";
import { Todo } from "./Todo";
import { EditTodoForm } from "./EditTodoForm";
import { Box, Text } from "@chakra-ui/react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase.ts";
import { SignIn } from "./SignIn";
import { SignOut } from "./SignOut";
import { Auth } from "firebase/auth";
// import firebase from "firebase/app";
uuidv4();

// todoの型を定義
type Todotype = {
  id: string;
  task: string;
  completed: boolean;
  isEditing: boolean;
  uid: string;
};

export const ToDoWrapper = () => {
  // todoの中身を保持するステート
  const [todos, setTodos] = useState<Todotype[]>([]);

  // ログインしているユーザーの情報を取得
  const [user] = useAuthState(auth);
  // const user = auth.currentUser;

  // todoを追加する関数
  const addTodo = (todo: string) => {
    setTodos([
      ...todos,
      {
        id: uuidv4(), // ここをdoc.idにすればいい気がする
        task: todo,
        completed: false,
        isEditing: false,
        uid: auth.currentUser?.uid as string,
      },
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
    // 削除の手順は調べる必要あり
    // ローカルのtodosを削除して、Firestoreからも削除するがいいのかな…と思う
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // todoの編集を開始する関数
  // 開始する関数なので、isEditingを反転させるだけ
  // todoコンポーネントに渡す
  const editTodo = (id: string) => {
    // ボタンを押したtodoのidと一致するtodoのisEditingを反転させる
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
    // どういう手順でEditし、更新するのか調べる必要あり
    setTodos(
      todos.map((todo) =>
        // 編集するidと一致するtodoのtaskを新しいtaskに更新する
        todo.id === id
          ? { ...todo, task: newTask, isEditing: !todo.isEditing }
          : todo
      )
    );
  };

  // useEffectを使って、ログイン時にFirestoreからtodoを取得する
  useEffect(() => {
    // ログインしているユーザーのtodoのみ取得する
    console.log(auth.currentUser?.uid);
    db.collection("todos")
      .where("uid", "==", `${auth.currentUser?.uid}`)
      .orderBy("createdAt")
      .limit(30)
      .onSnapshot((snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            task: doc.data().task,
            completed: doc.data().completed,
            isEditing: false,
            uid: doc.data().uid,
          }))
        );
      });
  }, [user]);

  return (
    <Box
      bg="#1a1a40"
      mt={20}
      p={8}
      borderRadius={5}
      w="80vw"
      maxWidth="600px"
      mx="auto"
    >
      {user ? (
        <>
          <SignOut />
          <Text color="white" fontSize="3xl" textAlign="center">
            Get Things Done!
          </Text>
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
        </>
      ) : (
        <SignIn />
      )}
    </Box>
  );
};

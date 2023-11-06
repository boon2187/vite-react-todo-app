import { useEffect, useState } from 'react';
import { TodoForm } from './TodoForm';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import { Box, Text } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase.ts';
import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
import firebase from 'firebase/compat/app';

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
  const [user] = useAuthState(auth as any);
  // const user = auth.currentUser;

  // todoを追加する関数
  const addTodo = (todo: string) => {
    // 新しいtodoを作成する
    const newTodo = {
      id: uuidv4(),
      task: todo,
      completed: false,
      isEditing: false,
      uid: auth.currentUser?.uid as string,
    };

    // 新しいtodoをtodosステートに追加する
    setTodos([...todos, newTodo]);

    // firestoreにnewTodoをドキュメントidをidとして追加する
    db.collection('todos').doc(newTodo.id).set({
      task: newTodo.task,
      completed: newTodo.completed,
      isEditing: newTodo.isEditing,
      createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      uid: newTodo.uid,
    });
    // console.log(todos);
  };

  // todoの完了状態を変更する関数
  // todoコンポーネントに渡す
  const toggleComplete = (id: string) => {
    // ボタンを押したtodoのidと一致するtodoのcompletedを反転させる
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    // firestoreの該当のtodoのcompletedを反転させる
    db.collection('todos')
      .doc(id)
      .update({
        completed: !todos.find((todo) => todo.id === id)?.completed,
      });
  };

  // todoを削除する関数
  // todoコンポーネントに渡す
  const deleteTodo = (id: string) => {
    // 削除の手順は調べる必要あり
    // ローカルのtodosを削除して、Firestoreからも削除するがいいのかな…と思う
    setTodos(todos.filter((todo) => todo.id !== id));

    // 該当のtodoをfirestoreからも削除する
    db.collection('todos').doc(id).delete();
  };

  // todoの編集を開始する関数
  // 開始する関数なので、isEditingを反転させるだけ
  // todoコンポーネントに渡す
  const editTodo = async (id: string) => {
    // firestoreの該当のtodoのisEditingを反転させる
    await db
      .collection('todos')
      .doc(id)
      .update({
        isEditing: !todos.find((todo) => todo.id === id)?.isEditing,
      });

    // ボタンを押したtodoのidと一致するtodoのisEditingを反転させる
    setTodos(
      // ローカルのtodosを更新する
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo,
      ),
    );
  };

  // todoを実際に更新する関数
  // 編集開始されたtodoのidと、新しいtodoを受け取ってtodoの中身を更新する
  // isEditingを反転させて戻す
  // editTodoFormコンポーネントに渡す
  const editTask = (id: string, newTask: string) => {
    setTodos(
      todos.map((todo) =>
        // 編集するidと一致するtodoのtaskを新しいtaskに更新する
        todo.id === id
          ? { ...todo, task: newTask, isEditing: !todo.isEditing }
          : todo,
      ),
    );

    // firestoreの該当のtodoのtaskを更新する
    db.collection('todos')
      .doc(id)
      .update({
        task: newTask,
        isEditing: !todos.find((todo) => todo.id === id)?.isEditing,
      });
  };

  // useEffectを使って、ログイン時にFirestoreからtodoを取得する
  useEffect(() => {
    // ログインしているユーザーのtodoのみ取得する
    console.log(auth.currentUser?.uid);
    db.collection('todos')
      .where('uid', '==', `${auth.currentUser?.uid}`)
      .orderBy('createdAt')
      .limit(30)
      .onSnapshot((snapshot) => {
        setTodos(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            task: doc.data().task,
            completed: doc.data().completed,
            isEditing: doc.data().isEditing,
            uid: doc.data().uid,
          })),
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
            ),
          )}
        </>
      ) : (
        <SignIn />
      )}
    </Box>
  );
};

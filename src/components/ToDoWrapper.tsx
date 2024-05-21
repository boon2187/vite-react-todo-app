import { useEffect, useState } from 'react';
import { TodoForm } from './TodoForm';
import { v4 as uuidv4 } from 'uuid';
// import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import { Box, Text } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, db } from '../firebase.ts';
import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
import firebase from 'firebase/compat/app';
import { SortableTodo } from './SortableTodo';
import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

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
  const toggleComplete = async (id: string) => {
    // ボタンを押したtodoのidと一致するtodoのcompletedを反転させる
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    // firestoreの該当のtodoのcompletedを反転させる
    await db
      .collection('todos')
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
    (async () => {
      await db
        .collection('todos')
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
    })();
    // ログインしているユーザーのtodoのみ取得する
    console.log(auth.currentUser?.uid);
  }, [user]);

  // DnDのため
  // センサーを使って、ドラッグアンドドロップの機能を実装する
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over.id) {
      setTodos((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };
  return (
    <Box
      bg="#1a1a40"
      mt={{ base: '3', md: '20' }}
      mx="auto"
      p={{ base: '2', md: '8' }}
      borderRadius={{ base: '0', md: '5' }}
      w={{ base: '95vw', md: '80vs' }}
      maxWidth="600px"
    >
      {user ? (
        <>
          <SignOut />
          <Text color="white" fontSize="3xl" textAlign="center">
            Get Things Done!
          </Text>
          <TodoForm addTodo={addTodo} />
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={todos}
              strategy={verticalListSortingStrategy}
            >
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
                  <SortableTodo
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
            </SortableContext>
          </DndContext>
        </>
      ) : (
        <SignIn />
      )}
    </Box>
  );
};

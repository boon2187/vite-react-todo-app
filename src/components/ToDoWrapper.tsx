import { useEffect, useState } from 'react';
import { TodoForm } from './TodoForm';
import { v4 as uuidv4 } from 'uuid';
import { Todo } from './Todo';
import { EditTodoForm } from './EditTodoForm';
import { Box, Text } from '@chakra-ui/react';
import { useAuthState } from 'react-firebase-hooks/auth';
import type { Auth } from 'firebase/auth';
import { auth, db } from '../firebase.ts';
import { SignIn } from './SignIn';
import { SignOut } from './SignOut';
import firebase from 'firebase/compat/app';
import {
  DndContext,
  type DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

uuidv4();

// Firestore 操作失敗をコンソールに可視化するヘルパー
// void でサイレント化していたのを catch 経由で出すことで、
// ルール拒否・ネットワーク断などの原因究明を早める
const logError = (operation: string) => (error: unknown) => {
  console.error(`[${operation}] failed:`, error);
};

// todoの型を定義
type Todotype = {
  id: string;
  task: string;
  completed: boolean;
  isEditing: boolean;
  uid: string;
  order: number;
};

export const ToDoWrapper = () => {
  // todoの中身を保持するステート
  const [todos, setTodos] = useState<Todotype[]>([]);

  // ログインしているユーザーの情報を取得
  // firebase/compat の auth と modular の Auth 型が合わないため二段キャストで解消
  const [user] = useAuthState(auth as unknown as Auth);

  // ドラッグ入力: マウス/タッチ/キーボードに対応
  // Pointer は 5px 動かさないと発火させないことでクリックと区別
  // Touch は 150ms の長押しでドラッグ開始にしてスクロールと区別
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 150, tolerance: 5 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  // todoを追加する関数
  const addTodo = (todo: string) => {
    // 新しいtodoは末尾に配置
    const maxOrder = todos.length > 0 ? Math.max(...todos.map((t) => t.order)) : -1;

    const newTodo = {
      id: uuidv4(),
      task: todo,
      completed: false,
      isEditing: false,
      uid: auth.currentUser?.uid as string,
      order: maxOrder + 1,
    };

    setTodos([...todos, newTodo]);

    db.collection('todos')
      .doc(newTodo.id)
      .set({
        task: newTodo.task,
        completed: newTodo.completed,
        isEditing: newTodo.isEditing,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid: newTodo.uid,
        order: newTodo.order,
      })
      .catch(logError('addTodo'));
  };

  const toggleComplete = (id: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo,
      ),
    );
    db.collection('todos')
      .doc(id)
      .update({
        completed: !todos.find((todo) => todo.id === id)?.completed,
      })
      .catch(logError('toggleComplete'));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((todo) => todo.id !== id));
    db.collection('todos').doc(id).delete().catch(logError('deleteTodo'));
  };

  const editTodo = (id: string) => {
    db.collection('todos')
      .doc(id)
      .update({
        isEditing: !todos.find((todo) => todo.id === id)?.isEditing,
      })
      .catch(logError('editTodo'));

    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, isEditing: !todo.isEditing } : todo,
      ),
    );
  };

  const editTask = (id: string, newTask: string) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? { ...todo, task: newTask, isEditing: !todo.isEditing }
          : todo,
      ),
    );

    db.collection('todos')
      .doc(id)
      .update({
        task: newTask,
        isEditing: !todos.find((todo) => todo.id === id)?.isEditing,
      })
      .catch(logError('editTask'));
  };

  // ドラッグ終了時: ローカル並び替え → Firestore に order を一括書き込み
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;

    const reordered = arrayMove(todos, oldIndex, newIndex).map((t, i) => ({
      ...t,
      order: i,
    }));
    setTodos(reordered);

    // 全ドキュメントの order を書き直す(最大30件なので writeBatch で1往復)
    const batch = db.batch();
    reordered.forEach((t) => {
      batch.update(db.collection('todos').doc(t.id), { order: t.order });
    });
    batch.commit().catch(logError('reorderTodos'));
  };

  useEffect(() => {
    // onSnapshot は unsubscribe 関数を返す(Promise ではない)ので await しない
    const unsubscribe = db
      .collection('todos')
      .where('uid', '==', `${auth.currentUser?.uid}`)
      .orderBy('order')
      .limit(30)
      .onSnapshot(
        (snapshot) => {
          setTodos(
            snapshot.docs.map((doc) => {
              const data = doc.data() as Omit<Todotype, 'id'>;
              return {
                id: doc.id,
                task: data.task,
                completed: data.completed,
                isEditing: data.isEditing,
                uid: data.uid,
                order: data.order,
              };
            }),
          );
        },
        (error) => {
          // インデックス不足・ルール拒否・認証切れなどが無言で起きないようにする
          console.error('[onSnapshot] subscription error:', error);
        },
      );
    console.log(auth.currentUser?.uid);
    return () => unsubscribe();
  }, [user]);

  return (
    <Box
      bg="#1a1a40"
      mt={{ base: '3', md: '20' }}
      mx="auto"
      p={{ base: '2', md: '8' }}
      borderRadius={{ base: '0', md: '5' }}
      w={{ base: '95vw', md: '80vw' }}
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
              items={todos.map((t) => t.id)}
              strategy={verticalListSortingStrategy}
            >
              {todos.map((todo) =>
                todo.isEditing ? (
                  <EditTodoForm
                    key={todo.id}
                    id={todo.id}
                    task={todo.task}
                    editTask={editTask}
                  />
                ) : (
                  <Todo
                    key={todo.id}
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

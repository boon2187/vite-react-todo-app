import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Todo } from './Todo';

type SortableTodoProps = {
  id: string;
  task: string;
  completed: boolean;
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string) => void;
};

export const SortableTodo = ({
  id,
  task,
  completed,
  toggleComplete,
  deleteTodo,
  editTodo,
}: SortableTodoProps) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <Todo
        id={id}
        task={task}
        completed={completed}
        toggleComplete={toggleComplete}
        deleteTodo={deleteTodo}
        editTodo={editTodo}
      />
    </div>
  );
};

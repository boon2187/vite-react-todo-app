import { Flex, IconButton, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faGripVertical,
  faPen,
  faTrashCan,
} from '@fortawesome/free-solid-svg-icons';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

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
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <Flex
      ref={setNodeRef}
      style={style}
      justifyContent="space-between"
      alignItems="center"
      bg="#8758ff"
      color="#fff"
      padding="0.75rem 1rem"
      borderRadius={8}
      mb="1rem"
      gap={3}
    >
      <IconButton
        size="xs"
        fontSize="18px"
        aria-label="Reorder Todo"
        bg="#8758ff"
        color="#fff"
        cursor="grab"
        touchAction="none"
        {...attributes}
        {...listeners}
      >
        <FontAwesomeIcon icon={faGripVertical} />
      </IconButton>
      <Text
        flex="1"
        cursor="pointer"
        onClick={() => toggleComplete(id)}
        textDecoration={completed ? 'line-through' : 'none'}
      >
        {task}
      </Text>
      <Flex gap={3}>
        <IconButton
          size="xs"
          fontSize="18px"
          aria-label="Edit Todo"
          bg="#8758ff"
          color="#fff"
          onClick={() => editTodo(id)}
        >
          <FontAwesomeIcon icon={faPen} />
        </IconButton>
        <IconButton
          size="xs"
          fontSize="18px"
          aria-label="Delete Todo"
          bg="#8758ff"
          color="#fff"
          onClick={() => deleteTodo(id)}
        >
          <FontAwesomeIcon icon={faTrashCan} />
        </IconButton>
      </Flex>
    </Flex>
  );
};

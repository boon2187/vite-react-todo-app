import { Flex, IconButton, Text } from '@chakra-ui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faTrashCan } from '@fortawesome/free-solid-svg-icons';

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
    <Flex
      justifyContent="space-between"
      alignItems="center"
      bg="#8758ff"
      color="#fff"
      padding="0.75rem 1rem"
      borderRadius={8}
      mb="1rem"
    >
      <Text
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

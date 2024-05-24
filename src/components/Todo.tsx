import { Text, Flex, IconButton } from '@chakra-ui/react';
import { EditIcon, DeleteIcon, DragHandleIcon } from '@chakra-ui/icons';

type TodoProps = {
  id: string;
  task: string;
  completed: boolean;
  toggleComplete: (id: string) => void;
  deleteTodo: (id: string) => void;
  editTodo: (id: string) => void;
  dragHandleProps: any;
};

export const Todo = ({
  id,
  task,
  completed,
  toggleComplete,
  deleteTodo,
  editTodo,
  dragHandleProps,
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
      <Flex alignItems="center">
        <DragHandleIcon
          style={{ cursor: 'grab', marginRight: '8px' }}
          {...dragHandleProps}
        />
        <Text
          cursor="pointer"
          onClick={() => toggleComplete(id)}
          as={`${completed ? 's' : 'p'}`}
        >
          {task}
        </Text>
      </Flex>
      <Flex gap={3}>
        <IconButton
          size="xs"
          fontSize="18px"
          aria-label="Edit Todo"
          bg="#8758ff"
          color="#fff"
          icon={<EditIcon />}
          onClick={() => editTodo(id)}
        />
        <IconButton
          size="xs"
          fontSize="18px"
          aria-label="Delete Todo"
          bg="#8758ff"
          color="#fff"
          onClick={() => deleteTodo(id)}
          icon={<DeleteIcon />}
        />
      </Flex>
    </Flex>
  );
};

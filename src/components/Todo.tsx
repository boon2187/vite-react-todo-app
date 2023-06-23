// import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { Text, Flex } from "@chakra-ui/react";

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
        as={`${completed ? "s" : "p"}`}
      >
        {task}
      </Text>
      <div>
        <FontAwesomeIcon
          cursor="pointer"
          icon={faPenToSquare}
          onClick={() => editTodo(id)}
        />
        <FontAwesomeIcon
          cursor="pointer"
          onClick={() => deleteTodo(id)}
          icon={faTrash}
        />
      </div>
    </Flex>
  );
};

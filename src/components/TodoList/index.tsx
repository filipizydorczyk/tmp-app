import React from "react";

export type TodoListElement = {
    id: string;
    title: string;
    date: Date;
    isDone: string;
};

export type TodoListElementActionCallback = (callbackArgs: {
    action: "delete" | "done" | "open";
    item: TodoListElement;
}) => void;

export type TodoListProps = {
    items: TodoListElement[];
    onAction?: TodoListElementActionCallback;
};

function TodoList({ items, onAction = () => {} }: TodoListProps) {
    return <></>;
}

export default TodoList;

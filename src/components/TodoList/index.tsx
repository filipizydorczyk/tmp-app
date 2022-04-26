import React from "react";
import { Row } from "react-bootstrap";

export type TodoListElement = {
    id: string;
    title: string;
    date: Date;
    done: boolean;
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
    return (
        <>
            {items.map((item) => (
                <Row
                    className={`py-4 px-4 mb-1 rounded ${
                        item.done ? `bg-light` : `bg-white`
                    }`}
                    style={{ border: "1px solid #ced4da" }}
                >
                    <p
                        className={`mb-0 ${
                            item.done ? `text-secondary` : `text-dark`
                        }`}
                    >
                        {item.title}
                    </p>
                </Row>
            ))}
        </>
    );
}

export default TodoList;

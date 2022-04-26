import React from "react";
import { Col, Form, Row } from "react-bootstrap";

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
                    className={`py-4 px-2 mb-1 rounded ${
                        item.done ? `bg-light` : `bg-white`
                    }`}
                    style={{ border: "1px solid #ced4da" }}
                >
                    <Col>
                        <p
                            className={`mb-0 ${
                                item.done
                                    ? `text-secondary text-decoration-line-through`
                                    : `text-dark`
                            }`}
                        >
                            {item.title}
                        </p>
                    </Col>
                    <Col sm="auto"></Col>
                </Row>
            ))}
        </>
    );
}

export default TodoList;

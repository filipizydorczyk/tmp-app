import React from "react";
import { Col, Row } from "react-bootstrap";
import deleteIcon from "./delete-svgrepo-com.svg";
import doneIcon from "./done-all-svgrepo-com.svg";
import undoIcon from "./undo-svgrepo-com.svg";

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
    style?: React.CSSProperties;
};

const iconStyle = {
    display: "block",
    width: "1rem",
    cursor: "pointer",
};

function TodoList({ items, onAction = () => {}, style }: TodoListProps) {
    return (
        <Row style={{ ...style, overflowY: "scroll", overflowX: "visible" }}>
            <Col>
                {items.map((item) => (
                    <Row
                        className={`py-4 px-2 mb-1 rounded ${
                            item.done ? `bg-light` : `bg-white`
                        }`}
                        style={{ border: "1px solid #ced4da" }}
                        key={item.id}
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
                        <Col xs="auto">
                            <img
                                onClick={() =>
                                    onAction({
                                        action: item.done ? "open" : "done",
                                        item,
                                    })
                                }
                                src={item.done ? undoIcon : doneIcon}
                                style={iconStyle}
                            />
                        </Col>
                        <Col xs="auto">
                            <img
                                onClick={() =>
                                    onAction({ action: "delete", item })
                                }
                                src={deleteIcon}
                                style={iconStyle}
                            />
                        </Col>
                    </Row>
                ))}
            </Col>
        </Row>
    );
}

export default TodoList;

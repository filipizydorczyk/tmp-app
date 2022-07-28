import React from "react";
import { Col, Row } from "react-bootstrap";
import TodoItem, {
    TodoListElement,
    TodoListElementActionCallback,
} from "@tmp/front/components/TodoItem";

export type TodoListProps = {
    items: TodoListElement[];
    onAction?: TodoListElementActionCallback;
    style?: React.CSSProperties;
};

function TodoList({ items, onAction, style }: TodoListProps) {
    return (
        <Row style={{ ...style, overflowY: "scroll", overflowX: "visible" }}>
            <Col>
                {items.map((item) => (
                    <TodoItem key={item.id} item={item} onAction={onAction} />
                ))}
            </Col>
        </Row>
    );
}

export default TodoList;

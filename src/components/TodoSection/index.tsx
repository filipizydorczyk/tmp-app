import React from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import TodoList, {
    TodoListElementActionCallback,
} from "@tmp/front/components/TodoList";
import { useTasks } from "@tmp/front/contexts/tasks-context";

function TodoSection() {
    const tasks = useTasks();

    const onActionHandler: TodoListElementActionCallback = ({
        action,
        item,
    }) => {
        const dto = {
            ...item,
            date: "",
            done: action === "done",
        };
        if (action === "delete") {
            tasks.deleteTask(dto);
        } else {
            tasks.updateTask(dto);
        }
    };

    return (
        <>
            <Row className="py-2">
                <Col>
                    <Form.Label>Todo section</Form.Label>
                </Col>
                <Col className="px-0" sm="auto">
                    <Button variant="secondary" className="px-2 py-0">
                        +
                    </Button>
                </Col>
            </Row>
            <TodoList
                items={tasks.data.content.map((element) => ({
                    ...element,
                    date: new Date(element.date),
                }))}
                onAction={onActionHandler}
            />
        </>
    );
}

export default TodoSection;

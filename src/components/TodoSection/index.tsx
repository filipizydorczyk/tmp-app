import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import TodoList, {
    TodoListElementActionCallback,
} from "@tmp/front/components/TodoList";
import { useTasks } from "@tmp/front/contexts/tasks-context";
import CreateTaskModal from "@tmp/front/components/CreateTaskModal";

function TodoSection() {
    const [showCreateModal, setShowCreateModal] = useState(false);
    const tasks = useTasks();

    const openCreateTaskModalHandler = () => setShowCreateModal(true);
    const closeCreateTaskModalHandler = () => setShowCreateModal(false);
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
                    <Button
                        variant="secondary"
                        className="px-2 py-0"
                        onClick={openCreateTaskModalHandler}
                    >
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

            <CreateTaskModal
                show={showCreateModal}
                closeHandler={closeCreateTaskModalHandler}
                onSubmit={async (title) => {
                    const result = await tasks.createTask({ title: title });
                    if (result) {
                        closeCreateTaskModalHandler();
                    }
                }}
            />
        </>
    );
}

export default TodoSection;

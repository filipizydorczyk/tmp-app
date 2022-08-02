import React, { useState } from "react";
import { Button, Col, Form, Row } from "react-bootstrap";
import TodoList from "@tmp/front/components/TodoList";
import { useTasks } from "@tmp/front/contexts/tasks-context";
import CreateTaskModal from "@tmp/front/components/CreateTaskModal";
import ResultToast from "@tmp/front/components/ResultToast";
import { TodoListElementActionCallback } from "@tmp/front/components/TodoItem";

type TodoSectionProps = {
    style?: React.CSSProperties;
};

function TodoSection({ style }: TodoSectionProps) {
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
            today: action === "today",
        };
        if (action === "delete") {
            tasks.deleteTask(dto);
        } else {
            tasks.updateTask(dto);
        }
    };

    return (
        <div style={style}>
            <Row className="py-2">
                <Col>
                    <Form.Label>Todo section</Form.Label>
                </Col>
                <Col className="px-0" xs="auto">
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
                    color: element.color || "#ffffff",
                }))}
                onAction={onActionHandler}
                style={{ maxHeight: "90%" }}
            />

            <CreateTaskModal
                show={showCreateModal}
                closeHandler={closeCreateTaskModalHandler}
                onSubmit={async (title, clearText) => {
                    const result = await tasks.createTask({ title: title });
                    if (result) {
                        clearText();
                    }
                }}
            />
            <ResultToast
                autoHide={false}
                message={{
                    type: tasks.error.isError ? "failure" : "none",
                    header: "Error",
                    content: tasks.error.message,
                }}
                onClose={tasks.closeError}
            />
        </div>
    );
}

export default TodoSection;

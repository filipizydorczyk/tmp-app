import React from "react";
import { Form } from "react-bootstrap";
import TodoList from "@tmp/front/components/TodoList";
import { useTasks } from "@tmp/front/contexts/tasks-context";

function TodoSection() {
    const tasks = useTasks();

    return (
        <>
            <Form.Label>Todo section</Form.Label>
            <TodoList
                items={tasks.data.content.map((element) => ({
                    ...element,
                    date: new Date(element.date),
                }))}
                onAction={({ action, item }) => {
                    console.log(item);
                    tasks.updateTask({
                        ...item,
                        date: "",
                        done: action === "done",
                    });
                }}
            />
        </>
    );
}

export default TodoSection;

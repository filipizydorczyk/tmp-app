import React from "react";
import { Form } from "react-bootstrap";
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
            <Form.Label>Todo section</Form.Label>
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

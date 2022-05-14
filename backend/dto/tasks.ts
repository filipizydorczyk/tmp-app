/**
 * NOTE!
 * Date should be ISO formatted string. Backend should check
 * if thats a case and return Bad Request otherwise
 */
export type TaskDTO = {
    id: string;
    title: string;
    date: string;
    done: boolean;
};

export type NewTaskDTO = {
    title: string;
};

/**
 * Function to validate api body being correct
 * @param object fetched body (`as TaskDTO`)
 * @returns boolean if body is correct
 */
export const isTaskDTOValid = (object: TaskDTO) => {
    return (
        typeof object.id === "string" &&
        typeof object.date === "string" &&
        typeof object.title === "string" &&
        typeof object.done === "boolean"
    );
};

/**
 * Function to validate api body being correct
 * @param object fetched body (`as NewTaskDTO`)
 * @returns boolean if body is correct
 */
export const isNewTaskDTOValid = (object: NewTaskDTO) => {
    return typeof object.title === "string";
};

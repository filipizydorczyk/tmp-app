const useTaskRepository = () => {
    const getAllTasks = () => {};
    const createTask = (values: {
        title: string;
        date: string;
        done: 0 | 1;
    }) => {};
    const updateTask = (
        id: string,
        values: { title: string; date: string; done: 0 | 1 }
    ) => {};
    const deleteTask = (id: string) => {};

    return {
        getAllTasks,
        createTask,
        updateTask,
        deleteTask,
    };
};

import { AppDependencies } from "@tmp/back/app";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import useSingletonService from "@tmp/back/services/singleton-service";
import useTaskRepository from "@tmp/back/repositories/task-repo";
import useTaskService from "@tmp/back/services/task-service";

/**
 * Function to create app dependencies needed in routes
 * @returns ready object that contains services
 */
const useDependencies = (): AppDependencies => {
    const serviceRepository = useSingletonRepository();
    const taskRepository = useTaskRepository();

    return {
        singletonService: useSingletonService(serviceRepository),
        taskService: useTaskService(taskRepository),
    };
};

export default useDependencies();

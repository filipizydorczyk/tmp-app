import { AppDependencies } from "@tmp/back/app";
import useSingletonRepository from "@tmp/back/repositories/singleton-repo";
import useSingletonService from "@tmp/back/services/singleton-service";

/**
 * Function to create app dependencies needed in routes
 * @returns ready object that contains services
 */
const useDependencies = (): AppDependencies => {
    const repository = useSingletonRepository();
    return {
        singletonService: useSingletonService(repository),
    };
};

export default useDependencies();

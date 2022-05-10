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

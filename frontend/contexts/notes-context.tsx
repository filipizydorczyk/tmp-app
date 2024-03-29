import React, {
    useState,
    createContext,
    ReactNode,
    useContext,
    useEffect,
} from "react";
import useApiClient from "@tmp/front/hooks/useApiClient";

type NotesError = {
    message: string;
    isError: boolean;
};

type NotesContextProps = {
    error: NotesError;
    notes: string;
    fetchNotes: () => Promise<boolean>;
    saveNotes: (notes: string) => Promise<boolean>;
    closeError: () => void;
};

type NotesProviderProps = {
    children: ReactNode;
};

const defaultError = {
    message: "",
    isError: false,
};

const defaultNotesContextProps = {
    error: defaultError,
    notes: "",
    fetchNotes: async () => Promise.resolve(true),
    saveNotes: async (notes: string) => Promise.resolve(true),
    closeError: () => {},
};

const NotesContext = createContext<NotesContextProps>(defaultNotesContextProps);

const NotesProvider = ({ children }: NotesProviderProps) => {
    const [notes, setNotes] = useState<string>("");
    const [error, setError] = useState<NotesError>(defaultError);
    const { getNotes, saveNotes: saveNotesRequest } = useApiClient();

    /**
     * This funtion will make an API call and refresh notes
     * @returns boolean if action was successful.
     * It will also refresh notes state
     */
    const fetchNotes = async () => {
        const response = await getNotes().catch(() => {
            setError({
                isError: true,
                message: `Feching notes failed.`,
            });
        });

        if (response?.status === 200) {
            setNotes(response.data.content || "");
        }

        return Promise.resolve(response?.status === 200);
    };

    /**
     * Function to make save REST request
     * @param notes note to be saved
     * @returns boolean if action was successful.
     * It will also refresh notes state
     */
    const saveNotes = async (notes: string) => {
        const response = await saveNotesRequest(notes).catch(() => {
            setError({
                isError: true,
                message: `Saving notes failed.`,
            });
        });

        if (response?.status === 200) {
            setNotes(response.data.content || "");
        }

        return Promise.resolve(response?.status === 200);
    };

    const closeError = () => {
        setError(defaultError);
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <NotesContext.Provider
            value={{ error, notes, fetchNotes, saveNotes, closeError }}
        >
            {children}
        </NotesContext.Provider>
    );
};

const useNotes = () => {
    return useContext(NotesContext);
};

export { useNotes, NotesProvider };

import React, {
    useState,
    createContext,
    ReactNode,
    useContext,
    useEffect,
} from "react";
import useApiClient from "@tmp/front/hooks/useApiClient";

type NotesContextProps = {
    notes: string;
    fetchNotes: () => Promise<boolean>;
    saveNotes: (notes: string) => Promise<boolean>;
};

type NotesProviderProps = {
    children: ReactNode;
};

const defaulNotesContextProps = {
    notes: "",
    fetchNotes: async () => Promise.resolve(true),
    saveNotes: async (notes: string) => Promise.resolve(true),
};

const NotesContext = createContext<NotesContextProps>(defaulNotesContextProps);

const NotesProvider = ({ children }: NotesProviderProps) => {
    const [notes, setNotes] = useState<string>("");
    const { getNotes, saveNotes: saveNotesRequest } = useApiClient();

    /**
     * This funtion will make an API call and refresh notes
     * @returns boolean if action was successful. Notes state
     * will be refreshed automatically
     */
    const fetchNotes = async () => {
        const fetchedNotes = await getNotes();
        setNotes(fetchedNotes.content || "");
        return true;
    };

    /**
     * Function to make save REST request
     * @param notes note to be saved
     * @returns boolean if action was successful.
     * It will also refresh notes state
     */
    const saveNotes = async (notes: string) => {
        const response = await saveNotesRequest(notes);
        setNotes(response.content || "");
        return true;
    };

    useEffect(() => {
        fetchNotes();
    }, []);

    return (
        <NotesContext.Provider value={{ notes, fetchNotes, saveNotes }}>
            {children}
        </NotesContext.Provider>
    );
};

const useNotes = () => {
    return useContext(NotesContext);
};

export { useNotes, NotesProvider };

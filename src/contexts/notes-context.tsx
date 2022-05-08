import React, { useState, createContext, ReactNode, useContext } from "react";
import useApiClient from "@tmp/front/hooks/useApiClient";

type NotesContextProps = {
    notes: string;
    fetchNotes: () => Promise<boolean>;
};

type NotesProviderProps = {
    children: ReactNode;
};

const defaulNotesContextProps = {
    notes: "",
    fetchNotes: async () => true,
};

const NotesContext = createContext<NotesContextProps>(defaulNotesContextProps);

const NotesProvider = ({ children }: NotesProviderProps) => {
    const [notes, setNotes] = useState<string>("");
    const { getNotes } = useApiClient();

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

    return (
        <NotesContext.Provider value={{ notes, fetchNotes }}>
            {children}
        </NotesContext.Provider>
    );
};

const useNotes = () => {
    return useContext(NotesContext);
};

export { useNotes, NotesProvider };

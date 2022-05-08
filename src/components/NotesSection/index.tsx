import { useNotes } from "@tmp/front/contexts/notes-context";
import React, { useEffect, useRef } from "react";
import { Button, Form } from "react-bootstrap";

function NotesSection() {
    const notes = useNotes();
    const notesRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        notes.fetchNotes();
    }, []);

    return (
        <Form>
            <Form.Group className="mb-3" controlId="notes">
                <Form.Label>Temporary notes</Form.Label>

                <Form.Control
                    ref={notesRef}
                    as="textarea"
                    rows={3}
                    defaultValue={notes.notes}
                />

                <Button
                    className="my-2"
                    variant="primary"
                    onClick={() => {
                        notes.saveNotes(notesRef.current?.value || "");
                    }}
                >
                    Save
                </Button>
            </Form.Group>
        </Form>
    );
}

export default NotesSection;

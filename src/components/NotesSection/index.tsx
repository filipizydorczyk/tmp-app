import { useNotes } from "@tmp/front/contexts/notes-context";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Toast } from "react-bootstrap";

function NotesSection() {
    const notes = useNotes();
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const [resultToast, setResultToast] = useState<boolean>(false);

    useEffect(() => {
        notes.fetchNotes();
    }, []);

    return (
        <>
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
                            notes
                                .saveNotes(notesRef.current?.value || "")
                                .then((_) => {
                                    setResultToast(true);
                                });
                        }}
                    >
                        Save
                    </Button>
                </Form.Group>
            </Form>

            <Toast
                className="my-4 mx-5"
                style={{ position: "absolute", bottom: "0", right: 0 }}
                onClose={() => setResultToast(false)}
                show={resultToast}
                animation={true}
            >
                <Toast.Header>
                    <strong className="me-auto">Notes saved</strong>
                </Toast.Header>
                <Toast.Body>Click to close this message.</Toast.Body>
            </Toast>
        </>
    );
}

export default NotesSection;

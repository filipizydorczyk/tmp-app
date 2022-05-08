import { useNotes } from "@tmp/front/contexts/notes-context";
import React, { useEffect, useRef } from "react";
import { Button, Form, Toast } from "react-bootstrap";

function NotesSection() {
    const notes = useNotes();
    const notesRef = useRef<HTMLTextAreaElement>(null);

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
                            notes.saveNotes(notesRef.current?.value || "");
                        }}
                    >
                        Save
                    </Button>
                </Form.Group>
            </Form>
            <Toast
                className="my-4 mx-5"
                style={{ position: "absolute", bottom: "0", right: 0 }}
            >
                <Toast.Header>
                    <img
                        src="holder.js/20x20?text=%20"
                        className="rounded me-2"
                        alt=""
                    />
                    <strong className="me-auto">Bootstrap</strong>
                    <small>11 mins ago</small>
                </Toast.Header>
                <Toast.Body>Hello, world! This is a toast message.</Toast.Body>
            </Toast>
        </>
    );
}

export default NotesSection;

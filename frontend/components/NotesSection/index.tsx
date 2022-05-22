import { useNotes } from "@tmp/front/contexts/notes-context";
import React, { useEffect, useRef, useState } from "react";
import { Button, Form, Row } from "react-bootstrap";
import ResultToast, {
    ResultToastMessage,
} from "@tmp/front/components/ResultToast";

function NotesSection() {
    const notes = useNotes();
    const notesRef = useRef<HTMLTextAreaElement>(null);
    const [resultToast, setResultToast] = useState<ResultToastMessage>({
        type: "none",
        header: "",
        content: "",
    });

    useEffect(() => {
        if (notes.error.isError) {
            setResultToast({
                type: "failure",
                header: "Something went wrong",
                content: notes.error.message,
            });
        }
    }, [notes.error]);

    return (
        <>
            <Form style={{ height: "100%" }}>
                <Form.Group
                    className="mb-3"
                    style={{ height: "100%" }}
                    controlId="notes"
                >
                    <Row className="py-2">
                        <Form.Label>Temporary notes</Form.Label>
                    </Row>

                    <Form.Control
                        style={{ height: "90%" }}
                        ref={notesRef}
                        as="textarea"
                        rows={30}
                        defaultValue={notes.notes}
                    />

                    <Button
                        className="my-2"
                        variant="primary"
                        onClick={() => {
                            notes
                                .saveNotes(notesRef.current?.value || "")
                                .then((isSuccess) => {
                                    if (isSuccess) {
                                        setResultToast({
                                            type: "success",
                                            header: "The operation was successful",
                                            content: "Notes successfully saved",
                                        });
                                    }
                                });
                        }}
                    >
                        Save
                    </Button>
                </Form.Group>
            </Form>

            <ResultToast message={resultToast} onClose={notes.closeError} />
        </>
    );
}

export default NotesSection;

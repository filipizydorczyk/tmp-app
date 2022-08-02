import useAutoInputFocus from "@tmp/front/hooks/useAutoInputFocus";
import React, { useEffect, useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";

type CreateTaskModalProps = {
    show: boolean;
    closeHandler: () => void;
    onSubmit: (tite: string, clearText: () => void) => void;
};

function CreateTaskModal({
    show,
    closeHandler,
    onSubmit = () => {},
}: CreateTaskModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const clearText = () => {
        if (titleRef.current) {
            titleRef.current.value = "";
        }
    };
    const handleSubmit = () => {
        if (titleRef.current?.value) {
            onSubmit(titleRef.current?.value, clearText);
        }
    };

    useEffect(() => {
        useAutoInputFocus(titleRef);
    }, [titleRef]);

    return (
        <Modal show={show} onHide={closeHandler} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Create new task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="newTask">
                    <Form.Label>Title</Form.Label>
                    <Form.Control
                        type="title"
                        placeholder="Task to be done"
                        ref={titleRef}
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                handleSubmit();
                            }
                        }}
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={handleSubmit}>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateTaskModal;

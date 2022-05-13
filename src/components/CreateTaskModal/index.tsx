import React, { useRef } from "react";
import { Modal, Button, Form } from "react-bootstrap";

type CreateTaskModalProps = {
    show: boolean;
    closeHandler: () => void;
    onSubmit?: (tite: string) => void;
};

function CreateTaskModal({
    show,
    closeHandler,
    onSubmit = () => {},
}: CreateTaskModalProps) {
    const titleRef = useRef<HTMLInputElement>(null);

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
                    />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button
                    onClick={() => {
                        if (titleRef.current?.value) {
                            onSubmit(titleRef.current?.value);
                        }
                    }}
                >
                    Submit
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateTaskModal;

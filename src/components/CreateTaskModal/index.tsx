import React from "react";
import { Modal, Button, Form } from "react-bootstrap";

type CreateTaskModalProps = {
    show: boolean;
    closeHandler: () => void;
};

function CreateTaskModal({ show, closeHandler }: CreateTaskModalProps) {
    return (
        <Modal show={show} onHide={closeHandler} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Create new task</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form.Group className="mb-3" controlId="newTask">
                    <Form.Label>Title</Form.Label>
                    <Form.Control type="title" placeholder="Task to be done" />
                </Form.Group>
            </Modal.Body>
            <Modal.Footer>
                <Button>Submit</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default CreateTaskModal;

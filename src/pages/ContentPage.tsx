import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import TodoList from "@tmp/front/components/TodoList";

function ContentPage() {
    return (
        <Container className="bg-light p-5" style={{ height: "100vh" }} fluid>
            <Row>
                <Col>
                    <Form.Label>Todo section</Form.Label>
                    <TodoList
                        items={[
                            {
                                id: "fass223",
                                title: "Test",
                                date: new Date(),
                                done: false,
                            },
                            {
                                id: "fass223",
                                title: "Test 2",
                                date: new Date(),
                                done: true,
                            },
                        ]}
                        onAction={({ action, item }) =>
                            console.log(action, item)
                        }
                    />
                </Col>
                <Col>
                    <Form>
                        <Form.Group
                            className="mb-3"
                            controlId="exampleForm.ControlTextarea1"
                        >
                            <Form.Label>Temporary notes</Form.Label>
                            <Form.Control as="textarea" rows={3} />
                        </Form.Group>
                    </Form>
                </Col>
            </Row>
        </Container>
    );
}

export default ContentPage;

import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";

function ContentPage() {
    return (
        <Container className="bg-light p-5" style={{ height: "100vh" }} fluid>
            <Row>
                <Col></Col>
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

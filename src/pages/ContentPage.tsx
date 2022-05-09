import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import TodoList from "@tmp/front/components/TodoList";
import { NotesProvider } from "@tmp/front/contexts/notes-context";
import NotesSection from "@tmp/front/components/NotesSection";

function ContentPage() {
    return (
        <Container className="bg-light p-5" style={{ height: "100vh" }} fluid>
            <Row style={{ height: "100%" }}>
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
                                id: "f1223",
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
                    <NotesProvider>
                        <NotesSection />
                    </NotesProvider>
                </Col>
            </Row>
        </Container>
    );
}

export default ContentPage;

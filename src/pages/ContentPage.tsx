import React from "react";
import { Col, Container, Form, Row } from "react-bootstrap";
import TodoList from "@tmp/front/components/TodoList";
import { NotesProvider } from "@tmp/front/contexts/notes-context";
import NotesSection from "@tmp/front/components/NotesSection";
import { TaskProvider } from "@tmp/front/contexts/tasks-context";
import TodoSection from "@tmp/front/components/TodoSection";

function ContentPage() {
    return (
        <Container className="bg-light p-5" style={{ height: "100vh" }} fluid>
            <Row style={{ height: "100%" }}>
                <Col>
                    <TaskProvider>
                        <TodoSection />
                    </TaskProvider>
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

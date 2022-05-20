import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NotesProvider } from "@tmp/front/contexts/notes-context";
import NotesSection from "@tmp/front/components/NotesSection";
import { TaskProvider } from "@tmp/front/contexts/tasks-context";
import { useAuth } from "@tmp/front/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import TodoSection from "@tmp/front/components/TodoSection";
import { LOGIN_URL } from "@tmp/front/constants";

function ContentPage() {
    const { data } = useAuth();
    const nav = useNavigate();

    useEffect(() => {
        if (!data.isLoggedIn) {
            nav(LOGIN_URL);
        }
    }, []);

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

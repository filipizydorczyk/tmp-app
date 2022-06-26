import React, { useEffect } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { NotesProvider } from "@tmp/front/contexts/notes-context";
import NotesSection from "@tmp/front/components/NotesSection";
import { TaskProvider } from "@tmp/front/contexts/tasks-context";
import { useAuth } from "@tmp/front/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import TodoSection from "@tmp/front/components/TodoSection";
import { LOGIN_URL } from "@tmp/front/constants";
import { createMedia } from "@artsy/fresnel";

function ContentPage() {
    const { data } = useAuth();
    const nav = useNavigate();
    const QueryBreakpoints = createMedia({
        // breakpoints values can be either strings or integers
        breakpoints: {
            sm: 0,
            md: 700,
        },
    });

    // workaround to fresnel type issue
    const MediaContextProvider =
        QueryBreakpoints.MediaContextProvider as unknown as React.FC;
    const Media = QueryBreakpoints.Media as unknown as React.FC<{
        at?: any;
        greaterThanOrEqual?: any;
    }>;

    useEffect(() => {
        if (!data.isLoggedIn) {
            nav(LOGIN_URL);
        }
    }, []);

    return (
        <Container
            className="bg-light p-5"
            style={{ height: "100vh", maxHeight: "100vh" }}
            fluid
        >
            <MediaContextProvider>
                <Media at="sm">
                    <h1>Hello worlds</h1>
                </Media>
                <Media greaterThanOrEqual="md">
                    <Row style={{ height: "100%" }}>
                        <Col style={{ height: "100%" }}>
                            <TaskProvider>
                                <TodoSection style={{ height: "100%" }} />
                            </TaskProvider>
                        </Col>
                        <Col style={{ height: "100%" }}>
                            <NotesProvider>
                                <NotesSection />
                            </NotesProvider>
                        </Col>
                    </Row>
                </Media>
            </MediaContextProvider>
        </Container>
    );
}

export default ContentPage;

import React, { useEffect } from "react";
import { Col, Container, Row, Tab, Tabs } from "react-bootstrap";
import { NotesProvider } from "@tmp/front/contexts/notes-context";
import NotesSection from "@tmp/front/components/NotesSection";
import { TaskProvider } from "@tmp/front/contexts/tasks-context";
import { useAuth } from "@tmp/front/contexts/auth-context";
import { useNavigate } from "react-router-dom";
import TodoSection from "@tmp/front/components/TodoSection";
import { LOGIN_URL } from "@tmp/front/constants";
import { createMedia } from "@artsy/fresnel";
import Timeline from "../components/Timeline";

function ContentPage() {
  const { data } = useAuth();
  const nav = useNavigate();
  const QueryBreakpoints = createMedia({
    breakpoints: {
      sm: 0,
      md: 700,
    },
  });

  // workaround to fresnel type issue (https://github.com/artsy/fresnel/issues/281)
  const MediaContextProvider =
    QueryBreakpoints.MediaContextProvider as unknown as React.FC;
  const Media = QueryBreakpoints.Media as unknown as React.FC<{
    at?: any;
    greaterThanOrEqual?: any;
  }>;

  const TaskFragment = (
    <TaskProvider>
      <TodoSection style={{ height: "100%" }} />
    </TaskProvider>
  );
  const TodoFragment = (
    <NotesProvider>
      {/* <Timeline/> */}
      <NotesSection />
    </NotesProvider>
  );

  useEffect(() => {
    if (!data.isLoggedIn) {
      nav(LOGIN_URL);
    }
  }, []);

  return (
    <MediaContextProvider>
      <Media at="sm">
        <Container
          className="bg-light py-2 px-4"
          style={{ height: "100vh", maxHeight: "100vh" }}
          fluid
        >
          <Tabs defaultActiveKey="tasks" className="mb-3">
            <Tab eventKey="tasks" title="Tasks">
              <div style={{ height: "85vh" }}>{TaskFragment}</div>
            </Tab>
            <Tab eventKey="notes" title="Notes">
              <div style={{ height: "85vh" }}>{TodoFragment}</div>
            </Tab>
          </Tabs>
        </Container>
      </Media>
      <Media greaterThanOrEqual="md">
        <Container
          className="bg-light p-5"
          style={{ height: "100vh", maxHeight: "100vh" }}
          fluid
        >
          <Row style={{ height: "100%" }}>
            <Col style={{ height: "100%" }}>{TaskFragment}</Col>
            <Col style={{ height: "100%" }}>{TodoFragment}</Col>
          </Row>
        </Container>
      </Media>
    </MediaContextProvider>
  );
}

export default ContentPage;

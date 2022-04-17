import React from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import xd from "./cat-closed-eyes-wide-open.png";

function LoginPage() {
    return (
        <Container className="bg-light p-5" style={{ height: "100vh" }} fluid>
            <Card
                className="px-3 py-4 mx-auto"
                style={{ maxWidth: "32rem", position: "relative" }}
            >
                <h1>
                    <strong>THE TMP APP!</strong>
                </h1>
                <img
                    src={xd}
                    style={{ position: "absolute", right: 0, top: "-30px" }}
                    width="200px"
                />
                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Admin password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                    />
                    <Form.Text className="text-muted">
                        If it's your first run whatever you type will become
                        your password.
                    </Form.Text>
                </Form.Group>

                <Button variant="primary">Submit</Button>
            </Card>
        </Container>
    );
}

export default LoginPage;

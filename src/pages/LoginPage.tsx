import React from "react";
import { Button, Card, Container, Form } from "react-bootstrap";

function LoginPage() {
    return (
        <Container className="bg-light p-5" style={{ height: "100vh" }} fluid>
            <Card className="px-3 py-4 mx-auto" style={{ maxWidth: "32rem" }}>
                <h1>
                    <strong>THE TMP APP!</strong>
                </h1>

                <Form.Group className="mb-3" controlId="formBasicEmail">
                    <Form.Label>Admin password</Form.Label>
                    <Form.Control type="password" placeholder="Enter email" />
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

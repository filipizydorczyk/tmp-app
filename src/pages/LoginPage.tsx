import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import CatPuppy from "@tmp/front/components/CatPuppy";

function LoginPage() {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const passwdRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        document.addEventListener("keydown", () => {
            if (passwdRef) {
                passwdRef.current?.focus();
            }
        });
    }, []);

    return (
        <Container className="bg-light p-5" style={{ height: "100vh" }} fluid>
            <Card className="px-3 py-4 mx-auto" style={{ maxWidth: "32rem" }}>
                <h1>
                    <strong>THE TMP APP!</strong>
                </h1>
                <Form.Group
                    className="mb-3"
                    style={{ position: "relative" }}
                    controlId="adminPassword"
                >
                    <CatPuppy
                        eyes={isFocused ? "closed" : "open"}
                        style={{
                            position: "absolute",
                            width: "200px",
                            right: 0,
                            top: "-110px",
                        }}
                    />
                    <Form.Label>Admin password</Form.Label>
                    <Form.Control
                        type="password"
                        placeholder="Enter password"
                        ref={passwdRef}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        onKeyPress={(event) =>
                            event.key === "Enter" && console.log("XD")
                        }
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

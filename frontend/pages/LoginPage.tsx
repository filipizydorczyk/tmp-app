import React, { useEffect, useRef, useState } from "react";
import { Button, Card, Container, Form } from "react-bootstrap";
import CatPuppy from "@tmp/front/components/CatPuppy";
import { useNavigate } from "react-router-dom";
import { OVERVIEW_URL } from "@tmp/front/constants";
import { useAuth } from "@tmp/front/contexts/auth-context";
import ResultToast from "@tmp/front/components/ResultToast";

function LoginPage() {
    const [isFocused, setIsFocused] = useState(false);
    const passwdRef = useRef<HTMLInputElement>(null);
    const auth = useAuth();
    const nav = useNavigate();

    const submitLogin = () => {
        if (passwdRef && passwdRef.current) {
            const current = passwdRef.current;
            auth.logIn(current.value || "")
                .then((response) => {
                    if (response) {
                        nav(OVERVIEW_URL);
                    } else {
                        current.value = "";
                    }
                })
                .catch(() => {
                    current.value = "";
                });
        }
    };

    useEffect(() => {
        document.addEventListener("keydown", () => {
            if (passwdRef) {
                passwdRef.current?.focus();
            }
        });
    }, []);

    return (
        <Container
            className="bg-light py-5 px-3"
            style={{ height: "100vh" }}
            fluid
        >
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
                        onKeyPress={(event) => {
                            if (event.key === "Enter") {
                                submitLogin();
                            }
                        }}
                    />
                    <Form.Text className="text-muted">
                        If it's your first run whatever you type will become
                        your password.
                    </Form.Text>
                </Form.Group>
                <Button variant="primary" onClick={submitLogin}>
                    Submit
                </Button>
            </Card>
            <ResultToast
                message={{
                    type: auth.error.isError ? "failure" : "none",
                    header: "Login failed",
                    content: auth.error.message,
                }}
                onClose={auth.closeError}
            />
        </Container>
    );
}

export default LoginPage;

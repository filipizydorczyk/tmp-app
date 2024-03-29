import React, { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

export type ResultToastMessage = {
    type: "success" | "failure" | "none";
    header: string;
    content: string;
};

type ResultToastProps = {
    message: ResultToastMessage;
    autoHide?: boolean;
    onClose?: () => void;
};

const FADE_OUT_MS = 5000;

function ResultToast({
    message,
    autoHide = true,
    onClose = () => {},
}: ResultToastProps) {
    const [display, setDisplay] = useState(false);

    useEffect(() => {
        if (!display && message.type !== "none") {
            setDisplay(true);
            if (autoHide) {
                setTimeout(() => {
                    setDisplay(false);
                }, FADE_OUT_MS);
            }
        }
    }, [message]);

    return (
        <Toast
            className="my-4 mx-5"
            style={{
                position: "absolute",
                bottom: "0",
                right: "0",
                maxWidth: "350px",
                width: "80%",
            }}
            onClose={() => {
                onClose();
                setDisplay(false);
            }}
            show={display}
            animation={true}
        >
            <Toast.Header>
                <strong
                    className={`me-auto ${
                        message.type === "success"
                            ? "text-success"
                            : "text-danger"
                    }`}
                >
                    {message.header}
                </strong>
            </Toast.Header>
            <Toast.Body>{message.content}</Toast.Body>
        </Toast>
    );
}

export default ResultToast;

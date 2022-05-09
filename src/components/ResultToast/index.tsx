import React, { useEffect, useState } from "react";
import { Toast } from "react-bootstrap";

export type ResultToastMessage = {
    type: "success" | "failure" | "none";
    content: string;
};

type ResultToastProps = {
    message: ResultToastMessage;
};

const FADE_OUT_MS = 5000;

function ResultToast({ message }: ResultToastProps) {
    const [display, setDisplay] = useState(false);

    useEffect(() => {
        if (!display && message.type !== "none") {
            setDisplay(true);
            setTimeout(() => {
                setDisplay(false);
            }, FADE_OUT_MS);
        }
    }, [message]);

    return (
        <Toast
            className="my-4 mx-5"
            style={{ position: "absolute", bottom: "0", right: 0 }}
            onClose={() => setDisplay(false)}
            show={display}
            animation={true}
        >
            <Toast.Header>
                <strong className="me-auto">Notes saved</strong>
            </Toast.Header>
            <Toast.Body>Click to close this message.</Toast.Body>
        </Toast>
    );
}

export default ResultToast;

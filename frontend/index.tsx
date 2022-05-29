import "bootstrap/dist/css/bootstrap.min.css";
import "react-app-polyfill/stable";
import React from "react";
import ReactDOM from "react-dom";
import App from "@tmp/front/App";
import { AuthProvider } from "@tmp/front/contexts/auth-context";

ReactDOM.render(
    <React.StrictMode>
        <AuthProvider>
            <App />
        </AuthProvider>
    </React.StrictMode>,
    document.getElementById("root")
);

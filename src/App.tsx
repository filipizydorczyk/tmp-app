import React from "react";
import LoginPage from "@tmp/front/pages/LoginPage";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ContentPage from "@tmp/front/pages/ContentPage";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<LoginPage />} />
                <Route path="/dashboard" element={<ContentPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

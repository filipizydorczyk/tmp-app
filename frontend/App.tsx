import React from "react";
import LoginPage from "@tmp/front/pages/LoginPage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import ContentPage from "@tmp/front/pages/ContentPage";
import { LOGIN_URL, OVERVIEW_URL } from "@tmp/front/constants";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={
                        <Navigate
                            to={true ? LOGIN_URL : OVERVIEW_URL}
                            replace
                        />
                    }
                />
                <Route path={LOGIN_URL} element={<LoginPage />} />
                <Route path={OVERVIEW_URL} element={<ContentPage />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;

import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

/** Routes */
import Home from 'containers/Home/Home';

const Router = (props) => {
    return (
        <React.Fragment>
            <BrowserRouter>
                <Routes>
                    <Route path="*" element={<Home />} />
                </Routes>
            </BrowserRouter>
        </React.Fragment>
    );
};

export default Router;

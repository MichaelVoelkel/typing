import React from 'react'
import Typing from './Typing';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';

export default function Router() {
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/type/:dict" element={<Typing />} />
        </Routes>
        </BrowserRouter>
}
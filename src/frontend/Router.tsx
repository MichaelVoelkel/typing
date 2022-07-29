import React, { useState } from 'react'
import Typing from './Typing';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Home';
import MainController from 'app/main_controller';
import SessionResultsRepository from 'domain/session/session_results_repository';

export default function Router(props: any) {
    const {sessionResultsRepository}: {sessionResultsRepository: SessionResultsRepository} = props;

    const [mainController] = useState<MainController>(new MainController(sessionResultsRepository));

    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Home mainController={mainController} />} />
            <Route path="/type/:dict" element={<Typing mainController={mainController} />} />
        </Routes>
    </BrowserRouter>
}
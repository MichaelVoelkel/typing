import LocalSessionResultsRepository from 'infra/session/session_results_repository';
import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import Router from './Router'

const container = document.getElementById('app-root');

const root = createRoot(container!);
root.render(
    <Router sessionResultsRepository={new LocalSessionResultsRepository} />
);
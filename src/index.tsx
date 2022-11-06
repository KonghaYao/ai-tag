import './index.css';
import { render } from 'solid-js/web';

import { App } from './App';
import { Router, hashIntegration, Route, Routes } from '@solidjs/router';
import { FontSupport } from './components/FontSupport';

render(() => {
    return (
        <>
            <Router source={hashIntegration()}>
                <Routes>
                    <Route path="/" element={App}></Route>
                </Routes>
            </Router>
            <FontSupport></FontSupport>
        </>
    );
}, document.getElementById('root') as HTMLElement);

import '../src/index.css';
import { render } from 'solid-js/web';

import { App } from './App';
import { Router, hashIntegration, Route, Routes } from '@solidjs/router';
import { FontSupport } from '../src/components/FontSupport';

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
}, document.body as HTMLElement);

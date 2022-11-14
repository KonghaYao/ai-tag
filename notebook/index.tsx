import '../src/index.css';
import { render } from 'solid-js/web';

import { App } from './App';
import { FontSupport } from '../src/components/FontSupport';

render(() => {
    return (
        <>
            <App></App>
            <FontSupport></FontSupport>
        </>
    );
}, document.body as HTMLElement);

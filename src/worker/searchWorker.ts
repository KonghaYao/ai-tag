import { expose } from 'comlink';
import * as api from './searchCore';

globalThis.onconnect = (e) => {
    expose(api, e.ports[0]);
};

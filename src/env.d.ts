/// <reference types="astro/client" />
declare var __version__: string;
declare var __isDev__: boolean;

declare module 'leancloud-storage/dist/av-min.js' {
    export * from 'leancloud-storage'
}

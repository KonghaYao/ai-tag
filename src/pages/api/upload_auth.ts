import type { APIRoute } from 'astro';
import ImageKit from 'imagekit';

console.log(import.meta.env.PUBLIC_IMAGEKIT_MASTER);
const imagekit = new ImageKit({
    publicKey: 'public_49Srlf9AEpmrR1xMPR7Gh2JafbU=',
    privateKey: import.meta.env.PUBLIC_IMAGEKIT_MASTER!,
    urlEndpoint: 'https://ik.imagekit.io/dfidfiskkxn/',
});
export const get: APIRoute = async () => {
    return {
        statusCode: 200,
        body: JSON.stringify(imagekit.getAuthenticationParameters()),
    };
};

import { Handler } from '@netlify/functions';
import ImageKit from 'imagekit';

const imagekit = new ImageKit({
    publicKey: 'public_LHy/8l68lZCtxUj9yIEj1Ibz8yE=',
    privateKey: process.env.PUBLIC_IMAGEKIT_MASTER!,
    urlEndpoint: 'https://ik.imagekit.io/dfidfiskkxn/',
});
export const handler: Handler = async (event, content) => {
    return {
        statusCode: 200,
        body: JSON.stringify(imagekit.getAuthenticationParameters()),
    };
};

import { Handler } from '@netlify/functions';
import ImageKit from 'imagekit';
export const getImagePath = (s: string) => {
    return s.replace('/t/', '/s/').replace('.jpg', '.png');
};
const imagekit = new ImageKit({
    publicKey: 'public_LHy/8l68lZCtxUj9yIEj1Ibz8yE=',
    privateKey: process.env.VITE_IMAGEKIT_MASTER!,
    urlEndpoint: 'https://ik.imagekit.io/dfidfiskkxn/',
});
export const handler: Handler = async (event, content) => {
    const iterator = event.queryStringParameters?.image!;
    const data = await imagekit
        .upload({
            file: getImagePath(iterator), //required
            fileName: iterator
                .replace(/\.\w+$/, '')
                .split('/')
                .at(-1)!, //required
            folder: 'save',
            useUniqueFileName: false, // 添加这个，让网站知道按你的名字来
            overwriteFile: false, // 添加这个防止覆盖图片
        })
        .then((response) => {
            return iterator;
        })
        .catch((error) => {
            return [iterator, error];
        });
    console.log(data);
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};

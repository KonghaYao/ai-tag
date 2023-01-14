import { Handler } from '@netlify/functions';
import ImageKit from 'imagekit';
export const getImagePath = (s: string) => {
    return s.replace('/t/', '/s/').replace('.jpg', '.png');
};
const value = process.env.IMAGEKIT_MASTER!;
const imagekit = new ImageKit({
    publicKey: 'public_HuJxbWdbzJt+kG28eWEjHZfiJws=',
    privateKey: value,
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
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};

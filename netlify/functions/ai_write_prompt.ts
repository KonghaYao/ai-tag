import { Handler } from '@netlify/functions';
import { useAIWritePrompt } from '../../src/api/huggingface';
const pickOne = (arr: string[]) => {
    return arr[Math.floor(Math.random() * arr.length)];
};
export const handler: Handler = async (event, content) => {
    const token =
        event.queryStringParameters?.token || pickOne(process.env.VITE_HUGGINGFACE!.split(','));
    // console.log(token);
    const data = await useAIWritePrompt(event.queryStringParameters?.inputs!, token);
    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};

import { Handler } from '@netlify/functions';
import { Client } from '@notionhq/client';

// Initializing a client
const notion = new Client({
    auth: process.env.VITE_NOTION_TOKEN,
});

export const handler: Handler = async (event, content) => {
    if (!event.body) {
        return { statusCode: 400 };
    }
    const data = await notion.pages.create(JSON.parse(event.body));

    return {
        statusCode: 200,
        body: JSON.stringify(data),
    };
};

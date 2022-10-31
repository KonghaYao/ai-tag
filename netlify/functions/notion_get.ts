import { Handler } from '@netlify/functions';
import { Client } from '@notionhq/client';
import { debounce } from 'lodash-es';
// Initializing a client
const notion = new Client({
    auth: process.env.VITE_NOTION_TOKEN,
});

export const handler: Handler = async (event, content) => {
    const data = await notion.databases.query({
        ...JSON.parse(event.queryStringParameters?.data || '{}'),
        database_id: '90b7c1bb6ad7446ba66e0b1d8ec1d535',
        page_size: 10,
    });

    return {
        statusCode: 200,
        body: JSON.stringify(data),
        headers: {
            'cache-control': 'public, max-age=43200',
        },
    };
};

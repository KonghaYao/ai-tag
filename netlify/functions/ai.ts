import { Handler } from '@netlify/functions';


export const handler = async (event, context) => {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST,GET,OPTIONS,HEAD,PUT,DELETE',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        'Vary': 'Origin',
    };

    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 204,
            headers,
            body: '',
        };
    }

    let data;
    try {
        data = JSON.parse(event.body || '{}');
    } catch (e) {
        return {
            statusCode: 400,
            headers,
            body: 'Invalid JSON body',
        };
    }

    if ('prompt' in data && 'id' in data) {
        try {
            const response = await fetch('https://api.chatanywhere.com.cn/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: 'Bearer sk-lw15JdX9SmWUjxbto9cPIv8KiG5BRDmJBBfFkas2ssiUEkpw',
                },
                body: JSON.stringify({
                  temperature: 0.9,
                  max_tokens: 150,
                  top_p: 1,
                  frequency_penalty: 0,
                  presence_penalty: 0.6,
                  "model": "gpt-3.5-turbo",
                  "messages": [
                      {
                          "role": "system",
                          "content": "You are an helpful artist assistant."
                      },
                      {
                          "role": "user",
                          "content": data.prompt
                      }
                  ],
                  stream: false,
                }),
            }).then(res => res.json())
            return {
                statusCode: 200,
                headers,
                body: response?.choices[0]?.message?.content,
            }
        } catch (error) {
            console.error('Error:', error);
            return {
                statusCode: 500,
                headers,
                body: 'Internal Server Error',
            };
        }
    }

    return {
        statusCode: 401,
        headers,
        body: '数据格式错误',
    };
};

const token = '';
const _prompt = '你是谁';
fetch('https://openai-proxy-magic.deno.dev', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
        model: 'text-ada-001',
        temperature: 0.9,
        max_tokens: 150,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0.6,
        stop: ['\n提问:', '\nAI:'],
        prompt: `\n提问:` + _prompt + `\nAI:`,
        stream: true,
    }),
}).then(async (res) => {
    let all = '';
    for await (const text of readStreamAsTextLines(res.body!)) {
        if (!text) continue;
        all += text;
    }
    console.log(all);
});
async function* readStreamAsTextLines(stream: ReadableStream<Uint8Array>) {
    const linesReader = stream
        .pipeThrough(new TextDecoderStream())

        .getReader();
    while (true) {
        const { value, done } = await linesReader.read();
        if (done) break;
        yield value;
    }
}

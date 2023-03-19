import { sign } from '@tsndr/cloudflare-worker-jwt';
export class PromptGPT {
    constructor() {}
    async query(data: { prompt: string; id: string }, notify: (text: string, per: number) => void) {
        // Create a new XHR object
        var xhr = new XMLHttpRequest();

        // Define the request method, URL and async status
        xhr.open('POST', 'https://prompt-gpt.deno.dev/ai');
        const token = await this.getToken();
        xhr.setRequestHeader('Content-type', 'application/json');
        // Set the request headers (optional)
        xhr.setRequestHeader('Authorization', 'Barer ' + token);

        // Set up a callback function to handle the response
        xhr.onload = function () {
            if (xhr.status === 200) {
                // Handle the response data
                notify(xhr.responseText, 100);
            }
        };
        // Set up a callback function to handle the progress event
        xhr.onprogress = function (event) {
            if (event.lengthComputable) {
                var percentComplete = (event.loaded / event.total) * 100;
                notify(xhr.responseText, percentComplete);
            }
        };
        xhr.send(JSON.stringify(data));
    }
    getToken() {
        return sign(
            {
                name: Math.random().toString() + Date.now(),
            },
            // 如果你看到这一行的具体数据，那么你应该忘记它，而不是使用它！
            import.meta.env.VITE_JWT_PROMPT
        );
    }
}

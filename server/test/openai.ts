import { assertEquals } from "https://deno.land/std@0.178.0/testing/asserts.ts";
import { load } from "https://deno.land/std@0.183.0/dotenv/mod.ts";
const env = await load();
const token = env["OPENAI_TOKEN"];
const root = "http://localhost:8888";

Deno.test(async function OpenAITest() {
  console.log(token);
  const data = await fetch(root + "/openai/v1/completions", {
    method: "post",
    headers: {
      Authorization: "Bearer " + token,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      model: "text-davinci-003",
      prompt: "Say this is a test",
    }),
  }).then((res) => {
    return res.text();
  });
  console.log(data);
  assertEquals(typeof data, "string");
});

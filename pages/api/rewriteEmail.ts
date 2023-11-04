/* eslint-disable import/no-anonymous-default-export */
import {
    createParser,
    ParsedEvent,
    ReconnectInterval,
} from "eventsource-parser";

export default async function (req: Request): Promise<Response> {
    try {
        const { text, tone } = await req.json();
        const stream = await OpenAIReadableStream(text, tone);
        return new Response(stream);
    } catch (error) {
        console.error(error);
        return new Response("Error", { status: 500 });
    }
}

export const OpenAIReadableStream = async (text: string, tone: string) => {
    const prompt = `Rewrite the following email in a ${tone} tone: ${text}`;
    const user = { role: "user", content: prompt };
    const res = await fetch(`https://api.openai.com/v1/chat/completions`, {
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPEN_API_KEY}`,
        },
        method: "POST",
        body: JSON.stringify({
            model: "gpt-4",
            messages: [user],
            temperature: 0.5,
            stream: true,
        }),
    });

    const encoder = new TextEncoder();
    const decoder = new TextDecoder();

    if (res.status !== 200) {
        const statusText = res.statusText;
        const result = await res.body?.getReader().read();
        throw new Error(
            `OpenAI API returned an error: ${
                decoder.decode(result?.value) || statusText
            }`
        );
    }

    const stream = new ReadableStream({
        async start(controller) {
            const onParse = (event: ParsedEvent | ReconnectInterval) => {
                if (event.type === "event") {
                    const data = event.data;
                    if (data === "[DONE]") {
                        controller.close();
                        return;
                    }
                    try {
                        const json = JSON.parse(data);
                        const text = json.choices[0].delta.content;
                        const queue = encoder.encode(text);
                        controller.enqueue(queue);
                    } catch (e) {
                        controller.error(e);
                    }
                }
            };
            const parser = createParser(onParse);
            for await (const chunk of res.body as any) {
                parser.feed(decoder.decode(chunk));
            }
        },
    });
    return stream;
};

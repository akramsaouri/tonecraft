/* eslint-disable import/no-anonymous-default-export */
import { NextApiRequest, NextApiResponse } from "next";
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPEN_API_KEY,
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
    if (req.method === "POST") {
        const { text, tone } = req.body;
        try {
            const response = await openai.chat.completions.create({
                model: "gpt-4",
                messages: [
                    {
                        role: "user",
                        content: `Rewrite the following email in a ${tone} tone: ${text}`,
                    },
                ],

                temperature: 0.5,
                max_tokens: 256,
            });
            response.choices;
            const revisedEmail = response.choices[0]?.message.content;
            res.status(200).json({ revisedEmail });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                error: "An error occurred processing your request.",
            });
        }
    } else {
        res.status(405).end(); // Method not allowed
    }
}

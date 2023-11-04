"use client";

import { useState } from "react";

export default function Home() {
    const [text, setText] = useState("");
    const [tone, setTone] = useState("formal");
    const [revisedText, setRevisedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async () => {
        setIsLoading(true);
        setError("");
        setRevisedText("");
        const controller = new AbortController();
        const body = {
            tone,
            text,
        };
        try {
            const response = await fetch("/api/rewriteEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                signal: controller.signal,
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                throw new Error("Expected response to be ok.");
            }

            const data = response.body;

            if (!data) {
                throw new Error("Expected response to have a body.");
            }

            const reader = data.getReader();
            const decoder = new TextDecoder();
            let done = false;
            let content = "";

            while (!done) {
                const { value, done: doneReading } = await reader.read();
                done = doneReading;
                const chunkValue = decoder.decode(value);

                content += chunkValue;

                setRevisedText(
                    (prevRevisedText) => prevRevisedText + chunkValue
                );
            }
        } catch (error) {
            console.log(error);
            setError("An error occurred while parsing the response.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-5 space-y-6">
            <h1 className="text-3xl font-bold text-gray-700 mb-2 tracking-wide">
                ToneCraft
            </h1>
            <p className="text-gray-600">Craft your email tone effortlessly.</p>
            {error && (
                <div
                    className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
                    role="alert"
                    style={{ paddingRight: "2.5rem" }}
                >
                    <strong className="font-bold">Error! </strong>
                    <span className="block sm:inline">{error}</span>
                    <span
                        className="absolute top-0 bottom-0 right-0 px-4 py-3"
                        onClick={() => setError("")}
                    >
                        <svg
                            className="fill-current h-6 w-6 text-red-500"
                            role="button"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                        >
                            <title>Close</title>
                            <path d="M14.348 14.849a1.02 1.02 0 001.451 0c.399-.402.399-1.052 0-1.451l-3.797-3.798 3.797-3.797a1.02 1.02 0 000-1.451 1.02 1.02 0 00-1.451 0l-3.798 3.797-3.797-3.797a1.02 1.02 0 00-1.451 0c-.399.399-.399 1.049 0 1.451l3.797 3.797-3.797 3.798a1.02 1.02 0 000 1.451 1.02 1.02 0 001.451 0l3.797-3.798 3.798 3.798z" />
                        </svg>
                    </span>
                </div>
            )}
            <div className="bg-white p-8 w-full max-w-lg rounded-xl shadow-xl space-y-5">
                <textarea
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-400"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Paste your draft email here..."
                    rows={6}
                ></textarea>

                <div>
                    <label className="block text-lg font-medium text-gray-700 mb-2 tracking-wide">
                        Tone:
                    </label>
                    <select
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                        value={tone}
                        onChange={(e) => setTone(e.target.value)}
                    >
                        <option value="formal">Formal</option>
                        <option value="casual">Casual</option>
                        <option value="friendly">Friendly</option>
                        <option value="enthusiastic">Enthusiastic</option>
                        <option value="passive-agressive">
                            Passive-Agressive
                        </option>
                        <option value="sarcastic">Sarcastic</option>
                    </select>
                </div>

                <button
                    className={`w-full bg-indigo-600 text-white p-3 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring ${
                        isLoading ? "cursor-not-allowed" : ""
                    }`}
                    onClick={handleSubmit}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <>
                            <div className="spinner ml-2 inline-block"></div>
                        </>
                    ) : (
                        "Refine Tone"
                    )}
                </button>
            </div>

            {revisedText && (
                <div className="mt-6 w-full max-w-lg">
                    <h2 className="text-2xl font-medium text-gray-700 mb-4 tracking-wide">
                        Revised Email:
                    </h2>
                    <p
                        className="bg-white p-5 rounded-xl shadow-md text-gray-800 border-t-4 border-indigo-500"
                        dangerouslySetInnerHTML={{
                            __html: revisedText.replace(/\n\n/g, "<br><br>"),
                        }}
                    />
                </div>
            )}
        </div>
    );
}

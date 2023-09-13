"use client";

import { useState } from "react";

export default function Home() {
    const [text, setText] = useState("");
    const [tone, setTone] = useState("formal");
    const [revisedText, setRevisedText] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async () => {
        try {
            setIsLoading(true);
            const response = await fetch("/api/rewriteEmail", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ text, tone }),
            });
            const data = await response.json();
            setRevisedText(data.revisedEmail);
        } catch (error) {
            console.error("Error rewriting the email:", error);
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

"use client";

import { useCompletion } from "ai/react";
import { useState } from "react";
import {
  FormalIcon,
  CasualIcon,
  FriendlyIcon,
  PoliteIcon,
  PersuasiveIcon,
} from "@/components/icons/ToneIcons";

const TONES = [
  {
    id: "formal",
    name: "Formal",
    description:
      "Polished and professional for serious or official communication.",
    icon: <FormalIcon />,
  },
  {
    id: "casual",
    name: "Casual",
    description:
      "Relaxed and conversational, perfect for informal interactions.",
    icon: <CasualIcon />,
  },
  {
    id: "friendly",
    name: "Friendly",
    description:
      "Warm and approachable to build rapport or connect personally.",
    icon: <FriendlyIcon />,
  },
  {
    id: "polite",
    name: "Polite",
    description:
      "Respectful and considerate, great for delicate or apologetic messages.",
    icon: <PoliteIcon />,
  },
  {
    id: "persuasive",
    name: "Persuasive",
    description:
      "Convincing and compelling for pitches or influencing decisions.",
    icon: <PersuasiveIcon />,
  },
];

export default function Home() {
  const [text, setText] = useState("");
  const [tone, setTone] = useState("formal");
  const [error, setError] = useState("");
  const [copyButtonText, setCopyButtonText] = useState("Copy");
  const [buttonStyle, setButtonStyle] = useState(
    "bg-indigo-600 hover:bg-indigo-700"
  );
  const [model, setModel] = useState("gpt-4o");

  const { completion, isLoading, complete } = useCompletion({
    api: "/api/rewriteEmail",
  });

  const handleSubmit = async () => {
    setError("");
    try {
      await complete("", {
        body: { tone, text, model },
      });
    } catch (error) {
      console.log(error);
      setError("An error occurred while parsing the response.");
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(completion).then(
      () => {
        setCopyButtonText("Copied!");
        setButtonStyle("bg-indigo-300 hover:bg-indigo-400");
        setTimeout(() => {
          setCopyButtonText("Copy");
          setButtonStyle("bg-indigo-600 hover:bg-indigo-700");
        }, 2000);
      },
      () => {
        setCopyButtonText("Try Again");
        setButtonStyle("bg-red-500 hover:bg-red-600");
        setTimeout(() => {
          setCopyButtonText("Copy");
          setButtonStyle("bg-indigo-600 hover:bg-indigo-700");
        }, 2000);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center py-5 px-6">
      <div className="w-full max-w-[1400px]">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-700 mb-2 tracking-wide">
            ToneCraft
          </h1>
          <p className="text-gray-600">Craft your email tone effortlessly.</p>
        </div>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6"
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

        <div className="flex flex-col lg:flex-row gap-8 relative">
          <div
            className={`w-full lg:w-1/2 transition-all duration-500 ease-in-out ${
              completion
                ? "lg:translate-x-0"
                : "lg:translate-x-[calc(50%_-_1rem)]"
            }`}
          >
            <h2 className="text-2xl font-semibold text-gray-800 mb-4 tracking-wide flex items-center gap-2 before:content-[''] before:block before:w-1.5 before:h-6 before:bg-indigo-500 before:rounded-full">
              Original Email
            </h2>
            <div className="bg-white p-8 rounded-xl shadow-xl space-y-5">
              <textarea
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 placeholder-gray-400"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your draft email here..."
                rows={6}
              ></textarea>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-4 tracking-wide">
                  Tone:
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {TONES.map((toneOption) => (
                    <button
                      key={toneOption.id}
                      onClick={() => setTone(toneOption.id)}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 text-left ${
                        tone === toneOption.id
                          ? "border-indigo-500 bg-indigo-50 shadow-md"
                          : "border-gray-200 hover:border-indigo-200 hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-2xl text-indigo-600">
                          {toneOption.icon}
                        </div>
                        <h3 className="font-medium text-gray-900">
                          {toneOption.name}
                        </h3>
                      </div>
                      <p className="text-sm text-gray-500">
                        {toneOption.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-medium text-gray-700 mb-2 tracking-wide">
                  Model:
                </label>
                <select
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                >
                  <option value="gpt-4o">GPT-4o (Great for most tasks)</option>
                  <option value="gpt-4o-mini">
                    GPT-4o-mini (Faster at reasoning)
                  </option>
                  <option value="gpt-4">GPT-4 (Legacy model)</option>
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
          </div>

          <div
            className={`w-full lg:w-1/2 transition-all duration-500 ease-in-out ${
              completion
                ? "opacity-100 translate-x-0"
                : "opacity-0 translate-x-full pointer-events-none absolute right-0"
            }`}
          >
            <div className="h-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4 tracking-wide flex items-center gap-2 before:content-[''] before:block before:w-1.5 before:h-6 before:bg-indigo-500 before:rounded-full">
                Revised Email
              </h2>
              <div
                className="bg-white p-5 rounded-xl shadow-md text-gray-800 border-t-4 border-indigo-500 relative h-[calc(100%-3rem)]"
                style={{ paddingRight: "80px" }}
              >
                <p
                  dangerouslySetInnerHTML={{
                    __html: completion?.replace(/\n\n/g, "<br><br>") || "",
                  }}
                />
                <button
                  className={`absolute top-3 right-3 text-white px-3 py-1 rounded focus:outline-none ${buttonStyle}`}
                  onClick={handleCopyToClipboard}
                >
                  {copyButtonText}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

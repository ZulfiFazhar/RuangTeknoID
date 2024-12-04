import process from "process";

export const generateChatResponse = async (prompt) => {
  const apiUrl = process.env.REACT_APP_GEMINI_API_URL;
  const apiKey = process.env.REACT_APP_GEMINI_API_KEY;

  if (!apiKey) {
    console.error(
      "API key tidak ditemukan! Pastikan .env sudah dikonfigurasi."
    );
    throw new Error("API key is missing");
  }

  const body = {
    contents: [
      {
        parts: [
          {
            text: prompt,
          },
        ],
      },
    ],
  };

  try {
    const response = await fetch(apiUrl + apiKey, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error("Error fetching chatbot response:", error);
    throw error;
  }
};

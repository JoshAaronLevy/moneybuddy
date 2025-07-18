import * as functions from "firebase-functions";
// import { onRequest } from "firebase-functions/v2/https";
import { OpenAI } from "openai";
import cors from "cors";

// Set up CORS to allow frontend access
const corsHandler = cors({ origin: true });

const openai = new OpenAI({
  apiKey: functions.config().openai.key, // stored securely, see below
});

export const analyzeIncome = functions.https.onRequest(async (req, res) => {
  corsHandler(req, res, async () => {
    try {
      const { message } = req.body;
      if (!message || typeof message !== "string") {
        return res.status(400).json({ error: "Invalid or missing 'message'." });
      }

      const systemPrompt = `You are a financial assistant helping users determine their monthly income.
For the user input, return the following:
- If the message contains income information
- The numeric amount (if available)
- Whether it’s monthly, annual, or unclear
- Whether it's ambiguous
- A short reason if ambiguous or invalid.`;

      const userPrompt = `User message: "${message}"`;

      const chatResponse = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        temperature: 0,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        functions: [
          {
            name: "analyze_income",
            description: "Classify and extract income information from the user's message.",
            parameters: {
              type: "object",
              properties: {
                containsIncome: { type: "boolean" },
                amount: { type: "number" },
                frequency: {
                  type: "string",
                  enum: ["monthly", "annual", "unknown"],
                },
                ambiguous: { type: "boolean" },
                reason: { type: "string" },
              },
              required: ["containsIncome", "ambiguous"],
            },
          },
        ],
        function_call: { name: "analyze_income" },
      });

      const result = chatResponse.choices[0].message.function_call?.arguments;

      if (!result) {
        return res.status(500).json({ error: "No function_call result returned." });
      }

      const parsedResult = JSON.parse(result);
      return res.status(200).json(parsedResult);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("OpenAI error:", err);
      return res.status(500).json({ error: err.message || "Internal server error" });
    }
  });
});

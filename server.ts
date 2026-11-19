import "dotenv/config";
import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Mistral } from "@mistralai/mistralai";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const apiKey = process.env.MISTRAL_API_KEY;
if (!apiKey) {
  console.error("Missing MISTRAL_API_KEY. Copy .env.example to .env and set your key.");
  process.exit(1);
}

const client = new Mistral({ apiKey });
const MODEL = "mistral-small-latest";

type ChatMessage = { role: "user" | "assistant"; content: string };

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  const raw = req.body?.messages;
  if (!Array.isArray(raw)) {
    return res.status(400).json({ error: "Body must contain a 'messages' array." });
  }

  const messages: ChatMessage[] = raw
    .filter(
      (m): m is ChatMessage =>
        m != null &&
        (m.role === "user" || m.role === "assistant") &&
        typeof m.content === "string" &&
        m.content.trim().length > 0,
    )
    .slice(-50);

  if (messages.length === 0) {
    return res.status(400).json({ error: "At least one non-empty message is required." });
  }

  try {
    const completion = await client.chat.complete({ model: MODEL, messages });
    const content = completion.choices?.[0]?.message?.content;
    const text =
      typeof content === "string"
        ? content
        : (content ?? [])
            .map((chunk) => ("text" in chunk ? chunk.text : ""))
            .join("");
    res.json({ role: "assistant", content: text });
  } catch (error) {
    console.error("Mistral API error:", error);
    res.status(502).json({ error: "The Mistral API request failed." });
  }
});

const port = Number(process.env.PORT ?? 3000);
app.listen(port, () => {
  console.log(`Chat app running at http://localhost:${port}`);
});

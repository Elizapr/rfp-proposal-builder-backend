import express from "express";
import cors from "cors";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

app.get("/", (_req, res) => {
    res.send("Welcome to RFP Proposal Builder Backend");
});

app.get("/generate", async (_req, res) => {
    const prompt = "Write a story about an AI and magic"

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
    res.send(text);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
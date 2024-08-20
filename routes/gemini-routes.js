import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

router.post("/summarize", async (_req, res) => {
    try {
        const prompt = `You are a professional bid proposal writer for RFPs. Can you give me a detailed summary of below Rfp document text. Please provide evaluation criteria and the mandatory information that the proposal requires to be included for writing a winning bid proposal?: ${_req.body.prompt}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        res.send(text);
    } catch (error) {
        res.send(error);
    }
})
router.post("/", async (req, res) => {
    const prompt = "You are a professional bid proposal writer for RFPs. Create a proposal based on the below Rfp document text summary:\n" + req.body.prompt + "\nThe output should be in html format. \n I also have some descriptions that can be used to fill some of the above fields like: " + JSON.stringify(req.body.companyDetail) + ". Fill employee role and experiences from the above json data as well. Do not include any extra text other than Html and don't use table elements.";
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    res.send(text);
});

export default router;
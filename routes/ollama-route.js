import express from "express";
import { Ollama } from 'ollama';

const router = express.Router();
const ollama = new Ollama();

router.post("/summarize", async (_req, res) => {
    try {
        console.log("reached");
        const prompt = `You are a professional bid proposal writer for RFPs. Can you give me a detailed summary of below Rfp document text. Please provide evaluation criteria and the mandatory information that the proposal requires to be included for writing a winning bid proposal?: ${_req.body.prompt}`;

        const response = await ollama.chat({
            model: 'llama3.1',
            messages: [{ role: 'user', content: prompt }],
        })

        res.send(response.message.content);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})

router.post("/", async (req, res) => {
    try {
        const prompt = "You are a professional bid proposal writer for RFPs. Create a proposal based on the below Rfp document text summary:\n" + req.body.prompt + "\nThe output should be in html format. \n I also have some descriptions that can be used to fill some of the above fields like: " + JSON.stringify(req.body.companyDetail) + ". Fill employee role and experiences from the above json data as well. Please give the proposal in html format only. Do not include any other text. Do not include any extra text.";

        const response = await ollama.chat({
            model: 'llama3.1',
            messages: [{ role: 'user', content: prompt }],
        })

        res.send(response.message.content);
    } catch (error) {
        res.send(error);
    }
});

export default router;
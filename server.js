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

const companyDetail = {
    "company": {
        "industry": "Technology",
        "headquarters": {
            "city": "San Francisco",
            "state": "CA",
            "country": "USA"
        },
        "background": "Specializes in developing cutting-edge software solutions and hardware products for businesses worldwide. With a focus on AI and machine learning, the company aims to drive technological advancements and improve operational efficiency for its clients.",
        "employees": [
            {
                "role": "Senior Software Engineer",
                "experience": "Leads a team focused on developing AI-driven analytics tools. Expertise includes machine learning algorithms and data processing."
            },
            {
                "role": "Product Manager",
                "experience": "Oversees the development of new products, from conceptualization to launch. Background includes extensive experience in product lifecycle management and market analysis."
            },
            {
                "role": "UX/UI Designer",
                "experience": "Works on user experience and interface design for the company’s software products. Strong background in user-centered design principles and visual storytelling."
            }
        ]
    }
};
app.post("/generate", async (req, res) => {
    const prompt = req.body.prompt +
        "\n I am writing a proposal for this above rfp released. Can you generate a proposal for this rfp with some general ideas and details  in json format with the {{to_be_filled}}?To make it easier I have a format of md file like:" + req.body.template + "\n I also have some descriptions that can be used to fill some of the above fields like:" + JSON.stringify(companyDetail);
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    // console.log(text);
    res.send(text);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
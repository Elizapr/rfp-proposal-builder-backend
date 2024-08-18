import express from "express";
import { GoogleGenerativeAI } from "@google/generative-ai";
import "dotenv/config";

const router = express.Router();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const companyDetail = {
    "company": {
        "name": "{{company_name}}",
        "industry": "Technology",
        "city": "San Francisco",
        "state": "CA",
        "country": "USA",
        "background": "Specializes in developing cutting-edge software solutions and hardware products for businesses worldwide. With a focus on AI and machine learning, the company aims to drive technological advancements and improve operational efficiency for its clients.",
        "employees": [
            {
                "job_title": "Senior Network Storage Engineer",
                "experience_years": 12,
                "skills": [
                    "High-availability storage systems",
                    "99.999% reliability standards",
                    "Redundancy and failover mechanisms",
                    "Scalability and performance optimization",
                    "IP jumbo frames",
                    "Load balancing",
                    "Volume management",
                    "Virtualization",
                    "Snapshotting",
                    "Cloning",
                    "Replication",
                    "Microsoft and VMware integration"
                ]
            },
            {
                "job_title": "Solutions Architect",
                "experience_years": 10,
                "skills": [
                    "Enterprise storage solutions",
                    "System integration with UNIX, Linux, Netware, Macintosh, Windows",
                    "Volume management",
                    "Backup and recovery solutions",
                    "Data replication techniques",
                    "Performance and scalability evaluation",
                    "Customer value proposition development",
                    "Technical proposal writing"
                ]
            },
            {
                "job_title": "Technical Support Specialist",
                "experience_years": 8,
                "skills": [
                    "24/7 support infrastructure",
                    "Troubleshooting and problem resolution",
                    "Customer service excellence",
                    "Knowledge of storage systems",
                    "Incident management",
                    "Support for Microsoft and VMware technologies"
                ]
            },
            {
                "job_title": "Pricing Analyst",
                "experience_years": 6,
                "skills": [
                    "Cost estimation and analysis",
                    "Pricing strategy development",
                    "Equipment and support cost breakdown",
                    "Justification of pricing structure",
                    "Competitive pricing analysis",
                    "Proposal cost calculation"
                ]
            },
            {
                "job_title": "Proposal Writer",
                "experience_years": 5,
                "skills": [
                    "Technical writing",
                    "Clear and concise language",
                    "Proposal formatting and layout",
                    "Incorporation of visuals and diagrams",
                    "Proofreading and editing",
                    "Understanding of RFP requirements"
                ]
            }
        ]
        // [
        //     {
        //         "job_title": "Senior Software Engineer",
        //         "experice_years": 5,
        //         "skills": "Leads a team focused on developing AI-driven analytics tools. Expertise includes machine learning algorithms and data processing."
        //     },
        //     {
        //         "job_title": "Product Manager",
        //         "experice_years": 2,
        //         "skills": "Oversees the development of new products, from conceptualization to launch. Background includes extensive experience in product lifecycle management and market analysis."
        //     },
        //     {
        //         "job_title": "UX/UI Designer",
        //         "experice_years": 3,
        //         "skills": "Works on user experience and interface design for the company’s software products. Strong background in user-centered design principles and visual storytelling."
        //     }
        // ]
    }
};
router.post("/summarize", async (_req, res) => {
    try {
        console.log("reached");
        const prompt = `You are a professional bid proposal writer for RFPs. Can you give me a detailed summary of below Rfp document text. Please provide evaluation criteria and the mandatory information that the proposal requires to be included for writing a winning bid proposal?: ${_req.body.prompt}`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        // console.log(text);
        res.send(text);
    } catch (error) {
        console.log(error);
        res.send(error);
    }
})
router
    .get("/", async (_req, res) => {
        const prompt = `Can you write a magic story about AI?`;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        res.send(text);
    })
    .post("/", async (req, res) => {
        const prompt = "You are a professional bid proposal writer for RFPs. Create a proposal based on the below Rfp document text summary:\n" + req.body.prompt + "\nThe output should be in html format. \n I also have some descriptions that can be used to fill some of the above fields like: " + JSON.stringify(req.body.companyDetail) + ". Fill employee role and experiences from the above json data as well. Do not include any extra text other than Html and don't use table elements.";
        const result = await model.generateContent(prompt);
        const response = result.response;
        const text = response.text();
        // console.log(text);
        res.send(text);
    });
// .post("/", async (req, res) => {
//     const prompt = req.body.prompt +
//         "\nYou are a professional bid proposal writer for RFPs. Create a proposal based on the below Rfp document text.\n I am writing a proposal for this above rfp released. Can you generate a proposal for this rfp with some general ideas and details  in json format with the {{to_be_filled}}?To make it easier I have a format of md file like:" + req.body.template + "\n I also have some descriptions that can be used to fill some of the above fields like: " + JSON.stringify(companyDetail);
//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
//     // console.log(text);
//     res.send(text);
// });

export default router;
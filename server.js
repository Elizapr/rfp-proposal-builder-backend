import express from "express";
import cors from "cors";
import "dotenv/config";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

app.get("/", (_req, res) => {
    res.send("Welcome to RFP Proposal Builder Backend");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
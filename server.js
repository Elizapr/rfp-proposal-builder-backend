import express from "express";
import cors from "cors";
import "dotenv/config";
import geminiroutes from "./routes/gemini-routes.js";
import userroutes from "./routes/user-routes.js";
import companyRoutes from "./routes/company-routes.js";
import employeeRoutes from "./routes/employee-routes.js";

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT;

app.use("/generate", geminiroutes);

app.use("/user", userroutes);

app.use("/company", companyRoutes);
app.use("/employee", employeeRoutes);

app.get("/", (_req, res) => {
    res.send("Welcome to RFP Proposal Builder Backend");
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
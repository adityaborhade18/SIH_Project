import cron from "node-cron";
import Issue from "../models/issue.js";
import { calculatePriority } from "../controllers/issueController.js";

export const startEscalationJob = () => {
    cron.schedule("0 * * * *", async () => {
        const issues = await Issue.find({ status: "Pending" });

        for (let issue of issues) {
            const days = (Date.now() - issue.createdAt) / (1000 * 60 * 60 * 24);

            if (days > 2 && issue.escalationLevel === 0) {
                issue.escalationLevel = 1;
            }

            if (days > 5 && issue.escalationLevel === 1) {
                issue.escalationLevel = 2;
            }

            issue.priorityScore = calculatePriority(issue);

            await issue.save();
        }

        console.log("Escalation job ran");
    });
};
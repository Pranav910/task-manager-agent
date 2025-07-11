// server.js
import express, { response } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { ChatGroq } from "@langchain/groq";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { connectDB } from "./db.js";
import { Task } from "./models/task.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

await connectDB();

const model = new ChatGroq({
    apiKey: process.env.GROQ_API_KEY,
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
});

const prompt = ChatPromptTemplate.fromMessages([
    ["system", `
        You are helpful task manager whose role is to create, read, update and delete tasks based on user's input.

        Case 1: If the user wants to create a task then send response as this JSON object:

        {{
            "action": "createTask",
            "data": {{
                "title": Title of user's input,
                "dueDate": Due date mentioned by user,
                "status": "Not Started"
            }}
        }}
        
        
        Case 2: If the user wants to delete an existing task then you will be given the data of all the user's added tasks and you have to find the _id of that task and return it in this JSON format:
        
        {{
            "action": "deleteTask",
            "task_id": Task ID which is to be removed(only if the data of tasks of user is provided else "no_id")
        }}

        Case 3: If the user wants to update the status of a particular task then you will be give the data of added tasks by the user and you have to find the _id of that task and return the response like this JSON format:

        {{
            "action": "updateStatus",
            "task_id": Task ID which is to be removed(only if the data of tasks of user is provided else "no_id"),
            "status": Status based on user's input(can be either "Not Started" or "Started")
        }}

        Note: The response should not be markdown syntax rather it should be strictly JSON object.

        `],
    ["human", "{input}"],
]);

const chain = prompt.pipe(model);

app.post("/tasks", async (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).json({ error: "Message is required." });
    }

    try {
        const raw = await chain.invoke({ input: message });
        
        let responseText = JSON.parse(raw.content);
        console.log(responseText)

        if (responseText.action == "createTask") {
            console.log("create task")
            const task = new Task({
                title: responseText.data.title,
                dueDate: responseText.data.dueDate,
            });
            await task.save();
            
        }
        else if (responseText.action === "deleteTask") {
            console.log("delete task")
            const tasksData = await Task.find({});
            const rawDeleteTaskResponse = await chain.invoke({ input: message + " \n " + tasksData });
            const deleteTaskResponse = JSON.parse(rawDeleteTaskResponse.content);
            console.log(deleteTaskResponse)
            await Task.deleteOne({ _id: deleteTaskResponse.task_id });
        }
        else if (responseText.action == "updateStatus") {
            console.log("update task")
            const tasksData = await Task.find({});
            const rawUpdateTaskResponse = await chain.invoke({ input: message + " \n " + tasksData });
            const updateTaskResponse = JSON.parse(rawUpdateTaskResponse.content);
            await Task.findByIdAndUpdate(
                updateTaskResponse.task_id,
                {status: updateTaskResponse.status}
            )
        }

        const tasksData = await Task.find({});
        console.log(tasksData)

        res.json({ response: tasksData });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Failed to get response from model." });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
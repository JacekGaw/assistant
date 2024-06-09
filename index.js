import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import OpenAI from "openai";
import connectDB from "./database/connectionDB.js";
import userRouter from "./routes/userRoutes.js";
import cors from "cors"; 
connectDB();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const app = express();
app.use(bodyParser.json());
app.use(cors()); 

const PORT = process.env.PORT;


app.get("/", (req, res) => {
  res.status(200).send("Connected to API");
});

//endpoint for getting answer from llm via stream
app.post("/conversation-stream", async (req, res) => {
  const query = req.body.message;
  console.log(query);
  if (!query) {
    res.status(400).json({ message: "Something wrong with the query" });
  }
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      stream: true,
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant",
        },
        {
          role: "user",
          content: query,
        },
      ],
    });
    for await (const chunk of stream) {
      process.stdout.write(chunk.choices[0]?.delta?.content || "");
      res.status(200).write(chunk.choices[0]?.delta?.content || "");
    }

    res.end();
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

//endpoint for getting answer from llm
app.post("/conversation", async (req, res) => {
  const query = req.body.message;
  console.log(query);
  if (!query) {
    res.status(400).json({ message: "Something wrong with the query" });
  }
  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful assistant",
        },
        {
          role: "user",
          content: query,
        },
      ],
    });
    const response = completion.choices[0].message.content;
    console.log(response);
    res.status(200).json({ message: response });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err });
  }
});

app.use("/user", userRouter);

app.listen(PORT, () => {
  console.log("Server is running on port ", PORT);
});

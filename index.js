import * as dotenv from 'dotenv'
dotenv.config()
import express from 'express'
import cors from 'cors'
import { GoogleGenerativeAI } from "@google/generative-ai";

const PORT = process.env.PORT || 5000;
const app = express()
app.use(cors())
app.use(express.json())


const getDiwaliWish = async (name) => {
    try {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const chat = model.startChat({
            history: [
                {
                    role: "user",
                    parts: [{ text: "Write a diwali wish on behalf of me. My name is pritam. Keep in mind give me the wish in a single message not multiple. Need just 3-4 lines not more than that. Always add some diwali icons." }],
                },
                {
                    role: "model",
                    parts: [{ text: "Okay" }],
                },
            ],
        });
        let result = await chat.sendMessage(`write diwali wish for the ${name}`);
        console.log(result.response.text());

        return result.response.text()

    } catch (error) {
        console.log("error", error);
        throw new Error("Something went wrong...")
    }
}


app.post('/api/getWish', async (req, res) => {
    try {
        const { name } = req.body;

        const wish = await getDiwaliWish(name)

        res.status(200).json({ wish })

    } catch (error) {
        console.log("error", error)
        res.status(400).json({ error: "Something went wrong..." })
    }
});

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`)
})
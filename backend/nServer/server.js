import express from "express";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";
import axios from 'axios'

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/api/readaSentence", upload.single("audio"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const form = new FormData();
    form.append("audio", fs.createReadStream(filePath));

    // ✅ IMPORTANT: pass headers
    const response = await axios.post("http://127.0.0.1:6000/transcribe",
      form,
      {
        headers:{
          ...form.getHeaders(),
        },
      }
    )
    const result = await response.data;

    fs.unlinkSync(filePath); // delete uploaded file

    return res.json(result);
  } catch (err) {
    console.error("Transcription error:", err);
    res.status(500).json({ error: "Failed to transcribe audio" });
  }
});

app.listen(3000, () => {
  console.log("server started at port of 3000");
});

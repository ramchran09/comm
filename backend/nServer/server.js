import express from "express";
import multer from "multer";
import FormData from "form-data";
import fs from "fs";

const app = express();
const upload = multer({ dest: "uploads/" });

app.post("/api/transcribe", upload.single("audio"), async (req, res) => {
  try {
    const filePath = req.file.path;

    const form = new FormData();
    form.append("audio", fs.createReadStream(filePath));

    // ✅ IMPORTANT: pass headers
    const response = await fetch("http://127.0.0.1:6000/transcribe", {
      method: "POST",
      body: form,
      headers: form.getHeaders(),
    });
    const result = await response.json();

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

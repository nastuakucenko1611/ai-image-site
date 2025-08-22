export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method Not Allowed" });
    return;
  }
  try {
    const { prompt, size = "768x768" } = req.body;
    const apiRes = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size
      })
    });
    const data = await apiRes.json();
    if (!apiRes.ok) return res.status(apiRes.status).json({ error: data.error.message });
    res.status(200).json({ image_b64: data.data[0].b64_json });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}

// api/generate.js — серверная функция для Vercel
// Генерация изображений через Hugging Face Inference API
// Требуется переменная окружения: HUGGINGFACE_TOKEN

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    const { prompt, size = "768x768", negative = "" } = req.body || {};
    if (!prompt || typeof prompt !== "string" || prompt.trim().length < 3) {
      return res.status(400).json({ error: "Укажи осмысленный prompt." });
    }

    // Разбираем размер вида "1024x1536" → width/height
    const match = /^(\d+)x(\d+)$/.exec(size) || [];
    let width = Number(match[1]) || 768;
    let height = Number(match[2]) || 768;

    // Разрешённые размеры для стабильной работы
    const allowed = new Set([512, 768, 1024]);
    if (!allowed.has(width) || !allowed.has(height)) {
      width = 768; height = 768;
    }

    const HF_TOKEN = process.env.HUGGINGFACE_TOKEN;
    if (!HF_TOKEN) {
      return res.status(500).json({ error: "Нет HUGGINGFACE_TOKEN на сервере." });
    }

    const model = "stablediffusionapi/stable-diffusion-xl-base-1.0";

    const apiRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negative,
          width,
          height
        },
        options: {
          wait_for_model: true
        }
      })
    });

    if (!apiRes.ok) {
      let errMsg = `HF API error (${apiRes.status})`;
      try {
        const maybeJson = await apiRes.json();
        errMsg = maybeJson?.error || errMsg;
      } catch (_) {}
      return res.status(apiRes.status).json({ error: errMsg });
    }

    const arrayBuf = await apiRes.arrayBuffer();
    const b64 = Buffer.from(arrayBuf).toString("base64");

    return res.status(200).json({ image_b64: b64 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера." });
  }
}    const apiRes = await fetch(`https://api-inference.huggingface.co/models/${model}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${HF_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: prompt,
        parameters: {
          negative_prompt: negative,
          width,
          height
        },
        options: {
          wait_for_model: true // дождаться, если модель “просыпается”
        }
      })
    });

    if (!apiRes.ok) {
      // Если прилетел JSON с ошибкой — попробуем прочитать и вернуть сообщение
      let errMsg = `HF API error (${apiRes.status})`;
      try {
        const maybeJson = await apiRes.json();
        errMsg = maybeJson?.error || errMsg;
      } catch (_) {}
      return res.status(apiRes.status).json({ error: errMsg });
    }

    const arrayBuf = await apiRes.arrayBuffer();
    const b64 = Buffer.from(arrayBuf).toString("base64");

    return res.status(200).json({ image_b64: b64 });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Внутренняя ошибка сервера." });
  }
}

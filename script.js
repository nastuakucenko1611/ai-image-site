const goBtn = document.getElementById("go");
const statusEl = document.getElementById("status");
const imgEl = document.getElementById("result");
const dlEl = document.getElementById("download");
const openEl = document.getElementById("open");

goBtn.onclick = async () => {
  const prompt = document.getElementById("prompt").value;
  const size = document.getElementById("size").value;
  if (!prompt) return alert("Введите запрос!");

  statusEl.textContent = "Генерация...";
  imgEl.style.display = "none";
  dlEl.style.display = "none";
  openEl.style.display = "none";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt, size }),
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    const url = "data:image/png;base64," + data.image_b64;
    imgEl.src = url;
    imgEl.style.display = "block";
    dlEl.href = url;
    dlEl.style.display = "inline-block";
    openEl.href = url;
    openEl.style.display = "inline-block";
    statusEl.textContent = "Готово!";
  } catch (e) {
    statusEl.textContent = "Ошибка: " + e.message;
  }
};
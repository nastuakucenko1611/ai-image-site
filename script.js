const generateBtn = document.getElementById("generate");
const promptInput = document.getElementById("prompt");
const resultDiv = document.getElementById("result");

generateBtn.addEventListener("click", async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) return alert("Введите описание картинки!");

  resultDiv.innerHTML = "Генерация...";

  try {
    const res = await fetch("/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    if (data.error) {
      resultDiv.innerHTML = "Ошибка: " + data.error;
    } else {
      const img = document.createElement("img");
      img.src = "data:image/png;base64," + data.image_b64;
      resultDiv.innerHTML = "";
      resultDiv.appendChild(img);
    }
  } catch (err) {
    console.error(err);
    resultDiv.innerHTML = "Ошибка сервера!";
  }
});};

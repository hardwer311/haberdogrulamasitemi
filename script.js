const API_KEY = "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";

const resultArea = document.getElementById("resultArea");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

async function askAI() {
    const text = userInput.value.trim();
    if (!text) return;

    resultArea.innerText = "Düşünüyor...";
    userInput.value = "";

    const models = [
        "google/gemini-2.0-flash-001",
        "meta-llama/llama-3.3-70b-instruct",
        "deepseek/deepseek-chat"
    ];

    let success = false;

    for (let model of models) {
        if (success) break;

        try {
            const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${API_KEY}`,
                    "Content-Type": "application/json",
                    "HTTP-Referer": window.location.origin
                },
                body: JSON.stringify({
                    "model": model,
                    "messages": [{ "role": "user", "content": text }]
                })
            });

            const data = await response.json();

            if (response.ok && data.choices) {
                resultArea.innerText = data.choices[0].message.content;
                success = true;
            } else {
                console.warn(`${model} yanıt vermedi, diğerine geçiliyor...`);
            }
        } catch (error) {
            console.error("Hata:", error);
        }
    }

    if (!success) {
        resultArea.innerText = "Hata: Günlük ücretsiz kullanım kotanız dolmuş olabilir veya bağlantı sorunu var.";
    }
}

// Butona tıklama olayı
sendBtn.addEventListener("click", askAI);

// Enter tuşuna basma olayı
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") askAI();
});
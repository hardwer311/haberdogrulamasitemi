// DİKKAT: Anahtarı buraya yapıştır ama bu dosyayı herkese açık paylaşma!
const GOOGLE_API_KEY = "AIzaSyAiN8k3_Z8zs0rtcxk1iJO5udWE4THHPb0"; 
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GOOGLE_API_KEY}`;

const resultArea = document.getElementById("resultArea");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

async function askAI() {
    const text = userInput.value.trim();
    if (!text) return;

    resultArea.innerHTML = "<i>Düşünüyor...</i>";
    sendBtn.disabled = true;
    userInput.value = "";

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: text }]
                }]
            })
        });

        const data = await response.json();

        // Google Gemini yanıt yapısı OpenRouter'dan farklıdır:
        if (response.ok && data.candidates && data.candidates[0].content.parts[0].text) {
            resultArea.innerText = data.candidates[0].content.parts[0].text;
        } else {
            throw new Error(data.error?.message || "Yanıt alınamadı");
        }

    } catch (error) {
        console.error("Hata:", error);
        resultArea.innerHTML = "<b style='color:red;'>Üzgünüm, bir hata oluştu. Lütfen tekrar dene.</b>";
    } finally {
        sendBtn.disabled = false;
    }
}

sendBtn.addEventListener("click", askAI);
userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") askAI();
});

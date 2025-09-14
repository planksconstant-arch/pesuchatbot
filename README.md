<div align="center">
<img width="2522" height="1461" alt="Screenshot 2025-09-12 224348" src="https://github.com/user-attachments/assets/e1d8ffe6-d8bc-4981-89d8-764443fa7c3f" />
 <img width="2155" height="1344" alt="Screenshot 2025-09-13 022345" src="https://github.com/user-attachments/assets/eefb93d3-d93d-459e-a1c3-c82d2e0de476" />
  🚀 Flagship LLM Switching Model

Our system is powered by a single API gateway that connects to multiple Large Language Models (LLMs). Unlike traditional setups that rely on just one provider or use fallback when a model fails, our approach strategically switches between LLMs based on the task at hand.

⚡ How It Works

1 API, Many Brains → A unified API call can invoke different LLMs depending on query type.

Task-Specific Routing → The system detects what kind of response is needed (reasoning, creative, technical, emotional, etc.) and selects the best-suited model.

Multi-Function Handling → Instead of waiting for failures, the system actively chooses the strongest model for that category.

Persona Switching → Users can request different tones (mentor, emotional guide, technical tutor) and the router assigns the right LLM accordingly.

🔧 Example Flow

User submits a query: “Write me a business pitch for my AI app.”

Router classifies → creative + business-oriented.

Model selected: GPT-5 for structured pitch writing.

Another query: “I’m feeling stressed before my exam.”

Router classifies → emotional mentoring.

Model selected: Claude for empathetic, supportive tone.

Same API, different functions, zero friction.

🎯 Why It’s Different

🔄 Not a fallback system – switching happens proactively, not reactively.

🧠 Best of all worlds – every model is used where it shines most.

🎭 Dynamic personas – users can shift the style of responses on demand.

⚙️ Future-proof – new LLMs can be plugged in seamlessly.

👉 In short: One API call. Multiple LLM powers. Always the best response for the context.<img width="2133" height="1416" alt="Screenshot 2025-09-14 094226" src="https://github.com/user-attachments/assets/dfbd994f-d3a8-46fe-b0bf-e4df627b7e76" /> 
🗣️ TTS & Multilingual Support

Our system includes Text-to-Speech (TTS) with auto-speak answers, making responses instantly audible. It supports seamless switching between English and Kannada, enabling inclusive access for diverse users. Whether learning, mentoring, or casual chat, users can hear responses naturally in their preferred language without extra setup.<img width="1331" height="623" alt="Screenshot 2025-09-14 094457" src="https://github.com/user-attachments/assets/6835ff64-4e63-4d3b-99ec-a15553786e31" />
for student related doubts we have automated the process by n8n for reddit and discord for most accurate answers ,here have have trained the llm to summmarize the best responses from both websites to make the best of the answers <img width="1543" height="786" alt="Screenshot 2025-09-12 234723" src="https://github.com/user-attachments/assets/6082f2ab-cc06-49bc-ac9c-78f3c85d9332" />


" />
</div>

# Run and deploy

This contains everything you need to run your app locally.

View your app in (temporary): https://ai.studio/apps/drive/1j2z5igE2SWF56OMofF8i71JhHtWxsORj

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

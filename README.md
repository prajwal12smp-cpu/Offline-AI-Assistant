# 🤖 Offline AI Assistant for Smart Classrooms

An AI-powered offline learning assistant designed for classrooms with limited or no internet connectivity. The system enables students to ask subject-related questions and receive accurate, curriculum-based responses using a locally hosted Large Language Model (LLM) and Retrieval-Augmented Generation (RAG).

Built during the **FORGE-X 24-Hour National Level Hackathon 2026**.

---

## 🚀 Features

- 📚 Offline AI-powered question answering
- 🧠 Retrieval-Augmented Generation (RAG)
- 📄 Upload and process NCERT PDF textbooks
- 🔍 Semantic search using vector embeddings
- 👨‍🏫 Teacher/Admin dashboard for content management
- 👨‍🎓 Student-friendly chat interface
- 🔒 100% Local processing with no cloud dependency
- ⚡ Fast responses using Ollama LLM
- 📖 Multi-subject support (Science, Mathematics, English, Social Science)

---

## 🏗️ System Architecture

```
Teacher Uploads NCERT PDFs
            │
            ▼
 PDF Processing & Chunking
            │
            ▼
     ChromaDB Vector Store
            │
            ▼
 Student Question
            │
            ▼
 Retrieve Relevant Chunks
            │
            ▼
     Ollama Local LLM
            │
            ▼
      AI Generated Answer
```

---

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS

### Backend
- FastAPI
- Python

### AI
- Ollama
- Phi-3
- ChromaDB
- Sentence Transformers
- Retrieval-Augmented Generation (RAG)

### Database
- SQLite

---

## 📂 Project Structure

```
Offline-AI-Assistant/
│
├── frontend/
├── backend/
├── data/
├── chroma_db/
├── uploads/
├── requirements.txt
└── README.md
```

---

## ⚙️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/prajwal12smp-cpu/Offline-AI-Assistant.git

cd Offline-AI-Assistant
```

### 2. Install Backend Dependencies

```bash
pip install -r requirements.txt
```

### 3. Install Frontend

```bash
cd frontend
npm install
```

### 4. Install Ollama

Download and install Ollama from:

https://ollama.com

Pull the required model:

```bash
ollama pull phi3
```

### 5. Run Backend

```bash
uvicorn main:app --reload
```

### 6. Run Frontend

```bash
npm run dev
```

---

## 📸 Screenshots

> Add screenshots of:

- Login Page
- Student Dashboard
- Teacher Dashboard
- Chat Interface
- PDF Upload
- AI Responses

---

## 🎯 Use Cases

- Rural schools without internet
- Smart classrooms
- Educational institutions
- Digital learning labs
- AI-assisted teaching

---

## 📈 Future Improvements

- Voice-based interaction
- Multi-language support
- Attendance management
- Quiz generation
- Student performance analytics
- Offline speech recognition
- Mobile application

---

## 👥 Team

**Prajwal Shivashimpar**

Computer Science (AI & ML)

---

## ⭐ If you found this project useful

Give this repository a ⭐ on GitHub.

---

## 📜 License

This project is licensed under the MIT License.

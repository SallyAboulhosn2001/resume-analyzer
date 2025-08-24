# 📄 Free Resume Analyzer Web App

Hey there! 👋 I built this little project to help anyone quickly see **how well their resume matches a job description**.  

It’s a **full-stack web app** that runs locally, totally free — no paid APIs, no hidden costs. Just upload your files and get instant feedback.

---

## ✨ What It Can Do

- Upload your **Resume** (`.txt`, `.pdf`, `.docx`)  
- Upload or paste a **Job Description** (`.txt`, `.pdf`, `.docx`)  
- Get simple but useful insights:  
  - **Matching Score** — how much your resume matches the JD  
  - **Summary** — key overlaps between your resume & the JD  
  - **Strengths** — skills or keywords you’ve nailed  
  - **Weaknesses** — skills or keywords you might want to improve  

All analysis happens locally using **Python NLP tools** like TF-IDF and keyword extraction. No paid services, no cloud APIs — it’s all yours to run. 💻

---

## 🛠️ How I Built It

- **Frontend:** HTML, CSS, JavaScript  
- **Backend:** Flask (Python)  
- **Python Libraries:** PyPDF2, python-docx, scikit-learn, nltk  

---

## 🚀 How to Try It

1. **Clone the repo**  

git clone https://github.com/your-username/resume-analyzer.git

cd resume-analyzer
2. **Install dependencies**

pip install flask PyPDF2 python-docx scikit-learn nltk

3. **Run the backend**

python app.py

4. **Open index.html in your browser, upload your files, and click Analyze**

It’s that simple! 🎉

🔮 Next Steps (I’ll Improve This Later)
a.Make the AI smarter with embeddings or language models

b.Add PDF export of analysis results

c.Improve the frontend design and UX

d.Optionally, add user login to save past analyses

🤝 Contribute / Feedback
If you try it and find bugs, or have ideas to make it better, I’d love to hear from you! Fork it, suggest changes, or just send me a message.

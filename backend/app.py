from flask import Flask, request, jsonify
from PyPDF2 import PdfReader
import docx
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import re

app = Flask(__name__)

def read_file(file):
    filename = file.filename.lower()
    if filename.endswith(".txt"):
        return file.read().decode("utf-8")
    elif filename.endswith(".pdf"):
        reader = PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text() or ""
        return text
    elif filename.endswith(".docx"):
        doc = docx.Document(file)
        return "\n".join([p.text for p in doc.paragraphs])
    else:
        return ""

def extract_keywords(text):
    # simple: take all words longer than 3 letters, lowercase, remove duplicates
    words = re.findall(r'\b\w{4,}\b', text.lower())
    return set(words)

def analyze_text(resume_text, jd_text):
    # Matching Score
    vectorizer = TfidfVectorizer().fit([resume_text, jd_text])
    vectors = vectorizer.transform([resume_text, jd_text])
    score = cosine_similarity(vectors[0], vectors[1])[0][0] * 100

    # Keywords
    resume_keywords = extract_keywords(resume_text)
    jd_keywords = extract_keywords(jd_text)

    strengths = list(resume_keywords & jd_keywords)
    weaknesses = list(jd_keywords - resume_keywords)

    summary = f"Your resume matches {len(strengths)} keywords from the job description."

    return {
        "matchingScore": round(score, 2),
        "summary": summary,
        "strengths": strengths[:10],  # show top 10
        "weaknesses": weaknesses[:10] # show top 10
    }

@app.route("/analyze", methods=["POST"])
def analyze():
    resume_file = request.files.get("resume")
    jd_file = request.files.get("jd")
    
    if not resume_file or not jd_file:
        return jsonify({"error": "Both resume and JD files are required"}), 400

    resume_text = read_file(resume_file)
    jd_text = read_file(jd_file)

    result = analyze_text(resume_text, jd_text)
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)

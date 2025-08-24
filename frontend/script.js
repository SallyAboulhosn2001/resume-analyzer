document.addEventListener("DOMContentLoaded", () => {
    const analyzeButton = document.getElementById("analyze-button");
    const resumeInput = document.getElementById("resume-input");
    const jdInput = document.getElementById("job-description-input");
    const feedbackOutput = document.getElementById("feedback-output");
    const loadingIndicator = document.getElementById("loading-indicator");
    const fileUploadResume = document.getElementById("file-upload-resume");
    const fileUploadJD = document.getElementById("file-upload-jd");
    const uploadResumeButton = document.getElementById("upload-resume");
    const uploadJDButton = document.getElementById("upload-jd");
    const modal = document.getElementById("custom-alert");
    const modalMessage = document.getElementById("alert-message");
    const closeButton = document.querySelector(".close-button");

    closeButton.addEventListener("click", () => modal.classList.add("hidden"));

    function showAlert(message) {
        modalMessage.textContent = message;
        modal.classList.remove("hidden");
    }

    // Function to handle the file upload logic
    const handleFileUpload = (fileInput, targetTextarea) => {
        fileInput.addEventListener("change", async (e) => {
            const file = e.target.files[0];
            if (file) {
                // Display the file name to the user, not the content.
                // The actual content will be sent on analysis.
                showAlert(`File "${file.name}" selected. Click 'Analyze' to proceed.`);
                targetTextarea.value = `File selected: ${file.name}`;
            } else {
                targetTextarea.value = '';
            }
        });
    };

    // Connect the buttons to the hidden file inputs
    uploadResumeButton.addEventListener("click", () => {
        fileUploadResume.click();
    });

    uploadJDButton.addEventListener("click", () => {
        fileUploadJD.click();
    });

    // Attach event handlers to the file inputs
    handleFileUpload(fileUploadResume, resumeInput);
    handleFileUpload(fileUploadJD, jdInput);

    // Analyze Button logic
    analyzeButton.addEventListener("click", async () => {
        const resumeFile = fileUploadResume.files[0];
        const jdFile = fileUploadJD.files[0];

        // Check if files or text are provided
        if (!resumeFile && !jdFile) {
            showAlert("Please select files or paste text in the boxes.");
            return;
        }

        // Check for only one file type selected
        if ((resumeFile && jdInput.value.trim() === "File selected: undefined") || (jdFile && resumeInput.value.trim() === "File selected: undefined")) {
            showAlert("Please provide both resume and job description.");
            return;
        }

        loadingIndicator.style.display = "block";
        feedbackOutput.innerHTML = "";

        // Use FormData to send both files
        const formData = new FormData();

        // Append files if they exist, otherwise append text from textarea
        if (resumeFile) {
            formData.append("resume", resumeFile);
        } else {
            const blob = new Blob([resumeInput.value.trim()], { type: 'text/plain' });
            formData.append("resume", blob, "resume.txt");
        }

        if (jdFile) {
            formData.append("jd", jdFile);
        } else {
            const blob = new Blob([jdInput.value.trim()], { type: 'text/plain' });
            formData.append("jd", blob, "jd.txt");
        }

        try {
            const response = await fetch("http://127.0.0.1:8000/analyze", {
                method: "POST",
                body: formData // The browser will set the correct Content-Type header
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || response.statusText);
            }

            const data = await response.json();
            feedbackOutput.innerHTML = `
                <p><strong>Matching Score:</strong> ${data.matchingScore}%</p>
                <p><strong>Summary:</strong> ${data.summary}</p>
                <p><strong>Strengths:</strong> ${data.strengths.join(", ")}</p>
                <p><strong>Weaknesses:</strong> ${data.weaknesses.join(", ")}</p>
            `;
        } catch (error) {
            showAlert("Error: " + error.message);
        } finally {
            loadingIndicator.style.display = "none";
        }
    });
});

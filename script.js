let timeLeft = 60 * 60; // 60 minutes in seconds
const timerElement = document.getElementById("timer");
const quizContainer = document.getElementById("quizContainer");
const resultContainer = document.getElementById("resultContainer");
const resultText = document.getElementById("resultText");
const retryButton = document.getElementById("retryButton");
const studentForm = document.getElementById("studentForm");
const studentFormContainer = document.getElementById("studentFormContainer");
const studentDetails = document.getElementById("studentDetails");

// Handle Student Form Submission
studentForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const studentName = document.getElementById("studentName").value;
  const studentEmail = document.getElementById("studentEmail").value;

  localStorage.setItem("studentName", studentName);
  localStorage.setItem("studentEmail", studentEmail);

  studentFormContainer.style.display = "none";
  quizContainer.style.display = "block";
  document.getElementById("questionNavigator").style.display = "block";
  updateTimer();
});

// Timer Function
function updateTimer() {
  if (timeLeft <= 0 || quizContainer.style.display === "none") return;
  let minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  timerElement.textContent = `Time Left: ${minutes}:${
    seconds < 10 ? "0" : ""
  }${seconds}`;

  if (timeLeft > 0) {
    timeLeft--;
    setTimeout(updateTimer, 1000);
  } else {
    alert("Time's up! Submitting your quiz.");
    submitQuiz();
  }
}

// Submit Quiz Function
document.getElementById("submit").addEventListener("click", function () {
  submitQuiz();
});

function submitQuiz() {
  let score = 0;
  let answers = {
    q1: "A",
    q2: "C",
    q3: "C",
    q4: "B",
    q5: "C",
    q6: "C",
    q7: "B",
    q8: "A",
    q9: "B",
    q10: "D",
    q11: "B",
    q12: "B",
    q13: "B",
    q14: "A",
    q15: "C",
    q16: "B",
    q17: "C",
    q18: "C",
    q19: "B",
    q20: "A",
    q21: "B",
    q22: "B",
    q23: "B",
    q24: "A",
    q25: "C",
    q26: "B",
    q27: "C",
    q28: "C",
    q29: "A",
    q30: "C",
    q31: "B",
    q32: "A",
    q33: "C",
    q34: "B",
    q35: "B",
    q36: "B",
    q37: "C",
    q38: "B",
    q39: "C",
    q40: "B",
    q41: "C",
    q42: "C",
    q43: "B",
  };
  let total = Object.keys(answers).length;

  for (let key in answers) {
    let selected = document.querySelector(`input[name="${key}"]:checked`);
    if (selected && selected.value === answers[key]) {
      score++;
    }
  }

  const storedName = localStorage.getItem("studentName");
  const storedEmail = localStorage.getItem("studentEmail");
  studentDetails.innerHTML = `<strong>Name:</strong> ${storedName} <br> <strong>Email:</strong> ${storedEmail}`;

  quizContainer.style.display = "none";
  document.getElementById("questionNavigator").style.display = "none";
  resultContainer.style.display = "block";
  resultText.textContent = `Your score: ${score}/${total}`;

  // Send result via email to backend
  sendResultEmail(storedName, storedEmail, score, total);
}

function sendResultEmail(name, email, score, total) {
  fetch("http://localhost:3000/send-result", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: name,
      email: email,
      score: score,
      total: total,
    }),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Email sending failed");
      return response.json();
    })
    .then((data) => console.log("Email sent:", data))
    .catch((error) => console.error("Error sending email:", error));
}

retryButton.addEventListener("click", function () {
  location.reload();
});

// Navigator setup
window.addEventListener("DOMContentLoaded", () => {
  const navigator = document.getElementById("questionNavigator");
  const navButtons = document.getElementById("navButtons");
  const questions = document.querySelectorAll(".question");
  const navBtnRefs = [];

  if (questions.length > 0) {
    questions.forEach((q, i) => {
      const btn = document.createElement("button");
      btn.textContent = i + 1;
      btn.setAttribute("data-index", i);
      btn.onclick = () =>
        q.scrollIntoView({ behavior: "smooth", block: "center" });
      navButtons.appendChild(btn);
      navBtnRefs.push(btn);
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const index = Array.from(questions).indexOf(entry.target);
          if (entry.isIntersecting && index !== -1) {
            navBtnRefs.forEach((btn, idx) => {
              const isAnswered = questions[idx].querySelector("input:checked");
              btn.classList.remove("active", "answered");
              if (isAnswered) btn.classList.add("answered");
            });
            navBtnRefs[index].classList.add("active");
          }
        });
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.5,
      }
    );

    questions.forEach((q) => observer.observe(q));
  }
});

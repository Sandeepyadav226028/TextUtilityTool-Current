const themeToggle = document.getElementById("themeToggle");
const body = document.body;
const API_BASE_URL = window.API_BASE_URL || "http://localhost:3000";
const authStorage = window.sessionStorage;

const savedTheme = localStorage.getItem("theme") || "light";
body.setAttribute("data-theme", savedTheme);

themeToggle.addEventListener("click", () => {
  const currentTheme = body.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";

  body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
});

const textTransformations = {
  uppercase: (text) => text.toUpperCase(),
  lowercase: (text) => text.toLowerCase(),
  titleCase: (text) =>
    text.replace(/\w\S*/g, (txt) => txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()),
  sentenceCase: (text) =>
    text.toLowerCase().replace(/(^\w|\.\s*\w)/g, (match) => match.toUpperCase()),
  removeExtraSpace: (text) => text.replace(/\s+/g, " ").trim(),
  reverseText: (text) => text.split("").reverse().join(""),
  clearText: () => "",
  toggleCase: (text) =>
    text
      .split("")
      .map((char) => (char === char.toUpperCase() ? char.toLowerCase() : char.toUpperCase()))
      .join(""),
  vowelCount: (text) => {
    const count = (text.match(/[aeiou]/gi) || []).length;
    alert(`Vowel count: ${count}`);
    return text;
  },
  consonantCount: (text) => {
    const count = (text.match(/[bcdfghjklmnpqrstvwxyz]/gi) || []).length;
    alert(`Consonant count: ${count}`);
    return text;
  },
  isPalindrome: (text) => {
    const normalized = text.replace(/[^a-z0-9]/gi, "").toLowerCase();
    const isPalindrome = normalized === normalized.split("").reverse().join("");
    alert(isPalindrome ? "It is a palindrome!" : "Not a palindrome.");
    return text;
  },
  base64Encode: (text) => btoa(text),
  base64Decode: (text) => {
    try {
      return atob(text);
    } catch {
      alert("Invalid Base64!");
      return text;
    }
  },
};

const textInput = document.getElementById("textInput");
const textPreview = document.getElementById("textPreview");
const wordCount = document.getElementById("wordCount");
const charCount = document.getElementById("charCount");
const readTime = document.getElementById("readTime");
const copyBtn = document.getElementById("copyBtn");

function analyzeText(text) {
  const words = text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
  const characters = text.length;
  const readingTime = Math.ceil(words / 200);

  return { words, characters, readingTime };
}

function downloadText() {
  const text = textInput.value;
  if (!text.trim()) return;

  const blob = new Blob([text], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "TextUtilityOutput.txt";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function updatePreview(text) {
  if (text.trim() === "") {
    textPreview.innerHTML = '<p class="preview-placeholder">Nothing to preview</p>';
  } else {
    textPreview.textContent = text;
  }
}

function updateCopyButton(text) {
  copyBtn.disabled = text.trim() === "";
}

function runTextAnalysis() {
  const text = textInput.value;
  const analysis = analyzeText(text);

  wordCount.textContent = `${analysis.words} Words`;
  charCount.textContent = `${analysis.characters} Characters`;
  readTime.textContent = `${analysis.readingTime} mins`;

  updatePreview(text);
  updateCopyButton(text);
}

function transformText(transformation) {
  const currentText = textInput.value;
  const transformedText =
    transformation === "clearText"
      ? textTransformations[transformation]()
      : textTransformations[transformation](currentText);

  textInput.value = transformedText;
  updateTextAnalysis();

  textInput.style.transform = "scale(1.01)";
  setTimeout(() => {
    textInput.style.transform = "scale(1)";
  }, 150);

  const token = authStorage.getItem("token");

  if (transformation !== "clearText" && token && transformedText.trim()) {
    fetch(`${API_BASE_URL}/api/history`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ content: transformedText }),
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to save history");
        }
        return res.json();
      })
      .catch(() => {});
  }
}

async function copyToClipboard() {
  const text = textInput.value;
  if (text.trim() === "") return;

  try {
    await navigator.clipboard.writeText(text);
    copyBtn.classList.add("copied");
    setTimeout(() => {
      copyBtn.classList.remove("copied");
    }, 2000);
  } catch {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    try {
      document.execCommand("copy");
      copyBtn.classList.add("copied");
      setTimeout(() => {
        copyBtn.classList.remove("copied");
      }, 2000);
    } catch {}
    document.body.removeChild(textArea);
  }
}

let analysisTimeout;
function updateTextAnalysis() {
  clearTimeout(analysisTimeout);
  analysisTimeout = setTimeout(runTextAnalysis, 100);
}

textInput.addEventListener("input", updateTextAnalysis);
textInput.addEventListener("paste", () => setTimeout(updateTextAnalysis, 10));

document.addEventListener("keydown", (e) => {
  if ((e.ctrlKey || e.metaKey) && e.key === "u") {
    e.preventDefault();
    transformText("uppercase");
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "l") {
    e.preventDefault();
    transformText("lowercase");
  }
  if ((e.ctrlKey || e.metaKey) && e.key === "t") {
    e.preventDefault();
    transformText("titleCase");
  }
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === "C") {
    e.preventDefault();
    copyToClipboard();
  }
});

document.documentElement.style.scrollBehavior = "smooth";
document.querySelectorAll(".btn").forEach((button) => {
  button.addEventListener("click", function () {
    this.style.transform = "scale(0.95)";
    setTimeout(() => {
      this.style.transform = "";
    }, 100);
  });
});

textInput.addEventListener("focus", () => {
  textInput.style.boxShadow = "0 0 0 3px rgb(59 130 246 / 0.1)";
});

textInput.addEventListener("blur", () => {
  textInput.style.boxShadow = "";
});

runTextAnalysis();

const uploadForm = document.querySelector("#uploadForm");
const fileInput = document.querySelector("#fileInput");
const fileNameLable = document.querySelector("#fileName");
const uploadResult = document.querySelector("#uploadResult");
const generatedCodeSpan = document.querySelector("#generatedCode");
const copyBtn = document.querySelector("#copyBtn");

const downloadForm = document.querySelector("#downloadForm");
const codeInput = document.querySelector("#codeInput");
const downloadError = document.querySelector("#downloadError");

fileInput.addEventListener("change", (e) => {
  if (e.target.files.length > 0) {
    fileNameLable.textContent = e.target.files[0].name;
  } else {
    fileNameLable.textContent = "Виберіть файл";
  }
});

uploadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  formData.append("file", fileInput.files[0]);

  try {
    const response = await fetch("/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload error");
    }

    const data = await response.json();

    generatedCodeSpan.textContent = data.code;
    uploadResult.classList.remove("hidden");

    uploadForm.reset();
    fileNameLable.textContent = "Виберіть файл";
  } catch (err) {
    console.error(`Upload error: ${err.message}`);
    console.error(err);
  }
});

copyBtn.addEventListener("click", () => {
  const code = generatedCodeSpan.textContent;
  navigator.clipboard.writeText(code).then(() => {
    alert("Код скопійовано");
  });
});

downloadForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const code = codeInput.value.trim();
  downloadError.classList.add("hidden");

  if (!code) return;

  try {
    const response = await fetch(`/download/${code}`);

    if (response.status === 404) {
      downloadError.textContent = "Файл не знайдено";
      downloadError.classList.remove("hidden");
      return;
    }

    if (!response.ok) {
      throw new Error("Download error");
    }

    const blob = await response.blob();

    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;

    a.download = `file-${code}`;

    document.body.appendChild(a);

    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (err) {
    console.error(err);
    downloadError.textContent = "Сталась помилки серверу";
    downloadError.classList.remove("hidden");
  }
});

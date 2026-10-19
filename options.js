// オプション画面: 隠すタブ名の一覧を chrome.storage.sync に保存する

const textarea = document.getElementById("names");
const status = document.getElementById("status");

chrome.storage.sync.get({ names: ["MLB"] }, ({ names }) => {
  textarea.value = names.join("\n");
});

document.getElementById("save").addEventListener("click", () => {
  const names = textarea.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  chrome.storage.sync.set({ names }, () => {
    status.textContent = "保存しました";
    setTimeout(() => (status.textContent = ""), 1500);
  });
});

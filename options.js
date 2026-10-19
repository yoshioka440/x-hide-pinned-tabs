// オプション画面: 隠すタブ名の一覧を chrome.storage.sync に保存する

const textarea = document.getElementById("names");
const status = document.getElementById("status");
let statusTimer;

// DEFAULT_NAMES は defaults.js で定義（options.html で先に読み込む）
chrome.storage.sync.get({ names: DEFAULT_NAMES }, ({ names }) => {
  textarea.value = names.join("\n");
});

document.getElementById("save").addEventListener("click", () => {
  const names = textarea.value
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
  chrome.storage.sync.set({ names }, () => {
    clearTimeout(statusTimer);
    const error = chrome.runtime.lastError;
    status.style.color = error ? "#b3261e" : "";
    if (error) {
      status.textContent = "保存できませんでした。入力を短くするか、しばらく待ってから再試行してください。";
      return;
    }
    status.textContent = "保存しました";
    statusTimer = setTimeout(() => (status.textContent = ""), 1500);
  });
});

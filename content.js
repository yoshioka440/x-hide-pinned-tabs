// X のホーム上部のタブ列から、指定した名前のタブを隠す

const DEFAULT_NAMES = ["MLB"];
const HIDDEN_MARK = "xhptHidden";

let hiddenNames = DEFAULT_NAMES.map(normalize);

function normalize(s) {
  return s.trim().toLowerCase();
}

// タブ列を走査して、一致するタブを隠す（設定変更で外れたタブは戻す）
function applyHide() {
  const tabs = document.querySelectorAll('[role="tablist"] [role="tab"]');
  let hiddenSelected = false;
  let firstVisible = null;

  for (const tab of tabs) {
    // タブ本体ではなく外側の枠ごと隠さないと、隙間が残る
    const box = tab.closest('[role="presentation"]') || tab;
    const shouldHide = hiddenNames.includes(normalize(tab.textContent || ""));

    if (shouldHide) {
      box.style.display = "none";
      box.dataset[HIDDEN_MARK] = "1";
      if (tab.getAttribute("aria-selected") === "true") hiddenSelected = true;
    } else {
      if (box.dataset[HIDDEN_MARK]) {
        box.style.display = "";
        delete box.dataset[HIDDEN_MARK];
      }
      if (!firstVisible) firstVisible = tab;
    }
  }

  // 隠したタブが選ばれたまま開いた場合は、残っている先頭のタブへ切り替える
  if (hiddenSelected && firstVisible) firstVisible.click();
}

// 隠すのはホームのタブ列だけ。プロフィールや検索のタブには触らない
// （file: はモック test/mock.html での確認用）
function isHome() {
  return location.pathname === "/home" || location.protocol === "file:";
}

// X は画面を差し替え続けるので、DOM の変化のたびに（1フレームにまとめて）かけ直す
// X はページ遷移でも再読み込みしないので、パスは変化のたびに見る
let scheduled = false;
function scheduleApply() {
  if (scheduled || !isHome()) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    applyHide();
  });
}

// 監視と初回の処理を始める。設定を読み終える前に動くと、初期値で隠して
// 選択タブまで切り替えてしまうので、必ず設定が決まってから呼ぶ
function start() {
  new MutationObserver(scheduleApply).observe(document.documentElement, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ["aria-selected"],
  });
  scheduleApply();
}

// 設定を読み込んでから始める。chrome.storage がない環境（モックでの確認）では初期値ですぐ始める
const storage = globalThis.chrome?.storage?.sync;
if (storage) {
  storage.get({ names: DEFAULT_NAMES }, ({ names }) => {
    hiddenNames = names.map(normalize).filter(Boolean);
    start();
  });
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "sync" && changes.names) {
      hiddenNames = (changes.names.newValue || []).map(normalize).filter(Boolean);
      scheduleApply();
    }
  });
} else {
  start();
}

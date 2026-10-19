# x-hide-pinned-tabs

X のホームに固定される、スポーツなどのタブ（例: MLB）を隠す Chrome 拡張（Manifest V3、ビルド不要の素の JS）。

## 実行

`chrome://extensions` → デベロッパー モード → 「パッケージ化されていない拡張機能を読み込む」でこのフォルダを選ぶ。
コードを変えたら拡張機能の再読み込みボタンを押し、x.com をリロードする。

## 確認

- `node --check content.js` で構文エラーがないこと
- `test/mock.html` をブラウザで開き、「MLB」タブが消えて「おすすめ」が選択されること（chrome.storage がない環境では初期値 `MLB` で動く）
- 実機: x.com/home で MLB タブが出ないこと、他のタブ（フォロー中・リスト）は残ること。プロフィールや検索のタブは変わらないこと

## 注意

- X の DOM（`role="tablist"` / `role="tab"`）が変わると効かなくなる。直すときはまず実際の x.com の DOM を確認する
- タブ名の一致は前後の空白を除き、大文字小文字を無視した完全一致
- 動くのは `location.pathname === "/home"` のときだけ（`isHome()`）。モックは file: で開くので例外扱いにしている

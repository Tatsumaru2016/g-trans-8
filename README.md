# G.trans Universe (`g-trans-8`)

ライトテーマの **Three.js WebGL** スクロール体験。7シーンの宇宙通信ネットワークと Sandbox 翻訳ルーター。

## 技術スタック

- React 19 + Vite 6 + Tailwind CSS v4
- Three.js `NetworkUniverse`（カスタム WebGL エンジン）
- Motion（HUD アニメーション）

## ローカル開発

```bash
npm install
npm run dev
```

→ http://localhost:3024

## 操作

| 操作 | 動作 |
|------|------|
| スクロール | 7シーン連続遷移 + カメラ振付け |
| 左ナビ / ドット | シーン直接ジャンプ |
| Universal Core Sandbox | 言語ペア + テキストで3Dルート可視化 |
| 音量ボタン | UI シンセフィードバック ON/OFF |

## デプロイ

GitHub Pages: `.github/workflows/pages.yml`（`gh-pages` ブランチ方式）

```bash
git init
git add .
git commit -m "Initial g-trans-8 setup"
git remote add origin https://github.com/Tatsumaru2016/g-trans-8.git
git branch -M main
git push -u origin main
```

Settings → Pages → **Deploy from branch** → `gh-pages` / root

公開 URL: https://tatsumaru2016.github.io/g-trans-8/

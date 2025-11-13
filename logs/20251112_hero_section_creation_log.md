# ヒーローセクション作成ログ

**日時**: 2025年11月12日
**プロジェクト**: コエレク LP
**セクション**: ヒーローセクション

---

## 📋 作業概要

救急外来向け音声入力カルテ「コエレク」のランディングページのヒーローセクションを作成。
マーケティング戦略に基づいた視覚的訴求と、ユーザー体験を重視したアニメーション実装。

---

## 🎯 目標

1. **視覚的インパクト**: 3秒で「時間を取り戻す」メッセージを伝える
2. **ターゲット共感**: 30-40代救急医（男女）が「私のこと」と感じる
3. **視線誘導**: タイトル → コエレクロゴへの自然な流れ
4. **プロフェッショナル感**: 医療SaaSとしての信頼性

---

## 🎨 ヒーロー画像の制作

### 1. 画像コンセプト設計

**戦略**: Before/After のストーリーテリング

```yaml
構成:
  左側（Before - 暗め）:
    - 忙しい救急外来の背景
    - 緊迫感のある雰囲気
    - 青グレーの寒色調

  右側（After - 明るめ）:
    - 女性医師がiPhoneで音声入力
    - リラックスした表情
    - 白・明るい青の暖色調

  視覚効果:
    - 斜め分割で動きを演出
    - Before→Afterの自然な視線誘導
```

### 2. 人物設定（マーケティング戦略）

**選択**: 女性医師

```yaml
戦略的理由:
  ✓ 医療広告は男性医師が多い → 女性で差別化
  ✓ "誰でもできる"の証明（技術的ハードルの低さ）
  ✓ 男性医師も排除しない（「女性でもできるなら俺も」）
  ✓ 救急医の女性比率上昇中（共感層拡大）

ポーズ:
  - スマホを見ている（話しかけている）
  - 自然な笑顔
  - リラックスした姿勢
  - 「使っている瞬間」のリアリティ
```

### 3. AI生成（Midjourney）

**プロンプト戦略**:
- 背景と人物を別々に生成（ガチャ失敗リスク削減）
- ER（救急外来）の特徴を明確化
  - ストレッチャー
  - カーテン仕切り
  - スクラブ着用スタッフ

---

## 💻 技術実装

### Phase 1: 基本構造の構築

#### HTML構造
```html
<section id="hero" class="hero-section">
  <!-- ヒーロー画像 -->
  <img src="images/hero_-title.png" class="hero-image">

  <!-- タイトルテキスト -->
  <div class="hero-text-overlay">
    <img src="images/title.png" alt="あなたの時間を、取り戻す">
  </div>

  <!-- コエレクロゴ -->
  <div class="hero-logo-overlay">
    <img src="images/koereq.png" alt="コエレク">
  </div>

  <!-- スクロール誘導 -->
  <div class="scroll-indicator">↓</div>
</section>

<!-- フローティングCTAボタン -->
<div class="hero-cta-wrapper">
  <a href="#contact-form">今すぐあなたの時間を取り戻す</a>
</div>
```

#### CSS基本設定
```css
.hero-section {
  position: relative;
  max-width: 1400px; /* PC用最大幅 */
  padding: 0 32px;
  margin: 80px auto 0;
}

.hero-image {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
}
```

### Phase 2: テキストアニメーション実装

#### タイトル「あなたの時間を、取り戻す」

**配置**: 中央揃え・上部8%

```css
.hero-text-overlay {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.hero-text-main {
  max-width: 91.96%;
  opacity: 0; /* 初期非表示 */
  animation: fadeInUp 1s ease-out 0.2s forwards;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(-20px);
  }
}
```

**調整プロセス**:
1. サイズ調整: 80% → 88% → 96.8% → 91.96%（5%縮小）
2. 終点調整: 0px → -8px → -12px → -48px → -20px
3. アニメーション: 下から浮かび上がり、-20pxで停止

#### コエレクロゴ

**配置**: 左揃え・画像中央（42%）

```css
.hero-logo-overlay {
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  justify-content: flex-start;
  padding-left: 4.5%;
}

.hero-logo {
  max-width: 52.5%;
  opacity: 0;
  animation: fadeInUpLogo 1s ease-out 0.6s forwards;
}

@keyframes fadeInUpLogo {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(-4px);
  }
}
```

**調整プロセス**:
1. 遅延調整: 1.2秒 → 0.6秒（一般的UIタイミング）
2. サイズ調整: 60% → 48% → 60% → 78% → 70.2% → 50% → 52.5%
3. 位置調整: 中央 → 左揃え（タイトルと同じ頭位置）
4. 終点調整: -20px → -4px（16px下げ）

### Phase 3: ヒーロー画像アニメーション

**ズームイン効果**: 拡大状態から落ち着く

```css
.hero-image {
  animation: zoomIn 1.2s ease-out forwards;
}

@keyframes zoomIn {
  from {
    transform: scale(1.1);
    opacity: 0.8;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
```

### Phase 4: フローティングCTAボタン

**仕様**: 画面下部固定、全ページ共通

```css
.hero-cta-wrapper {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

/* スマホ対応 */
@media (max-width: 768px) {
  .hero-cta-wrapper {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
  }
}
```

**調整**:
- 余分な枠（白背景、padding、影）を削除
- ボタンのみを表示

### Phase 5: レスポンシブ対応

```css
/* PC */
.hero-section {
  max-width: 1400px;
  padding: 0 32px;
}

.hero-image {
  border-radius: 16px;
}

/* スマホ */
@media (max-width: 768px) {
  .hero-section {
    padding: 0 16px;
  }

  .hero-image {
    border-radius: 12px;
  }

  .hero-text-overlay {
    top: 6%;
  }

  .hero-text-main {
    max-width: 90%;
  }
}
```

---

## 🎬 アニメーションタイムライン

```yaml
0.0秒: ページ読み込み
  - ヒーロー画像: ズームイン開始（1.1倍 → 1倍）

0.2秒: タイトル表示開始
  - "あなたの時間を、取り戻す"
  - 下から浮かび上がり（50px → -20px）

0.6秒: コエレクロゴ表示開始
  - 下から浮かび上がり（50px → -4px）
  - タイトルと同じ左端位置

1.2秒: 全アニメーション完了
  - 全要素が定位置に固定
  - ユーザーは次のアクション可能
```

**設計意図**:
- 0.2秒: タイトルが即座に表示（離脱防止）
- 0.6秒: 自然な視線誘導（タイトル→ロゴ）
- 1.2秒: テンポ良く完了（待たされない）

---

## 🎨 ビジュアルデザイン詳細

### 配色戦略

```yaml
ブランドカラー:
  - Wonder Blue: #2563EB
  - Healing Green: #34C759

ヒーロー画像:
  Before側:
    - 青グレー（#0F172A～#1E3A8A）
    - 寒色系で緊迫感

  After側:
    - 白・明るい青（#FFFFFF～#3B82F6）
    - 暖色系で安心感

テキスト:
  - ドロップシャドウ: 0 4px 12px rgba(0,0,0,0.3)
  - 視認性確保
```

### タイポグラフィ

```yaml
タイトル:
  - サイズ: 可変（画面幅の91.96%）
  - フォント: Noto Sans JP（予想）
  - 太さ: 極太（視認性重視）

コエレクロゴ:
  - サイズ: 可変（画面幅の52.5%）
  - ブランドカラー（青）使用
```

---

## 📊 マーケティング効果測定

### 心理的訴求フロー

```yaml
3秒での訴求:
  1. 画像表示（0秒）
     → 共感: "あ、これ私の現場だ"

  2. タイトル表示（0.2秒）
     → 希望: "時間を取り戻せる？"

  3. コエレク表示（0.6秒）
     → 認識: "このサービスで解決できる"

  4. 行動（1.2秒～）
     → CTA: "今すぐ試したい"
```

### ターゲット適合性

```yaml
30-40代救急医:
  ✓ 女性医師で親近感
  ✓ 実際の使用シーンでリアリティ
  ✓ Before/Afterで課題と解決を明確化
  ✓ "誰でもできる"感を演出

視覚的訴求:
  ✓ 3秒で全メッセージ理解可能
  ✓ スムーズなアニメーションで離脱防止
  ✓ プロフェッショナルな品質
```

---

## 🔧 技術的課題と解決

### 課題1: 画像の横幅切れ

**問題**: 初期実装で画像が画面からはみ出す

**解決**:
```css
.hero-section {
  width: 100%;
  max-width: 1400px;
  overflow: hidden;
}
```

### 課題2: アニメーションが戻る

**問題**: アニメーション終了後、元の位置に戻ってしまう

**解決**:
```css
animation: fadeInUp 1s ease-out 0.2s forwards;
/* forwards を追加 */
```

### 課題3: テキストが最初から表示

**問題**: アニメーション前に要素が見えてしまう

**解決**:
```css
.hero-text-main,
.hero-logo {
  opacity: 0; /* 初期非表示 */
}
```

### 課題4: アニメーション開始位置のズレ

**問題**: 中央揃えのアニメーションが右から開始

**解決**:
```css
@keyframes fadeInUp {
  from {
    transform: translateY(50px); /* X軸は触らない */
  }
  to {
    transform: translateY(-20px);
  }
}
```

---

## 📁 ファイル構成

```
lp_koereq/
├── index.html                    # ヒーローセクションHTML
├── css/
│   └── style.css                 # ヒーローセクションCSS
├── images/
│   ├── hero_-title.png           # ヒーロー背景画像
│   ├── title.png                 # タイトルテキスト画像
│   ├── koereq.png                # コエレクロゴ画像
│   └── logo_blue_black.png       # ヘッダーロゴ
└── logs/
    └── 20251112_hero_section_creation_log.md  # このログ
```

---

## 🎯 最終仕様

### HTML構造

```html
<section id="hero" class="hero-section">
  <img src="images/hero_-title.png" class="hero-image">

  <div class="hero-text-overlay">
    <img src="images/title.png" class="hero-text-main">
  </div>

  <div class="hero-logo-overlay">
    <img src="images/koereq.png" class="hero-logo">
  </div>

  <div class="scroll-indicator">
    <span>↓</span>
  </div>
</section>

<div class="hero-cta-wrapper">
  <a href="#contact-form" class="cta-button-primary gradient large">
    <span class="cta-main">今すぐあなたの時間を取り戻す</span>
    <span class="cta-sub">お問い合わせ</span>
  </a>
</div>
```

### CSS主要スタイル

```css
/* ヒーローセクション */
.hero-section {
  position: relative;
  max-width: 1400px;
  padding: 0 32px;
  margin: 80px auto 0;
}

/* ヒーロー画像 */
.hero-image {
  width: 100%;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  animation: zoomIn 1.2s ease-out forwards;
}

/* タイトル */
.hero-text-overlay {
  position: absolute;
  top: 8%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
}

.hero-text-main {
  max-width: 91.96%;
  opacity: 0;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  animation: fadeInUp 1s ease-out 0.2s forwards;
}

/* コエレクロゴ */
.hero-logo-overlay {
  position: absolute;
  top: 42%;
  left: 50%;
  transform: translateX(-50%);
  z-index: 20;
  width: 100%;
  display: flex;
  justify-content: flex-start;
  padding-left: 4.5%;
}

.hero-logo {
  max-width: 52.5%;
  opacity: 0;
  filter: drop-shadow(0 4px 12px rgba(0, 0, 0, 0.3));
  animation: fadeInUpLogo 1s ease-out 0.6s forwards;
}

/* フローティングCTA */
.hero-cta-wrapper {
  position: fixed;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 1000;
}

/* アニメーション */
@keyframes zoomIn {
  from { transform: scale(1.1); opacity: 0.8; }
  to { transform: scale(1); opacity: 1; }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(-20px); }
}

@keyframes fadeInUpLogo {
  from { opacity: 0; transform: translateY(50px); }
  to { opacity: 1; transform: translateY(-4px); }
}

/* レスポンシブ */
@media (max-width: 768px) {
  .hero-section { padding: 0 16px; }
  .hero-image { border-radius: 12px; }
  .hero-text-overlay { top: 6%; }
  .hero-text-main { max-width: 90%; }
  .hero-cta-wrapper {
    bottom: 16px;
    left: 16px;
    right: 16px;
    transform: none;
  }
}
```

---

## ✅ 完成チェックリスト

### デザイン
- [x] Before/Afterのストーリーテリング
- [x] 女性医師で差別化・親近感
- [x] 中央揃え・洗練されたレイアウト
- [x] プロフェッショナルな品質

### アニメーション
- [x] ヒーロー画像のズームイン
- [x] タイトルの浮かび上がり（0.2秒開始）
- [x] コエレクロゴの浮かび上がり（0.6秒開始）
- [x] 1.2秒で全完了

### レスポンシブ
- [x] PC: 最大幅1400px、左右余白
- [x] スマホ: 左右16px余白、角丸調整
- [x] フローティングCTA: PC中央/スマホ全幅

### UX
- [x] 3秒で全メッセージ理解可能
- [x] 自然な視線誘導（タイトル→ロゴ）
- [x] CTAボタンが常に表示
- [x] スクロール誘導あり

---

## 🚀 今後の改善案

### A/Bテスト候補

```yaml
パターンA（現行）:
  - 女性医師
  - 斜め分割Before/After

パターンB:
  - 男性医師
  - 同じレイアウト

測定指標:
  - CTAクリック率
  - ページ滞在時間
  - スクロール深度
```

### パフォーマンス最適化

```yaml
画像最適化:
  - WebP形式への変換
  - 遅延読み込み（Lazy Loading）
  - サイズ最適化（300KB以下目標）

アニメーション:
  - GPU加速の活用
  - will-change プロパティ検討
```

### アクセシビリティ

```yaml
改善案:
  - アニメーション無効設定対応
    @media (prefers-reduced-motion: reduce)
  - alt属性の詳細化
  - キーボードナビゲーション確認
```

---

## 📝 学び・気づき

### マーケティング視点

1. **ターゲット設定の重要性**
   - 女性医師の選択が効果的だった理由
   - "誰でもできる"の視覚的証明

2. **アニメーションタイミング**
   - 0.6秒が一般的（1.2秒は長すぎ）
   - 自然な視線誘導のための遅延設計

3. **Before/Afterの力**
   - 課題と解決を1画面で表現
   - 感情的インパクトが大きい

### 技術面

1. **アニメーションの制御**
   - `forwards`で終了状態維持
   - `opacity: 0`で初期非表示
   - `transform`の扱いに注意

2. **レスポンシブ設計**
   - max-widthで最大幅制限
   - padding/marginの使い分け
   - メディアクエリの適切な設定

3. **パフォーマンス**
   - 画像最適化の重要性
   - アニメーションのGPU加速

---

## 🎓 参考資料

### マーケティング理論
- ストーリーテリング手法
- Before/After マーケティング
- 視線誘導の心理学

### デザイン参考
- 医療系SaaSのLP事例
- Apple の製品ページ
- Netflix のビジュアルデザイン

### 技術リファレンス
- MDN Web Docs（CSS Animation）
- CSS-Tricks（アニメーション最適化）
- Google Web Fundamentals（レスポンシブデザイン）

---

## 📞 連絡先・フィードバック

**プロジェクト**: コエレク LP
**担当**: Wonder Drill株式会社
**作成日**: 2025年11月12日

---

**このログは、今後のLP改善・他プロジェクトへの応用に活用してください。**

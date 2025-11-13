# コエレクLP 技術仕様書

**作成日**: 2025-11-11
**プロジェクト名**: コエレク Landing Page
**バージョン**: 1.0.0
**承認者**: CEO平山傑

---

## 📋 プロジェクト概要

### 目的
救急外来医師向け音声入力カルテ「コエレク」の導入促進のための静的ランディングページ

### ターゲット
- 救急外来で働く医師
- 救急医療現場の管理者
- 医療DXを推進する医療機関

### KPI目標
- CVR: 8-10%（無料デモ申込 or 資料DL）
- 平均滞在時間: 2-3分
- スクロール深度: 70%以上が最終CTAまで到達
- 直帰率: 40%以下

---

## 🏗️ 技術スタック

### フロントエンド
```yaml
HTML: HTML5（セマンティックタグ使用）
CSS: CSS3（カスタムプロパティ使用、レスポンシブ対応）
JavaScript: Vanilla JS（依存関係なし、軽量化優先）
フォント: Noto Sans JP（Google Fonts）
アイコン: 必要に応じてSVG使用
```

### ホスティング
```yaml
プラットフォーム: Render（静的サイトホスティング）
デプロイ方法: Git連携（自動デプロイ）
カスタムドメイン: 安定後に設定予定
SSL: Render標準SSL（Let's Encrypt）
CDN: Render標準CDN
```

### 開発環境
```yaml
ローカルサーバー: Python SimpleHTTPServer or Live Server
バージョン管理: Git
リポジトリ: ローカル → Render連携
```

---

## 📁 ファイル構造

```
lp_koereq/
├── index.html                 # メインHTMLファイル
├── css/
│   ├── reset.css             # CSSリセット
│   ├── style.css             # メインスタイルシート
│   └── responsive.css        # レスポンシブ対応
├── js/
│   ├── main.js               # メインJavaScript
│   └── smooth-scroll.js      # スムーススクロール
├── images/
│   ├── hero/                 # ヒーロー画像（後で追加）
│   ├── logos/                # 病院ロゴ（後で追加）
│   ├── screenshots/          # スクリーンショット
│   └── icons/                # アイコン類
├── videos/
│   └── demo.mp4              # デモ動画（後で追加）
├── SPEC.md                   # この技術仕様書
├── README.md                 # プロジェクト説明
└── render.yaml               # Render設定ファイル
```

---

## 🎨 デザイン仕様

### カラーパレット
```css
:root {
  /* プライマリカラー */
  --wonder-blue: #2563EB;
  --wonder-blue-dark: #1E40AF;
  --wonder-blue-light: #3B82F6;

  /* セカンダリカラー */
  --healing-green: #34C759;
  --healing-green-dark: #28A745;

  /* ニュートラル */
  --white: #FFFFFF;
  --deep-navy: #1D1D1F;
  --gray-100: #F7F7F7;
  --gray-300: #D1D5DB;
  --gray-500: #6B7280;
  --gray-700: #374151;

  /* 背景 */
  --bg-primary: #FFFFFF;
  --bg-secondary: #F7F7F7;
  --bg-dark: #1D1D1F;
}
```

### タイポグラフィ
```css
:root {
  /* フォントファミリー */
  --font-primary: 'Noto Sans JP', sans-serif;
  --font-numbers: 'Roboto', sans-serif;

  /* フォントサイズ */
  --text-xs: 12px;
  --text-sm: 14px;
  --text-base: 16px;
  --text-lg: 18px;
  --text-xl: 20px;
  --text-2xl: 24px;
  --text-3xl: 28px;
  --text-4xl: 36px;
  --text-5xl: 48px;
  --text-6xl: 72px;

  /* 行間 */
  --leading-tight: 1.2;
  --leading-normal: 1.5;
  --leading-relaxed: 1.75;
}
```

### レスポンシブブレークポイント
```css
/* モバイル */
@media (max-width: 640px) { }

/* タブレット */
@media (min-width: 641px) and (max-width: 1024px) { }

/* デスクトップ */
@media (min-width: 1025px) { }
```

### 余白設計
```css
:root {
  /* セクション間 */
  --section-spacing: 128px;
  --section-spacing-mobile: 64px;

  /* コンテンツ幅 */
  --container-max-width: 1200px;
  --container-padding: 10%;

  /* 要素間 */
  --spacing-xs: 8px;
  --spacing-sm: 16px;
  --spacing-md: 24px;
  --spacing-lg: 32px;
  --spacing-xl: 48px;
  --spacing-2xl: 64px;
}
```

---

## 📱 セクション構成（全9セクション）

### Section 1: ヒーロー
```html
<section id="hero" class="hero-section">
  - H1: あなたの時間を、取り戻す。
  - サブコピー: 救急外来で、話すだけで記録完了。
  - 主CTA: 今すぐ無料デモを試す
  - 副CTA: 50秒で分かる動画を見る
  - ヒーロー画像: [後で追加]
  - 数値強調: 月16時間削減、年192時間
</section>
```

### Section 2: 導入実績
```html
<section id="social-proof" class="social-proof-section">
  - 見出し: 全国の先進的医療機関が選んだ
  - 病院ロゴ: 札幌徳洲会、勤医協中央、函館五稜郭
  - 数値: 記録時間削減80%
</section>
```

### Section 3: 問題提起
```html
<section id="problem" class="problem-section">
  - 痛み1: 診察後2時間残業
  - 痛み2: 情報共有が間に合わない
  - 痛み3: 記録漏れのリスク
  - トーン調整: この時間、医療に使えたら。
</section>
```

### Section 4: 問題の原因 → 解決策
```html
<section id="solution" class="solution-section">
  - 4-1（暗い背景）: 3つの壁
  - 4-2（明るい背景）: 3つの未来
  - 数値強調: 月16時間、年192時間、英語論文1-2本分
</section>
```

### Section 4.5: デモ動画（新規追加）
```html
<section id="demo-video" class="demo-video-section">
  - 見出し: 百聞は一見に如かず
  - 動画: [後で追加] 1分30秒
  - 操作時間内訳: 60秒+5秒+1秒
  - CTA: 今すぐ試す
</section>
```

### Section 5: 使用ステップ
```html
<section id="how-it-works" class="how-it-works-section">
  - 3ステップ: 話す（60秒）、選ぶ（5秒）、かざす（1秒）
  - 合計66秒強調
</section>
```

### Section 6: メリット（3本柱）
```html
<section id="benefits" class="benefits-section">
  - メリット1: 患者さんと接する時間+30%
  - メリット2: 教育に週2時間
  - メリット3: 研究に年192時間（英語論文1-2本分）
</section>
```

### Section 7: 導入事例 + セキュリティ
```html
<section id="testimonials" class="testimonials-section">
  - 事例1: 札幌徳洲会病院 研修医
  - 事例2: 勤医協中央病院 田口医師
  - 事例3: 函館五稜郭病院 救命士
  - セキュリティ: 3省2ガイドライン、Azure、24時間自動消去
</section>
```

### Section 8: FAQ
```html
<section id="faq" class="faq-section">
  - Q1: 医療用語認識
  - Q2: 電子カルテ連携
  - Q3: 導入期間
  - Q4: スタッフ教育
  - Q5: オリジナルプロンプト
  - Q6: 月額料金（¥15,000〜）
  - Q7: 無料トライアル
</section>
```

### Section 9: 最終CTA
```html
<section id="final-cta" class="final-cta-section">
  - 見出し: 記録に奪われた時間を、今日、取り戻す。
  - 数値: 月16時間、年192時間、英語論文1-2本分
  - 主CTA: 今すぐ無料デモを申し込む
  - 副CTA: 資料DL、相談予約
  - 安心要素: 30日無料、解約自由
</section>
```

---

## 🎯 CTA戦略（5箇所配置）

### CTA配置箇所
```yaml
CTA 1 - Section 1 (Hero):
  主: 今すぐ無料デモを試す
  副: 50秒で分かる動画を見る

CTA 2 - Section 3 (Problem):
  主: この問題を解決する（スクロール誘導）

CTA 3 - Section 4.5 (Demo Video):
  主: 今すぐ試す
  副: 詳細を見る

CTA 4 - Section 7 (Testimonials):
  主: 無料デモを申し込む

CTA 5 - Section 9 (Final):
  主: 今すぐ無料デモを申し込む
  副: 資料DL、相談予約
```

### CTAボタンスタイル
```css
.cta-button-primary {
  background: var(--wonder-blue);
  color: var(--white);
  padding: 16px 32px;
  border-radius: 8px;
  font-size: var(--text-xl);
  font-weight: bold;
  transition: all 0.3s ease;
}

.cta-button-primary:hover {
  background: var(--wonder-blue-dark);
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(37, 99, 235, 0.3);
}

.cta-button-secondary {
  background: var(--white);
  color: var(--wonder-blue);
  border: 2px solid var(--wonder-blue);
  padding: 14px 30px;
  border-radius: 8px;
  font-size: var(--text-lg);
  font-weight: bold;
  transition: all 0.3s ease;
}
```

---

## 🚀 インタラクション設計

### スムーススクロール
```javascript
// アンカーリンクのスムーススクロール
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  });
});
```

### スクロールアニメーション
```javascript
// Intersection Observer でスクロール時アニメーション
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('animate-in');
    }
  });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

### カウントアップアニメーション
```javascript
// 数字のカウントアップ（80%, 16時間, 192時間）
function animateNumber(element, target, duration = 2000) {
  const start = 0;
  const increment = target / (duration / 16);
  let current = start;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    element.textContent = Math.floor(current);
  }, 16);
}
```

### FAQ アコーディオン
```javascript
// FAQ のアコーディオン開閉
document.querySelectorAll('.faq-question').forEach(question => {
  question.addEventListener('click', () => {
    const answer = question.nextElementSibling;
    const isOpen = answer.classList.contains('open');

    // 全て閉じる
    document.querySelectorAll('.faq-answer').forEach(a => {
      a.classList.remove('open');
    });

    // クリックされたものを開く（既に開いていなければ）
    if (!isOpen) {
      answer.classList.add('open');
    }
  });
});
```

---

## 📊 SEO対策

### メタタグ
```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">

  <!-- タイトル -->
  <title>救急外来の記録時間80%削減｜音声入力カルテ コエレク</title>

  <!-- メタディスクリプション -->
  <meta name="description" content="救急外来で話すだけで記録完了。音声入力カルテ『コエレク』で記録時間80%削減、月16時間を患者・教育・研究へ。救急医22年の経験から生まれた最もシンプルなアプリ。30日間無料デモ実施中">

  <!-- OGP -->
  <meta property="og:title" content="救急外来の記録時間80%削減｜音声入力カルテ コエレク">
  <meta property="og:description" content="救急外来で話すだけで記録完了。記録時間80%削減、月16時間を患者・教育・研究へ。">
  <meta property="og:type" content="website">
  <meta property="og:url" content="https://koereq.com/">
  <meta property="og:image" content="[OG画像URL - 後で追加]">

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="救急外来の記録時間80%削減｜音声入力カルテ コエレク">
  <meta name="twitter:description" content="救急外来で話すだけで記録完了。記録時間80%削減、月16時間を患者・教育・研究へ。">
  <meta name="twitter:image" content="[Twitter画像URL - 後で追加]">

  <!-- 構造化データ（JSON-LD） -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "コエレク",
    "applicationCategory": "MedicalApplication",
    "offers": {
      "@type": "Offer",
      "price": "15000",
      "priceCurrency": "JPY"
    }
  }
  </script>
</head>
```

### 構造化マークアップ
```html
<!-- セマンティックHTML使用 -->
<header>
<nav>
<main>
  <section>
  <article>
  <aside>
</main>
<footer>
```

---

## 🌐 Renderデプロイ設定

### render.yaml
```yaml
services:
  - type: web
    name: koereq-lp
    env: static
    buildCommand: echo "No build needed"
    staticPublishPath: .
    routes:
      - type: rewrite
        source: /*
        destination: /index.html
    headers:
      - path: /*
        name: X-Frame-Options
        value: DENY
      - path: /*
        name: X-Content-Type-Options
        value: nosniff
      - path: /*
        name: X-XSS-Protection
        value: 1; mode=block
```

### デプロイ手順
```bash
# 1. Gitリポジトリ初期化（未実施の場合）
cd /Users/suguruhirayama/Desktop/Obsidian/Wonder_Drill株式会社/lp_koereq
git init
git add .
git commit -m "Initial commit: Koereq LP"

# 2. GitHub/GitLabにリポジトリ作成

# 3. Renderダッシュボードで設定
# - New Static Site
# - GitリポジトリをConnect
# - Build Command: 空欄
# - Publish Directory: . （カレントディレクトリ）

# 4. カスタムドメイン設定（安定後）
# - Render Dashboard → Settings → Custom Domains
# - koereq.com を追加
# - DNS設定でCNAMEレコード追加
```

### カスタムドメイン設定（安定後）
```yaml
ドメイン: koereq.com
DNS設定:
  - Type: CNAME
  - Name: www
  - Value: [Renderが提供するURL].onrender.com

  - Type: A
  - Name: @
  - Value: [RenderのIPアドレス]

SSL: Render自動提供（Let's Encrypt）
更新: 自動更新
```

---

## 🔧 パフォーマンス最適化

### 画像最適化
```yaml
フォーマット: WebP優先、フォールバックJPG
圧縮: TinyPNG等で圧縮
遅延読み込み: loading="lazy" 属性使用
レスポンシブ: srcset, sizes 属性使用
```

### CSS/JS最適化
```yaml
CSS:
  - クリティカルCSSをインライン化
  - 非クリティカルCSSは遅延読み込み
  - 未使用CSSの削除

JavaScript:
  - defer 属性使用
  - 依存関係なし（Vanilla JS）
  - 最小限の機能実装
```

### 読み込み速度目標
```yaml
First Contentful Paint: < 1.5秒
Largest Contentful Paint: < 2.5秒
Cumulative Layout Shift: < 0.1
Time to Interactive: < 3.5秒

Lighthouse Score目標:
  - Performance: 90+
  - Accessibility: 95+
  - Best Practices: 95+
  - SEO: 100
```

---

## 📝 コンテンツ管理

### 後で追加予定の要素
```yaml
画像:
  - ヒーロー画像（救急外来医師 + スマホ画面）
  - 病院ロゴ（札幌徳洲会、勤医協中央、函館五稜郭）
  - スクリーンショット（アプリ使用画面）
  - OGP画像

動画:
  - デモ動画（1分30秒、Section 4.5）
  - 50秒紹介動画（ヒーローセクション）

リンク:
  - お問い合わせフォームURL
  - 資料ダウンロードURL
  - 無料デモ申込URL
```

### プレースホルダー
```html
<!-- 画像プレースホルダー -->
<div class="image-placeholder" data-image="hero-image">
  [ヒーロー画像をここに配置]
</div>

<!-- 動画プレースホルダー -->
<div class="video-placeholder" data-video="demo-video">
  [デモ動画をここに配置]
</div>

<!-- リンクプレースホルダー -->
<a href="#contact-form-url" class="cta-button-primary">
  [お問い合わせフォームURL - 後で設定]
</a>
```

---

## 🧪 テスト計画

### ブラウザテスト
```yaml
必須:
  - Chrome（最新版）
  - Safari（最新版、iOS含む）
  - Firefox（最新版）
  - Edge（最新版）

推奨:
  - Chrome（1つ前のバージョン）
  - Safari iOS 15+
```

### デバイステスト
```yaml
モバイル:
  - iPhone 13/14/15 (Safari)
  - Android各種 (Chrome)

タブレット:
  - iPad (Safari)
  - Android Tablet (Chrome)

デスクトップ:
  - 1920x1080 (標準)
  - 1366x768 (ノートPC)
  - 2560x1440 (大型モニター)
```

### 機能テスト
```yaml
- スムーススクロール動作確認
- CTAボタンクリック動作
- FAQアコーディオン開閉
- レスポンシブ表示確認
- フォーム送信（リンク設定後）
- 動画再生（動画追加後）
```

---

## 📈 アナリティクス設定（後日）

### Google Analytics 4
```html
<!-- GA4トラッキングコード - 後で追加 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

### イベントトラッキング
```javascript
// CTAクリック
gtag('event', 'cta_click', {
  'event_category': 'engagement',
  'event_label': 'demo_request'
});

// スクロール深度
gtag('event', 'scroll_depth', {
  'event_category': 'engagement',
  'event_label': '75%'
});

// 動画再生
gtag('event', 'video_play', {
  'event_category': 'engagement',
  'event_label': 'demo_video'
});
```

---

## 🔐 セキュリティ

### HTTPヘッダー
```yaml
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
X-XSS-Protection: 1; mode=block
Content-Security-Policy: default-src 'self' https:
```

### SSL/TLS
```yaml
SSL証明書: Let's Encrypt（Render自動提供）
強制HTTPS: 有効
HSTS: 有効
```

---

## 📞 サポート・問い合わせ

### 技術担当
- CEO平山傑
- Email: s-hirayama@wonder-drill.com

### デプロイ後の確認事項
- [ ] 全セクション表示確認
- [ ] CTA動作確認
- [ ] レスポンシブ表示確認
- [ ] ページ速度確認（Lighthouse）
- [ ] SEOメタタグ確認
- [ ] OGP表示確認
- [ ] SSL証明書確認

---

**作成日**: 2025-11-11
**更新日**: 2025-11-11
**バージョン**: 1.0.0
**承認者**: CEO平山傑

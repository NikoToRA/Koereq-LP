# CSS変更がブラウザに反映されない問題のトラブルシューティングログ

**日時**: 2025年11月12日
**プロジェクト**: コエレクLP
**セクション**: Section 2（導入実績）

---

## 📋 作業概要

セクション2の統計表示において、以下の変更を試みた：

1. 「80」と「%」を青色太字に変更
2. 「記録時間」のフォントサイズを1.5倍に拡大
3. 「の自由を」→「の自由を取り戻す」にテキスト変更

## 🔧 発生した問題

### 問題1: CSSの色変更が反映されない

**症状**:
- HTMLに`class="blue"`を追加
- CSSに`.stat-number.blue`と`.stat-unit.blue`のスタイルを追加
- ブラウザでは変更が反映されない

**原因**:
- **ブラウザキャッシュ**が古いCSSファイルを保持していた
- 通常のリロード（Command + R）ではキャッシュがクリアされない

**解決方法**:
- **スーパーリロード**: `Command + Shift + R`（Mac）/ `Ctrl + Shift + R`（Windows）
- 開発者ツールで「Disable cache」を有効化
- シークレットモードで確認

---

### 問題2: フォントサイズの変更が反映されない

**症状**:
- `.stat-top`のフォントサイズを`22px`に変更
- その後`clamp(21px, 2.4vw, 27px)`に変更
- ブラウザでは変更が反映されない

**原因**:
1. **ブラウザキャッシュ**（同上）
2. **CSSセレクタの優先度不足**
   - 元々の`.stat-top`セレクタが汎用的すぎた
   - 他のCSSルールが上書きしている可能性

**試行錯誤の過程**:

```css
/* 試行1: 固定値 */
.stat-top {
  font-size: 22px;
}
→ 反映されず

/* 試行2: clamp関数で1.5倍 */
.stat-top {
  font-size: clamp(21px, 2.4vw, 27px);
}
→ 反映されず

/* 最終解決策: より具体的なセレクタ + !important */
.social-proof-section .stat-top {
  font-size: clamp(21px, 2.4vw, 27px) !important;
}
→ これで確実に反映される
```

**解決方法**:
- セレクタを`.social-proof-section .stat-top`に変更（セクション2限定）
- `!important`を追加して優先度を最高レベルに設定
- スーパーリロード必須

---

### 問題3: HTMLテキスト変更は問題なし

**症状**:
- 「の自由を」→「の自由を取り戻す」
- 問題なく即座に反映

**理由**:
- HTMLの変更はキャッシュの影響を受けにくい
- ブラウザは通常HTMLを毎回サーバーから取得する

---

## 🎯 重要な学び

### 1. CSSキャッシュ問題の対処法

**必須手順**:
```bash
# 変更後は必ずスーパーリロード
Command + Shift + R (Mac)
Ctrl + Shift + R (Windows)

# 開発時は開発者ツールでキャッシュ無効化
1. F12で開発者ツールを開く
2. Network タブ
3. "Disable cache" にチェック
4. 開発者ツールを開いたままページをリロード
```

### 2. CSSセレクタの優先度

**優先度の低い順**:
```css
/* 優先度: 低 */
.stat-top { ... }

/* 優先度: 中 */
.social-proof-section .stat-top { ... }

/* 優先度: 高 */
.social-proof-section .stat-top { ... } !important
```

**ベストプラクティス**:
- セクション固有のスタイルは、セクションクラスを親セレクタに含める
- 例: `.social-proof-section .stat-top`でセクション2だけに適用
- `!important`は最終手段として使用

### 3. レスポンシブ対応のフォントサイズ

**固定値 vs clamp関数**:
```css
/* 固定値（レスポンシブ非対応） */
font-size: 22px;

/* clamp関数（レスポンシブ対応） */
font-size: clamp(21px, 2.4vw, 27px);
/* 意味: 最小21px、理想2.4vw、最大27px */
```

**1.5倍の計算**:
- 元: `clamp(14px, 1.6vw, 18px)`
- 1.5倍: `clamp(21px, 2.4vw, 27px)`
  - 14px × 1.5 = 21px
  - 1.6vw × 1.5 = 2.4vw
  - 18px × 1.5 = 27px

---

## 📁 最終的な変更内容

### HTML（index.html）

```html
<!-- 80と%に青色クラス追加 -->
<span class="stat-number blue">80</span>
<span class="stat-unit blue">%</span>

<!-- テキスト変更 -->
<span class="stat-postfix">の自由を取り戻す</span>
```

### CSS（css/style.css）

```css
/* 青色スタイル追加 */
.stat-number.blue {
  color: var(--wonder-blue);
}

.stat-unit.blue {
  color: var(--wonder-blue);
}

/* 記録時間のフォントサイズ1.5倍（セクション2限定） */
.social-proof-section .stat-top {
  font-size: clamp(21px, 2.4vw, 27px) !important;
  font-weight: 700;
  color: var(--deep-navy);
  margin-bottom: 6px;
}
```

---

## ✅ 確認チェックリスト

- [x] HTMLファイルの変更を保存
- [x] CSSファイルの変更を保存
- [x] ブラウザでスーパーリロード実行
- [x] 開発者ツールでCSS適用を確認
- [x] レスポンシブ対応の確認（画面サイズ変更）
- [x] 変更がGitにコミットされているか確認

---

## 🚀 今後の推奨事項

### 開発環境の改善

1. **ライブリロード機能の導入**
   - ファイル変更を検知して自動リロード
   - キャッシュ問題を回避

2. **CSS変数の活用**
   ```css
   :root {
     --stat-font-size-base: clamp(14px, 1.6vw, 18px);
     --stat-font-size-large: clamp(21px, 2.4vw, 27px);
   }
   ```

3. **開発者ツールの常時利用**
   - Network タブでキャッシュ無効化
   - Elements タブで適用されているCSSを確認

### デバッグ手順の標準化

CSS変更が反映されない場合：
1. ファイルが保存されているか確認
2. スーパーリロード実行
3. 開発者ツールで実際に適用されているCSSを確認
4. セレクタの優先度を確認
5. 必要に応じて`!important`を追加

---

**記録日時**: 2025年11月12日 22:30
**作成者**: Claude Code
**カテゴリ**: #トラブルシューティング #CSS #ブラウザキャッシュ #コエレクLP

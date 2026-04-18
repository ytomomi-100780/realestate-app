# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 開発コマンド

```bash
npm install       # 依存パッケージのインストール
npm run dev       # 開発サーバー起動（http://localhost:5173）
npm run build     # 本番ビルド（dist/に出力）
npm run preview   # ビルド後のプレビュー
```

## 環境変数

`.env` ファイルに以下を設定する（`.gitignore` で管理外）。
`.env.example` を参考にすること。

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

## アーキテクチャ

**認証フロー**
- `AuthContext`（`src/contexts/AuthContext.jsx`）がSupabaseセッションをグローバルに管理する
- `ProtectedRoute`（`src/components/ProtectedRoute.jsx`）が未認証アクセスを `/login` へリダイレクトする
- セッション確認中は `loading` フラグで待機し、フラッシュリダイレクトを防ぐ

**ルーティング**
- `/login` → ログイン画面
- `/register` → 会員登録画面
- `/properties` → 物件一覧（要認証）
- その他 → `/properties` へリダイレクト

**Supabase連携**
- クライアントは `src/lib/supabase.js` で一元管理
- 認証APIは `supabase.auth.signUp` / `signInWithPassword` / `signOut` を使用

## Git運用ルール

**コードを変更するたびに必ずコミットしてGitHubにプッシュする。**

```bash
git add <変更ファイル>
git commit -m "変更内容の簡潔な説明"
git push origin <現在のブランチ>
```

- コミットはタスク完了ごとに行う
- 未コミットの変更を残したままタスクを終了しない
- コミット後は必ずプッシュする（ローカルのみのコミットは不可）
- ブランチが未作成の場合は `git push -u origin <ブランチ名>`

# Hostigerでのデプロイ手順

## 📦 前提条件

- Node.js 18以上をサポートするHostigerプラン
- PostgreSQLデータベース
- GitHubアカウント

## 🚀 デプロイフロー

**基本的な流れ:**
1. GitHubにコードをプッシュ
2. HostingerでGitHubリポジトリと連携
3. Hostingerで環境変数を設定
4. Hostingerでビルドとスタートコマンドを設定
5. Hostingerでデプロイを実行（自動または手動）

## 🚀 デプロイ手順

### 1. GitHubへのプッシュ

```bash
git add .
git commit -m "デプロイ準備完了"
git push origin main
```

### 2. Hostigerでアプリケーション作成

1. Hostingerにログイン
2. 「Node.js」アプリケーションを作成
3. 「GitHub」リポジトリと連携を選択
4. リポジトリURLを入力: `https://github.com/SINJAPANLLC/sinjapan-logimatch-ver2.git`
5. ブランチ: `main` を選択

### 3. 環境変数の設定

Hostigerの環境変数設定で以下を追加：

```env
# データベース
DATABASE_URL=postgresql://username:password@hostname:port/database?schema=public

# JWT認証
JWT_SECRET=your_jwt_secret_here

# Next.js (ドメイン: sinjapan-logimatch.com)
NEXTAUTH_URL=https://sinjapan-logimatch.com
NEXTAUTH_SECRET=your_nextauth_secret
NEXT_PUBLIC_DOMAIN=sinjapan-logimatch.com

# ポート（通常は自動設定されますが、必要に応じて設定）
PORT=5000

# Optional: ファイルアップロード
GOOGLE_CLOUD_PROJECT_ID=your_project_id
GOOGLE_CLOUD_STORAGE_BUCKET=your_bucket_name
GOOGLE_CLOUD_STORAGE_KEY=your_service_account_key

# Optional: 決済
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
SQUARE_ACCESS_TOKEN=your_square_access_token
SQUARE_APPLICATION_ID=your_square_app_id
```

### 4. ビルド設定

Hostigerのビルド設定で以下を設定：

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node.js Version**: 18.x または 20.x
- **Port**: 自動設定（環境変数`PORT`を使用）

⚠️ **重要**: 
- ビルドコマンドとスタートコマンドが正しく設定されているか確認してください
- 環境変数`PORT`が設定されているか確認してください（通常はHostingerが自動設定します）

### 5. デプロイの実行

Hostingerで以下のいずれかを実行：
- **自動デプロイ**: GitHubにプッシュすると自動的にデプロイが開始される場合があります
- **手動デプロイ**: Hostingerのダッシュボードから「デプロイ」ボタンをクリック

デプロイが完了するまで数分かかります。

### 7. デプロイ後の確認

デプロイが完了したら、以下を確認：

1. **アプリケーションのステータス**
   - Hostingerのダッシュボードで、アプリケーションが「実行中」になっているか確認
   - ログビューアーでエラーがないか確認

2. **URLアクセステスト**
   - ドメイン（`https://sinjapan-logimatch.com`）にアクセス
   - 403エラーが出る場合は、以下のトラブルシューティングを参照

### 8. データベースのセットアップ

デプロイ後、HostigerのTerminalまたはSSHで以下を実行：

```bash
# Prismaスキーマを本番データベースにプッシュ
npm run db:push

# 管理者アカウントの作成
npm run create:admin
```

### 9. 管理者アカウント情報

作成される管理者アカウント：
- **Email**: info@sinjapan.jp
- **Password**: Kazuya8008

⚠️ **重要**: デプロイ後、必ずパスワードを変更してください！

## 🔧 設定ファイル

### package.json (ビルドスクリプト確認済み)
- ✅ `build`: prisma generate + next build
- ✅ `start`: next start
- ✅ `postinstall`: prisma generate

### next.config.js
プロダクションビルドに必要な設定が含まれています。

## 🌐 本番環境アクセス

1. デプロイ完了後、提供されたURLにアクセス
2. 管理者アカウントでログイン
3. ダッシュボードの動作確認

## 🔒 セキュリティ設定

### 必須の環境変数
- `DATABASE_URL`: 本番データベースURL
- `JWT_SECRET`: 最低32文字のランダム文字列
- `NEXTAUTH_SECRET`: セキュアなランダム文字列（本番用）

### 推奨設定
- HTTPS強制
- CORS設定確認
- レート制限設定

## 📊 データベース作成

PostgreSQLデータベースを作成し、以下の形式でDATABASE_URLを設定：

```
postgresql://username:password@hostname:port/database_name?schema=public
```

## 🔍 トラブルシューティング

### 403 Forbidden エラーの解決（重要！）

403エラーが発生する場合、以下の手順を**順番に**確認してください：

#### ⚠️ 最も重要な確認事項（まずこれを確認！）

1. **アプリケーションが起動しているか確認**
   - Hostingerのダッシュボードで、アプリケーションのステータスを確認
   - 「実行中」または「Running」になっているか確認
   - 停止している場合は、「起動」ボタンをクリック

2. **ログの確認（最重要）**
   - Hostingerの「ログ」または「Logs」タブを開く
   - アプリケーションログとビルドログを確認
   - エラーメッセージがないか確認
   - よくあるエラー：
     - `EADDRINUSE`: ポートが使用中（環境変数`PORT`を確認）
     - `Cannot find module`: 依存関係が不足（`npm install`が必要）
     - `Prisma Client is not generated`: Prismaクライアントが生成されていない（`npm run prisma:generate`が必要）

3. **環境変数の確認**
   - Hostingerの環境変数設定で、以下がすべて設定されているか確認：
     - `DATABASE_URL` ✅
     - `JWT_SECRET` ✅
     - `NEXTAUTH_URL` ✅（`https://sinjapan-logimatch.com`）
     - `PORT` ✅（通常は自動設定、明示的に設定する場合は`5000`など）

4. **ビルドとスタートコマンドの確認**
   - **Build Command**: `npm run build` ✅
   - **Start Command**: `npm start` ✅
   - **Node.js Version**: 18.x または 20.x ✅

#### 詳細なトラブルシューティング

##### 1. アプリケーションの起動確認
- Hostingerのアプリケーション管理画面で、アプリケーションが正常に起動しているか確認
- ログビューアーでエラーメッセージを確認

#### 2. ポート番号の設定
- 環境変数`PORT`が正しく設定されているか確認（Hostingerが自動設定する場合もあります）
- `package.json`の`start`コマンドが正しく設定されているか確認（現在は`next start -H 0.0.0.0`）

#### 3. ドメイン設定
ドメイン`sinjapan-logimatch.com`を設定する場合：

1. Hostingerのドメイン管理で、ドメインをアプリケーションに紐付け
2. 環境変数に以下を追加：
   ```env
   NEXTAUTH_URL=https://sinjapan-logimatch.com
   NEXT_PUBLIC_DOMAIN=sinjapan-logimatch.com
   ```

#### 4. ビルドとスタートコマンドの確認
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node.js Version**: 18.x または 20.x

#### 5. ディレクトリ権限
- SSHでアプリケーションディレクトリにアクセス
- ディレクトリの権限を確認：`ls -la`
- 必要に応じて権限を修正：`chmod 755 .`

#### 6. `.htaccess`ファイルについて
⚠️ **注意**: HostingerのNode.js環境では、`.htaccess`ファイルは通常使用されません。
- Node.jsアプリケーションは直接起動するため、Apacheの`.htaccess`は適用されません
- 403エラーの原因は通常、アプリケーションが起動していない、またはポート設定の問題です
- まず、上記の1-5を確認してください

#### 7. 環境変数の再確認
以下がすべて設定されているか確認：
- `DATABASE_URL`
- `JWT_SECRET`
- `NEXTAUTH_URL` (ドメインを含む完全なURL)
- `PORT` (通常は自動設定)

#### 8. ログの確認
```bash
# SSHでアプリケーションディレクトリにアクセス
# ログファイルを確認
tail -f logs/app.log
# または Hostingerのログビューアーを使用
```

### ビルドエラー
- Node.jsバージョンを18.x以上に設定
- 依存関係の競合チェック: `npm ci`

### データベース接続エラー
- DATABASE_URLの形式確認
- データベースの接続許可設定確認

### 環境変数エラー
- すべての必須環境変数が設定されているか確認
- 文字列に特殊文字が含まれる場合はエスケープ

## 📝 アップデート手順

コードを更新する場合：

1. GitHubリポジトリにpush
2. Hostigerで自動デプロイまたは手動再デプロイ
3. 必要に応じてデータベースマイグレーション実行

## 🚨 緊急時の対応

### ロールバック
- Hostigerのデプロイ履歴から前のバージョンに戻す
- または`git revert`でコミットを戻してpush

### ログ確認
- Hostigerのログビューアーでエラーログを確認
- アプリケーションログとビルドログを両方チェック

## ✅ デプロイ完了チェックリスト

- [ ] アプリケーションが正常に起動
- [ ] データベース接続成功
- [ ] 管理者ログイン成功
- [ ] 主要機能の動作確認
- [ ] HTTPS証明書の設定
- [ ] パスワード変更完了

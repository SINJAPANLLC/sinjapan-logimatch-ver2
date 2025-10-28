# Hostigerでのデプロイ手順

## 📦 前提条件

- Node.js 18以上をサポートするHostigerプラン
- PostgreSQLデータベース
- GitHubアカウント

## 🚀 デプロイ手順

### 1. Hostigerでアプリケーション作成

1. Hostigerにログイン
2. Node.jsアプリケーションを作成
3. GitHubリポジトリと連携: `https://github.com/SINJAPANLLC/sinjapan-logimatch-ver2.git`

### 2. 環境変数の設定

Hostigerの環境変数設定で以下を追加：

```env
# データベース
DATABASE_URL=postgresql://username:password@hostname:port/database?schema=public

# JWT認証
JWT_SECRET=your_jwt_secret_here

# Next.js
NEXTAUTH_URL=https://your-app-domain.com
NEXTAUTH_SECRET=your_nextauth_secret

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

### 3. ビルド設定

Hostigerのビルド設定で以下を設定：

- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Node.js Version**: 18.x または 20.x

### 4. データベースのセットアップ

デプロイ後、HostigerのTerminalまたはSSHで以下を実行：

```bash
# Prismaスキーマを本番データベースにプッシュ
npm run db:push

# 管理者アカウントの作成
npm run create:admin
```

### 5. 管理者アカウント情報

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

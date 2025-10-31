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

### 403 Forbidden エラーの解決

403エラーが発生する場合、以下の手順を確認してください：

#### 1. アプリケーションの起動確認
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

#### 6. `.htaccess`ファイル
- プロジェクトルートに`.htaccess`ファイルが存在するか確認
- Apacheを使用している場合、このファイルがルーティングを処理します

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

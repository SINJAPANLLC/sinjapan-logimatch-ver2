# 本番環境デプロイ手順

## 📦 デプロイ設定

このプロジェクトは本番公開用に設定済みです。

### 必要な環境変数

本番環境で以下の環境変数を設定してください：

1. **DATABASE_URL** - 本番用PostgreSQLデータベースのURL
2. **JWT_SECRET** - JWT認証用のシークレットキー

## 🚀 デプロイ手順

### 1. Replitでデプロイボタンをクリック

プロジェクトの「Deploy」ボタンをクリックして本番環境にデプロイします。

### 2. 本番環境変数を設定

デプロイ設定画面で以下を設定：
- `DATABASE_URL`: 本番用データベースURL
- `JWT_SECRET`: セキュアなランダム文字列（開発環境と同じものを使用可能）

### 3. データベースのセットアップ

デプロイ後、本番環境のシェルで以下を実行：

```bash
# Prismaスキーマを本番データベースにプッシュ
npm run db:push
```

### 4. 管理者アカウントの作成

本番環境で管理者アカウントを作成：

```bash
npm run create:admin
```

このコマンドで以下のアカウントが作成されます：
- **Email**: info@sinjapan.jp
- **Password**: Kazuya8008
- **権限**: 管理者

⚠️ **セキュリティ注意**: 
本番環境でアカウント作成後、必ずパスワードを変更してください！

## 🔐 本番環境でのパスワード変更

初回ログイン後、設定ページからパスワードを変更することを強く推奨します。

## 📝 その他の設定

### データベースパネルから直接作成する場合

Replitのデータベースパネルから本番データベースに接続し、以下のSQLを実行することもできます：

```sql
-- パスワードハッシュを生成してから実行
INSERT INTO users (
  id,
  email,
  password,
  "userType",
  "companyName",
  "contactPerson",
  phone,
  "isAdmin",
  "verificationStatus",
  "trustScore",
  "createdAt",
  "updatedAt"
) VALUES (
  'admin_' || gen_random_uuid()::text,
  'info@sinjapan.jp',
  -- ここにハッシュ化されたパスワードを入力
  '$2a$10$PRFT62i9FJp08hCHROj4CeZ/aCCuF98oTetSY8/cyt7umMXv39sj2',
  'SHIPPER',
  'SIN JAPAN',
  'Admin',
  '000-0000-0000',
  true,
  'APPROVED',
  5.0,
  NOW(),
  NOW()
);
```

## ✅ デプロイ完了確認

1. 本番URLにアクセス
2. ログインページで管理者アカウントでログイン
3. ダッシュボードにアクセスできることを確認

## 🔧 トラブルシューティング

### データベース接続エラー
- DATABASE_URLが正しく設定されているか確認
- 本番データベースが作成されているか確認

### JWTエラー
- JWT_SECRETが設定されているか確認

### ビルドエラー
- すべての依存関係がインストールされているか確認
- `npm run build` をローカルで実行してエラーがないか確認

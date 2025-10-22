# SIN JAPAN LOGI - 物流マッチングプラットフォーム

荷主と運送会社をつなぐ、次世代の物流マッチングプラットフォーム。

![SIN JAPAN LOGI](public/logo.png)

## 🚀 デプロイ済み

**本番環境**: [https://sin-japan-logi.vercel.app](https://sin-japan-logi.vercel.app)

**開発環境**: http://localhost:3050

## 🚀 特徴

- **簡単な案件投稿**: 荷主は数分で配送案件を投稿可能
- **効率的なマッチング**: 運送会社は条件に合う案件を検索し、自由にオファーを提案
- **コスト削減**: 複数の運送会社から相見積もりが可能
- **リアルタイム更新**: 案件のステータスやオファー状況をリアルタイムで確認
- **2つのユーザータイプ**: 荷主と運送会社それぞれに最適化されたUI

## 🛠 技術スタック

### フロントエンド
- **Next.js 14**: React フレームワーク
- **TypeScript**: 型安全な開発
- **Tailwind CSS**: モダンなUIデザイン
- **Lucide React**: アイコンライブラリ
- **date-fns**: 日付フォーマット

### バックエンド
- **Next.js API Routes**: サーバーレスAPIエンドポイント
- **Prisma**: データベースORM
- **SQLite**: リレーショナルデータベース
- **JWT**: 認証トークン
- **bcryptjs**: パスワードハッシュ化

## 📋 前提条件

- Node.js 18.x 以上
- npm または yarn

## 🚀 セットアップ

### 1. リポジトリのクローン

```bash
git clone <repository-url>
cd "SIN JAPAN LOGI"
```

### 2. 依存パッケージのインストール

```bash
npm install
```

### 3. 環境変数の設定

`.env` ファイルを作成します：

```env
# Database (SQLite)
DATABASE_URL="file:./dev.db"

# JWT Secret (ランダムな文字列を生成してください)
JWT_SECRET="your-secret-key-change-this-in-production"
```

### 4. データベースのセットアップ

```bash
# Prisma クライアントの生成
npm run prisma:generate

# データベースマイグレーション
npm run prisma:migrate
```

### 5. テストアカウントの作成

```bash
node scripts/add-test-users.js
```

以下のテストアカウントが作成されます：

**荷主アカウント**
- ID: `info@sinjapan.jp`
- PASS: `Kazuya8008`

**運送会社アカウント**
- ID: `carrier@sinjapan.jp`
- PASS: `Kazuya8008`

**管理者アカウント**
- ID: `info@sinjapan.jp`
- PASS: `Kazuya8008`
- URL: http://localhost:3050/admin

### 6. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:3050 にアクセスしてください。

## 📚 主な機能

### 荷主向け機能

- ✅ 会員登録・ログイン
- ✅ 配送案件の投稿
- ✅ 投稿した案件の管理
- ✅ 運送会社からのオファー受信
- ✅ オファーの承認・拒否
- ✅ マッチング後の運送会社情報確認

### 運送会社向け機能

- ✅ 会員登録・ログイン
- ✅ 配送案件の検索・閲覧
- ✅ 条件でのフィルタリング（集荷地、配送先など）
- ✅ 案件へのオファー送信
- ✅ 送信したオファーの管理
- ✅ マッチング後の荷主情報確認

## 🗂 プロジェクト構造

```
SIN JAPAN LOGI/
├── prisma/
│   └── schema.prisma          # データベーススキーマ
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── api/              # APIエンドポイント
│   │   │   ├── auth/        # 認証API
│   │   │   ├── shipments/   # 配送案件API
│   │   │   └── offers/      # オファーAPI
│   │   ├── dashboard/        # ダッシュボードページ
│   │   ├── login/           # ログインページ
│   │   ├── register/        # 登録ページ
│   │   ├── shipments/       # 配送案件ページ
│   │   └── offers/          # オファーページ
│   ├── components/           # 再利用可能なコンポーネント
│   └── lib/                 # ユーティリティ関数
│       ├── prisma.ts        # Prismaクライアント
│       ├── auth.ts          # 認証ヘルパー
│       ├── validators.ts    # バリデーションスキーマ
│       └── api-response.ts  # APIレスポンスヘルパー
├── package.json
├── tsconfig.json
├── tailwind.config.js
└── README.md
```

## 🔐 認証フロー

1. ユーザーが登録/ログイン
2. JWTトークンが発行される
3. トークンはローカルストレージに保存
4. 以降のAPIリクエストでトークンを使用
5. サーバー側でトークンを検証してユーザー情報を取得

## 🎨 UIデザイン

- レスポンシブデザイン対応
- モダンでクリーンなインターフェース
- 直感的なナビゲーション
- アクセシビリティに配慮

## 📊 データモデル

### User（ユーザー）
- 荷主（SHIPPER）または運送会社（CARRIER）
- 会社情報、連絡先情報

### Shipment（配送案件）
- 荷物情報（名前、重量、容積など）
- 集荷情報（住所、日時など）
- 配送情報（住所、日時など）
- 要求事項（車両タイプ、特別な要件など）
- ステータス管理

### Offer（オファー）
- 運送会社から荷主へのオファー
- 提案金額
- メッセージ
- ステータス管理

## 🚢 デプロイ

### Vercelへのデプロイ

```bash
# Vercel CLIのインストール
npm install -g vercel

# デプロイ
vercel
```

### 環境変数の設定

Vercelダッシュボードで以下の環境変数を設定してください：

- `DATABASE_URL`
- `JWT_SECRET`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`

## 🛠 開発コマンド

```bash
# 開発サーバー起動
npm run dev

# 本番ビルド
npm run build

# 本番サーバー起動
npm start

# Prisma Studio（データベースGUI）
npm run prisma:studio

# データベースマイグレーション
npm run prisma:migrate

# Linter実行
npm run lint
```

## 📝 API エンドポイント

### 認証
- `POST /api/auth/register` - ユーザー登録
- `POST /api/auth/login` - ログイン
- `GET /api/auth/me` - 現在のユーザー情報取得

### 配送案件
- `GET /api/shipments` - 案件一覧取得
- `POST /api/shipments` - 案件作成（荷主のみ）
- `GET /api/shipments/[id]` - 案件詳細取得
- `PATCH /api/shipments/[id]` - 案件更新
- `DELETE /api/shipments/[id]` - 案件削除

### オファー
- `GET /api/offers` - オファー一覧取得
- `POST /api/offers` - オファー作成（運送会社のみ）
- `POST /api/offers/[id]/accept` - オファー承認（荷主のみ）
- `POST /api/offers/[id]/reject` - オファー拒否（荷主のみ）

## 🤝 貢献

プルリクエストを歓迎します。大きな変更の場合は、まずissueを開いて変更内容を議論してください。

## 📄 ライセンス

MIT License

## 👥 作成者

SIN JAPAN LOGI Development Team

## 📞 サポート

問題が発生した場合は、GitHubのIssuesページで報告してください。

---

© 2025 SIN JAPAN LOGI. All rights reserved.


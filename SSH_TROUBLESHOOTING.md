# SSH接続でのトラブルシューティング

HostingerのSSH接続情報を使用して、403エラーを診断・解決します。

## 🔐 SSH接続情報

- **IP**: 45.13.135.26
- **ポート**: 65002
- **ユーザー名**: u170935974
- **パスワード**: Hostingerのダッシュボードで確認・変更可能

## 📋 SSH接続手順

### 1. SSH接続

```bash
ssh u170935974@45.13.135.26 -p 65002
```

パスワードを求められたら、Hostingerのダッシュボードで確認したパスワードを入力します。

### 2. アプリケーションの状態確認

接続後、以下のコマンドでアプリケーションの状態を確認：

```bash
# 現在のディレクトリを確認
pwd

# ファイル一覧を確認
ls -la

# Node.jsプロセスが実行中か確認
ps aux | grep node
ps aux | grep next
ps aux | grep npm

# ポート5000が使用されているか確認
netstat -tulpn | grep :5000
# または
lsof -i :5000
# または
ss -tulpn | grep :5000
```

### 3. 環境変数の確認

```bash
# 環境変数を確認
echo $DATABASE_URL
echo $JWT_SECRET
echo $NEXTAUTH_URL
echo $NEXT_PUBLIC_DOMAIN
echo $PORT

# すべての環境変数を確認
env | grep -E "(DATABASE|JWT|NEXT|PORT)"
```

### 4. ログの確認

```bash
# ログディレクトリを確認
ls -la logs/
ls -la ~/logs/

# アプリケーションログを確認
tail -100 logs/app.log
tail -100 ~/logs/app.log

# リアルタイムでログを監視
tail -f logs/app.log
```

### 5. アプリケーションの再起動

```bash
# PM2が使用されている場合
pm2 list
pm2 restart all
pm2 logs

# 直接起動する場合
cd /path/to/your/app
npm start

# または
node server.js
```

### 6. ディレクトリ権限の確認・修正

```bash
# 現在の権限を確認
ls -la

# 必要に応じて権限を修正
chmod 755 .
chmod 644 package.json
chmod 644 next.config.js
chmod -R 755 src/
```

### 7. 依存関係の確認

```bash
# node_modulesが存在するか確認
ls -la node_modules/

# 依存関係を再インストール
npm install

# Prismaクライアントを再生成
npm run prisma:generate
```

### 8. ビルドの確認

```bash
# .nextディレクトリが存在するか確認
ls -la .next/

# 再ビルド
npm run build
```

## 🔧 よくある問題と解決策

### 問題1: アプリケーションが起動していない

**確認:**
```bash
ps aux | grep node
```

**解決:**
- Hostingerのダッシュボードからアプリケーションを起動
- または、SSHで手動起動: `npm start`

### 問題2: ポートが使用されていない

**確認:**
```bash
lsof -i :5000
```

**解決:**
- 環境変数`PORT`が設定されているか確認
- アプリケーションが正しく起動しているか確認

### 問題3: 環境変数が設定されていない

**確認:**
```bash
echo $DATABASE_URL
```

**解決:**
- Hostingerのダッシュボードで環境変数を設定
- 設定後、アプリケーションを再起動

### 問題4: ビルドエラー

**確認:**
```bash
npm run build
```

**解決:**
- エラーメッセージを確認
- 依存関係を再インストール: `npm install`
- Prismaクライアントを再生成: `npm run prisma:generate`

### 問題5: 権限エラー

**確認:**
```bash
ls -la
```

**解決:**
```bash
chmod 755 .
chmod -R 755 src/
```

## 📝 診断チェックリスト

SSH接続後、以下を順番に確認：

- [ ] `ps aux | grep node` - Node.jsプロセスが実行中か
- [ ] `lsof -i :5000` - ポート5000が使用されているか
- [ ] `echo $PORT` - 環境変数PORTが設定されているか
- [ ] `echo $DATABASE_URL` - DATABASE_URLが設定されているか
- [ ] `tail -100 logs/app.log` - ログにエラーがないか
- [ ] `ls -la .next/` - ビルドが完了しているか
- [ ] `ls -la node_modules/` - 依存関係がインストールされているか

## 🚨 緊急時の対応

### アプリケーションを完全に再起動

```bash
# 1. 実行中のプロセスを停止
pkill -f node
pkill -f next

# 2. アプリケーションディレクトリに移動
cd /path/to/your/app

# 3. 依存関係を再インストール（必要に応じて）
npm install

# 4. Prismaクライアントを再生成
npm run prisma:generate

# 5. 再ビルド
npm run build

# 6. アプリケーションを起動
npm start
```

**注意**: 上記のコマンドは、Hostingerのダッシュボードから再起動する方が安全です。


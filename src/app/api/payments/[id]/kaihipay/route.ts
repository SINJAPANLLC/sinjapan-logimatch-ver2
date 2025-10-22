import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const paymentId = params.id

    // 決済情報を取得
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: {
          select: {
            email: true,
            companyName: true,
            contactPerson: true,
            phone: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: '決済情報が見つかりません' }, { status: 404 })
    }

    // 会費ペイページのHTMLを返す
    const html = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>会費ペイ 口座振替設定 - SIN JAPAN LOGI MATCH</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 700px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-bottom: 10px;
          }
          .amount {
            font-size: 32px;
            color: #8b5cf6;
            font-weight: bold;
            margin: 20px 0;
          }
          .info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          .form-group {
            margin-bottom: 20px;
          }
          label {
            display: block;
            font-weight: 600;
            margin-bottom: 5px;
            color: #333;
          }
          input, select {
            width: 100%;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            box-sizing: border-box;
          }
          input:focus, select:focus {
            outline: none;
            border-color: #8b5cf6;
          }
          .submit-button {
            background: #8b5cf6;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
            margin-top: 20px;
          }
          .submit-button:hover {
            background: #7c3aed;
          }
          .submit-button:disabled {
            background: #ccc;
            cursor: not-allowed;
          }
          .message {
            margin-top: 20px;
            padding: 15px;
            border-radius: 4px;
          }
          .success {
            background: #d4edda;
            color: #155724;
          }
          .error {
            background: #f8d7da;
            color: #721c24;
          }
          .note {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            color: #856404;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>会費ペイ 口座振替設定</h1>
          <div class="amount">¥${payment.amount.toLocaleString()}</div>
          
          <div class="info">
            <p><strong>会社名:</strong> ${payment.user.companyName}</p>
            <p><strong>担当者:</strong> ${payment.user.contactPerson}</p>
            <p><strong>決済ID:</strong> ${payment.id}</p>
          </div>

          <div class="note">
            <p><strong>⚠️ 重要なお知らせ</strong></p>
            <p>会費ペイの口座振替設定には、会費ペイのAPI連携が必要です。</p>
            <p>以下のフォームは設定後に有効化されます。</p>
          </div>

          <form id="bank-account-form">
            <div class="form-group">
              <label for="bank-name">金融機関名</label>
              <input type="text" id="bank-name" name="bankName" placeholder="例：三菱UFJ銀行" required disabled>
            </div>

            <div class="form-group">
              <label for="branch-name">支店名</label>
              <input type="text" id="branch-name" name="branchName" placeholder="例：本店" required disabled>
            </div>

            <div class="form-group">
              <label for="account-type">口座種別</label>
              <select id="account-type" name="accountType" required disabled>
                <option value="">選択してください</option>
                <option value="普通">普通</option>
                <option value="当座">当座</option>
              </select>
            </div>

            <div class="form-group">
              <label for="account-number">口座番号</label>
              <input type="text" id="account-number" name="accountNumber" placeholder="7桁の数字" pattern="[0-9]{7}" required disabled>
            </div>

            <div class="form-group">
              <label for="account-holder">口座名義（カタカナ）</label>
              <input type="text" id="account-holder" name="accountHolder" placeholder="例：カブシキガイシャ サンプル" required disabled>
            </div>

            <button type="submit" class="submit-button" disabled>口座振替を設定</button>
          </form>

          <div id="status"></div>

          <div style="margin-top: 30px; text-align: center;">
            <p style="font-size: 14px; color: #666;">
              会費ペイ API連携の設定方法については、
              <a href="/dashboard/settings" style="color: #8b5cf6;">設定ページ</a>
              をご確認ください。
            </p>
            <button onclick="window.location.href='/dashboard'" style="margin-top: 15px; background: #6b7280; color: white; border: none; padding: 10px 20px; border-radius: 4px; cursor: pointer;">
              ダッシュボードに戻る
            </button>
          </div>
        </div>

        <script>
          document.getElementById('bank-account-form').addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(e.target);
            const data = Object.fromEntries(formData.entries());
            const statusDiv = document.getElementById('status');
            const submitButton = e.target.querySelector('button[type="submit"]');
            
            submitButton.disabled = true;
            submitButton.textContent = '処理中...';

            try {
              // TODO: 会費ペイAPIの実装
              // const response = await fetch('/api/payments/${paymentId}/complete', {
              //   method: 'POST',
              //   headers: { 'Content-Type': 'application/json' },
              //   body: JSON.stringify({ 
              //     accountInfo: data,
              //     provider: 'kaihipay'
              //   })
              // });

              // デモ用の成功処理
              setTimeout(() => {
                statusDiv.innerHTML = '<div class="message success">口座振替の設定が完了しました！3秒後にダッシュボードに戻ります...</div>';
                setTimeout(() => {
                  window.location.href = '/dashboard';
                }, 3000);
              }, 1500);

            } catch (error) {
              statusDiv.innerHTML = '<div class="message error">設定に失敗しました: ' + error.message + '</div>';
              submitButton.disabled = false;
              submitButton.textContent = '口座振替を設定';
            }
          });
        </script>
      </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })

  } catch (error) {
    console.error('Kaihipay payment page error:', error)
    return NextResponse.json({ error: '決済ページの表示に失敗しました' }, { status: 500 })
  }
}

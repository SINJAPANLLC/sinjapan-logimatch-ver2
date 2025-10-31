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
            contactPerson: true
          }
        }
      }
    })

    if (!payment) {
      return NextResponse.json({ error: '決済情報が見つかりません' }, { status: 404 })
    }

    // 環境変数からSquare設定を取得
    const isProduction = process.env.NODE_ENV === 'production'
    const squareAppId = isProduction 
      ? process.env.SQUARE_APPLICATION_ID 
      : process.env.SQUARE_SANDBOX_APPLICATION_ID
    const squareScriptUrl = isProduction
      ? 'https://web.squarecdn.com/v1/square.js'
      : 'https://sandbox.web.squarecdn.com/v1/square.js'

    // Square決済ページのHTMLを返す
    const html = `
      <!DOCTYPE html>
      <html lang="ja">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Square決済 - SIN JAPAN LOGI MATCH</title>
        <script src="${squareScriptUrl}"></script>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
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
            color: #0070f3;
            font-weight: bold;
            margin: 20px 0;
          }
          .info {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
          }
          #card-container {
            margin: 20px 0;
          }
          #payment-button {
            background: #0070f3;
            color: white;
            border: none;
            padding: 15px 30px;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
            width: 100%;
          }
          #payment-button:hover {
            background: #0051cc;
          }
          #payment-button:disabled {
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
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Square決済</h1>
          <div class="amount">¥${payment.amount.toLocaleString()}</div>
          
          <div class="info">
            <p><strong>会社名:</strong> ${payment.user.companyName}</p>
            <p><strong>担当者:</strong> ${payment.user.contactPerson}</p>
            <p><strong>決済ID:</strong> ${payment.id}</p>
          </div>

          <div id="card-container"></div>
          
          <button id="payment-button">決済を実行</button>
          
          <div id="payment-status"></div>

          <p style="text-align: center; margin-top: 30px; font-size: 14px; color: #666;">
            ${isProduction ? '※ 本番環境で稼働中' : '※ Sandbox（テスト）モードで稼働中'}
          </p>
        </div>

        <script>
          const SQUARE_APP_ID = '${squareAppId}';
          const PAYMENT_ID = '${paymentId}';
          
          let card;

          async function initializeSquare() {
            try {
              if (!SQUARE_APP_ID) {
                document.getElementById('card-container').innerHTML = \`
                  <p style="padding: 20px; background: #f8d7da; border-radius: 4px; color: #721c24;">
                    Square APIキーが設定されていません。<br>
                    管理者にお問い合わせください。
                  </p>
                \`;
                document.getElementById('payment-button').disabled = true;
                return;
              }

              // Square Web Payments SDKの初期化
              const payments = Square.payments(SQUARE_APP_ID);
              card = await payments.card();
              await card.attach('#card-container');

              document.getElementById('payment-button').addEventListener('click', handlePayment);

            } catch (error) {
              console.error('Square initialization error:', error);
              document.getElementById('card-container').innerHTML = \`
                <p style="padding: 20px; background: #f8d7da; border-radius: 4px; color: #721c24;">
                  Square SDKの初期化に失敗しました: \${error.message}
                </p>
              \`;
              document.getElementById('payment-button').disabled = true;
            }
          }

          async function handlePayment() {
            const button = document.getElementById('payment-button');
            const statusDiv = document.getElementById('payment-status');
            
            button.disabled = true;
            button.textContent = '処理中...';
            statusDiv.innerHTML = '';
            
            try {
              // カード情報をトークン化
              const result = await card.tokenize();
              
              if (result.status === 'OK') {
                // サーバーに決済リクエストを送信
                const response = await fetch(\`/api/payments/\${PAYMENT_ID}/complete\`, {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + localStorage.getItem('token')
                  },
                  body: JSON.stringify({ 
                    sourceId: result.token,
                    paymentMethod: 'card'
                  })
                });

                const data = await response.json();

                if (response.ok) {
                  statusDiv.innerHTML = '<div class="message success">決済が完了しました！3秒後にダッシュボードに戻ります...</div>';
                  setTimeout(() => {
                    window.location.href = '/dashboard';
                  }, 3000);
                } else {
                  throw new Error(data.error || '決済に失敗しました');
                }
              } else {
                throw new Error(result.errors ? result.errors[0].message : '決済に失敗しました');
              }

            } catch (error) {
              console.error('Payment error:', error);
              statusDiv.innerHTML = \`<div class="message error">決済に失敗しました: \${error.message}</div>\`;
              button.disabled = false;
              button.textContent = '決済を実行';
            }
          }

          initializeSquare();
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
    console.error('Square payment page error:', error)
    return NextResponse.json({ error: '決済ページの表示に失敗しました' }, { status: 500 })
  }
}

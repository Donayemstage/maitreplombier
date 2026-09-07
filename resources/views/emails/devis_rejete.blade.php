<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Information concernant votre demande de devis - Maître Plombier</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 20px;
            color: #1e293b;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #334155;
            color: #ffffff;
            padding: 26px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 6px 0;
            font-size: 22px;
            font-weight: 800;
        }
        .header p {
            margin: 0;
            font-size: 13px;
            opacity: 0.85;
        }
        .content {
            padding: 28px;
        }
        .welcome-box {
            background-color: #f8fafc;
            border-left: 4px solid #64748b;
            padding: 14px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 600;
            color: #334155;
            margin-bottom: 20px;
        }
        .reason-card {
            background-color: #fff1f2;
            border: 1px solid #fecdd3;
            border-radius: 12px;
            padding: 18px;
            margin: 20px 0;
        }
        .reason-title {
            color: #be123c;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 8px;
            display: flex;
            align-items: center;
            gap: 6px;
        }
        .reason-text {
            color: #881337;
            font-size: 14px;
            line-height: 1.5;
            margin: 0;
        }
        .btn-whatsapp {
            display: block;
            text-align: center;
            padding: 13px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            background-color: #10b981;
            color: #ffffff !important;
            margin-top: 20px;
        }
        .footer {
            background-color: #f8fafc;
            padding: 18px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>MAÎTRE PLOMBIER</h1>
            <p>Service & Dépannage Plomberie</p>
        </div>

        <div class="content">
            <div class="welcome-box">
                Bienvenue au sein de la structure Maître Plombier pour toutes vos préoccupations en plomberie.
            </div>

            <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
                Bonjour <strong>{{ $contact->nom }}</strong>,<br>
                Nous vous remercions pour l'intérêt que vous portez à nos services. Après étude attentive de votre demande relative à votre intervention (<strong>{{ $contact->type_intervention }}</strong> à {{ $contact->ville }}), nous avons le regret de vous informer que nous ne pouvons pas donner une suite favorable à cette dernière.
            </p>

            <div class="reason-card">
                <div class="reason-title">
                    ⚠️ Motif du non-traitement de la demande :
                </div>
                <p class="reason-text">
                    {{ $motif }}
                </p>
            </div>

            <p style="font-size: 14px; line-height: 1.6; color: #475569;">
                Nous restons bien évidemment à votre disposition pour vos futurs besoins en plomberie, installations sanitaires ou urgences.
            </p>

            <a href="{{ $whatsappUrl }}" class="btn-whatsapp" target="_blank">
                💬 Échanger avec nous sur WhatsApp (+237 678 95 30 71)
            </a>
        </div>

        <div class="footer">
            <strong>Maître Plombier</strong> • Douala, Cameroun<br>
            Téléphone & WhatsApp : +237 678 95 30 71
        </div>
    </div>
</body>
</html>

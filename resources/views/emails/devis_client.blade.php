<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Votre Devis Officiel - Maître Plombier</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
            background-color: #f1f5f9;
            margin: 0;
            padding: 20px;
            color: #1e293b;
        }
        .container {
            max-width: 620px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            border: 1px solid #e2e8f0;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
        }
        .header {
            background-color: #1d4ed8;
            color: #ffffff;
            padding: 30px;
            text-align: center;
        }
        .header h1 {
            margin: 0 0 8px 0;
            font-size: 24px;
            font-weight: 800;
            letter-spacing: -0.5px;
        }
        .header p {
            margin: 0;
            font-size: 13px;
            opacity: 0.9;
        }
        .content {
            padding: 30px;
        }
        .welcome-box {
            background-color: #eff6ff;
            border-left: 4px solid #3b82f6;
            padding: 16px 20px;
            border-radius: 8px;
            font-size: 15px;
            font-weight: 600;
            color: #1e40af;
            margin-bottom: 24px;
            line-height: 1.5;
        }
        .info-grid {
            margin-bottom: 24px;
            font-size: 14px;
        }
        .info-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #f1f5f9;
        }
        .info-label {
            color: #64748b;
        }
        .info-val {
            font-weight: 600;
            color: #0f172a;
        }
        .table-devis {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
            font-size: 14px;
        }
        .table-devis th {
            background-color: #f8fafc;
            padding: 12px 14px;
            text-align: left;
            font-weight: 700;
            color: #475569;
            border-bottom: 2px solid #e2e8f0;
            text-transform: uppercase;
            font-size: 11px;
            letter-spacing: 0.5px;
        }
        .table-devis td {
            padding: 12px 14px;
            border-bottom: 1px solid #f1f5f9;
        }
        .total-box {
            background-color: #0f172a;
            color: #ffffff;
            padding: 18px 20px;
            border-radius: 12px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 15px;
            margin-bottom: 25px;
        }
        .total-title {
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
            color: #94a3b8;
            font-weight: 600;
        }
        .total-amount {
            font-size: 24px;
            font-weight: 800;
            color: #60a5fa;
        }
        .btn {
            display: block;
            text-align: center;
            padding: 14px 20px;
            border-radius: 10px;
            text-decoration: none;
            font-weight: 700;
            font-size: 14px;
            margin-bottom: 12px;
        }
        .btn-primary {
            background-color: #2563eb;
            color: #ffffff !important;
        }
        .btn-whatsapp {
            background-color: #10b981;
            color: #ffffff !important;
        }
        .footer {
            background-color: #f8fafc;
            padding: 20px;
            text-align: center;
            font-size: 12px;
            color: #94a3b8;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- HEADER -->
        <div class="header">
            <h1>MAÎTRE PLOMBIER</h1>
            <p>Plomberie Sanitaire • Dépannage Rapide • Douala & Environs</p>
        </div>

        <!-- CONTENT -->
        <div class="content">
            <!-- MESSAGE D'ACCUEIL OBLIGATOIRE -->
            <div class="welcome-box">
                Bienvenue au sein de la structure Maître Plombier pour toutes vos préoccupations en plomberie.
            </div>

            <p style="font-size: 15px; line-height: 1.6; margin-top: 0;">
                Bonjour <strong>{{ $contact->nom }}</strong>,<br>
                Faisant suite à votre demande de devis pour vos travaux de plomberie, nos équipes ont chiffré votre intervention avec précision. Veuillez trouver ci-dessous le détail de votre proposition :
            </p>

            <table class="table-devis">
                <thead>
                    <tr>
                        <th>Désignation</th>
                        <th style="text-align: right;">Montant</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Main d'œuvre & Réalisation</strong></td>
                        <td style="text-align: right; font-weight: 600;">{{ number_format((float)$devis->montant_main_oeuvre, 0, ',', ' ') }} FCFA</td>
                    </tr>
                    @if((float)$devis->montant_materiel > 0)
                    <tr>
                        <td>Fournitures & Pièces détachées</td>
                        <td style="text-align: right; font-weight: 600;">{{ number_format((float)$devis->montant_materiel, 0, ',', ' ') }} FCFA</td>
                    </tr>
                    @endif
                    @if((float)$devis->frais_deplacement > 0)
                    <tr>
                        <td>Déplacement sur site ({{ $contact->ville }})</td>
                        <td style="text-align: right; font-weight: 600;">{{ number_format((float)$devis->frais_deplacement, 0, ',', ' ') }} FCFA</td>
                    </tr>
                    @endif
                </tbody>
            </table>

            <!-- TOTAL BOX -->
            <div class="total-box">
                <div class="total-title">Total du Devis</div>
                <div class="total-amount">{{ number_format((float)$devis->total_devis, 0, ',', ' ') }} FCFA</div>
            </div>

            @if($devis->conditions_execution)
            <div style="background: #f8fafc; padding: 14px; border-radius: 8px; font-size: 13px; color: #475569; margin-bottom: 20px;">
                <strong>Conditions & Remarques :</strong><br>
                {{ $devis->conditions_execution }}
            </div>
            @endif

            @if($devis->date_validite)
            <p style="font-size: 13px; color: #64748b; margin-bottom: 25px;">
                📅 <em>Ce devis est valable jusqu'au {{ \Carbon\Carbon::parse($devis->date_validite)->format('d/m/Y') }}.</em>
            </p>
            @endif

            <!-- ACTIONS / BOUTONS -->
            <div style="margin-top: 25px;">
                <a href="{{ $consultUrl }}" class="btn btn-primary" target="_blank">
                    📄 Consulter, Télécharger & Imprimer mon Devis
                </a>

                <a href="{{ $whatsappUrl }}" class="btn btn-whatsapp" target="_blank">
                    💬 Poursuivre la conversation sur WhatsApp (Confirmer / Refuser)
                </a>
            </div>

            <p style="font-size: 13px; color: #64748b; text-align: center; margin-top: 15px;">
                Vous pouvez également enregistrer ou imprimer le devis directement depuis votre téléphone ou ordinateur.
            </p>
        </div>

        <!-- FOOTER -->
        <div class="footer">
            <strong>Maître Plombier</strong> • Douala, Cameroun<br>
            Téléphone & WhatsApp : +237 678 95 30 71<br>
            Service disponible 7j/7 pour les urgences
        </div>
    </div>
</body>
</html>

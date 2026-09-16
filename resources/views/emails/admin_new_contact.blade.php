<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Nouvelle Demande de Devis</title>
</head>
<body style="font-family: Arial, sans-serif; color: #333;">
    <h2>Nouvelle demande de devis reçue !</h2>
    <p>Un client vient de soumettre une demande sur le site de Maître Plombier.</p>
    
    <hr>
    <ul>
        <li><strong>Nom :</strong> {{ $contact->nom }}</li>
        <li><strong>Téléphone :</strong> {{ $contact->telephone }}</li>
        <li><strong>Email :</strong> {{ $contact->email }}</li>
        <li><strong>Ville :</strong> {{ $contact->ville }}</li>
        <li><strong>Adresse :</strong> {{ $contact->adresse }}</li>
        <li><strong>Type d'intervention :</strong> {{ $contact->type_intervention }}</li>
        <li><strong>Urgence :</strong> {{ $contact->urgence }}</li>
        <li><strong>Date souhaitée :</strong> {{ $contact->date_intervention }} à {{ $contact->heure_intervention ?? 'Non spécifiée' }}</li>
    </ul>
    
    <p><strong>Message du client :</strong></p>
    <p style="background: #f4f4f4; padding: 10px; border-radius: 5px;">{{ $contact->message }}</p>
    
    <p>Connectez-vous à votre <a href="{{ url('/admin/devis') }}">tableau de bord administrateur</a> pour répondre et générer le devis officiel.</p>
</body>
</html>
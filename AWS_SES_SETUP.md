# Configuration AWS SES pour l'envoi d'emails

## 📧 Vue d'ensemble

MyKalamaenglish utilise **AWS SES (Simple Email Service)** pour envoyer des emails automatiques :

1. **Email de bienvenue** aux étudiants après validation par l'admin
2. **Email de notification** à `mykalamaenglish@gmail.com` pour chaque nouvelle inscription

## 🔧 Configuration requise

### Étape 1 : Créer un compte AWS (si vous n'en avez pas)

1. Allez sur [aws.amazon.com](https://aws.amazon.com)
2. Cliquez sur "Créer un compte AWS"
3. Suivez les instructions

### Étape 2 : Configurer AWS SES

1. **Connectez-vous à AWS Console** : [console.aws.amazon.com](https://console.aws.amazon.com)

2. **Accédez à AWS SES** :
   - Dans la barre de recherche, tapez "SES"
   - Sélectionnez "Simple Email Service"
   - Choisissez une région (par exemple : `us-east-1`)

3. **Vérifier votre adresse email d'envoi** :
   - Allez dans **"Verified identities"**
   - Cliquez sur **"Create identity"**
   - Sélectionnez **"Email address"**
   - Entrez : `papemansour01@gmail.com`
   - Cliquez sur **"Create identity"**
   - Allez dans votre boîte Gmail et cliquez sur le lien de vérification

4. **Vérifier l'adresse email de destination** (requis en mode Sandbox) :
   - Répétez l'étape 3 pour : `mykalamaenglish@gmail.com`
   - Vérifiez également cette adresse email

5. **Sortir du mode Sandbox (IMPORTANT)** :
   - En mode Sandbox, vous ne pouvez envoyer qu'aux adresses vérifiées
   - Pour envoyer à n'importe quelle adresse :
     - Allez dans **"Account dashboard"**
     - Cliquez sur **"Request production access"**
     - Remplissez le formulaire :
       * Use case: "Transactional emails"
       * Website URL: votre site
       * Description: "Educational platform sending welcome emails to students"
     - AWS répondra généralement en 24h

### Étape 3 : Créer des credentials IAM

1. **Créer un utilisateur IAM** :
   - Allez dans **IAM** (Identity and Access Management)
   - Cliquez sur **"Users"** → **"Add users"**
   - Nom d'utilisateur : `ses-emailer`
   - Type d'accès : **"Access key - Programmatic access"**
   - Cliquez sur **"Next: Permissions"**

2. **Attacher la politique SES** :
   - Sélectionnez **"Attach existing policies directly"**
   - Recherchez et cochez : **`AmazonSESFullAccess`**
   - Cliquez sur **"Next"** puis **"Create user"**

3. **Sauvegarder les credentials** :
   - ⚠️ **IMPORTANT** : Copiez et sauvegardez :
     * `Access key ID`
     * `Secret access key`
   - Vous ne pourrez plus voir le secret après cette étape !

### Étape 4 : Configurer l'application

Ajoutez les credentials dans le fichier `/app/backend/.env` :

```bash
AWS_ACCESS_KEY_ID="votre_access_key_id"
AWS_SECRET_ACCESS_KEY="votre_secret_access_key"
AWS_REGION="us-east-1"
AWS_SES_SENDER_EMAIL="papemansour01@gmail.com"
```

### Étape 5 : Redémarrer le backend

```bash
sudo supervisorctl restart backend
```

## ✅ Test de l'envoi d'emails

Une fois configuré, testez l'envoi :

1. **Test de notification admin** :
   - Inscrivez un nouvel étudiant depuis le site
   - Vérifiez que `mykalamaenglish@gmail.com` reçoit un email

2. **Test d'email de bienvenue** :
   - Connectez-vous en tant qu'admin
   - Approuvez une inscription en attente
   - L'étudiant devrait recevoir un email de bienvenue

## 🔍 Vérification des logs

Pour voir les logs d'emails :

```bash
tail -f /var/log/supervisor/backend.err.log | grep -E "Email|email"
```

## 📊 Limites AWS SES

### Mode Sandbox (par défaut)
- ❌ Peut envoyer uniquement aux adresses vérifiées
- ✅ 200 emails par jour
- ✅ 1 email par seconde

### Mode Production (après approbation)
- ✅ Peut envoyer à n'importe quelle adresse
- ✅ 50,000 emails par jour (augmentable)
- ✅ 14 emails par seconde

## 💰 Tarification

- **GRATUIT** pour les 62,000 premiers emails par mois
- Ensuite : $0.10 par 1,000 emails
- Très économique pour une plateforme éducative !

## 🆘 Dépannage

### Erreur : "Email address is not verified"
- Vérifiez que `papemansour01@gmail.com` est vérifié dans AWS SES
- En mode Sandbox, vérifiez aussi `mykalamaenglish@gmail.com`

### Erreur : "Access Denied"
- Vérifiez que l'utilisateur IAM a la politique `AmazonSESFullAccess`
- Vérifiez que les credentials dans `.env` sont corrects

### Les emails ne sont pas reçus
- Vérifiez les spams/courriers indésirables
- Vérifiez les logs : `tail -f /var/log/supervisor/backend.err.log`
- Vérifiez le statut d'envoi dans AWS SES Console

## 📧 Templates d'emails

L'application envoie deux types d'emails :

### 1. Email de bienvenue (étudiant)
- Design HTML professionnel
- Contient les identifiants de connexion
- Mot de passe KALAMATHÈQUE
- Lien direct pour se connecter
- Rappel de changer le mot de passe

### 2. Email de notification (admin)
- Alerte pour nouvelle inscription
- Informations complètes de l'étudiant
- Lien direct vers le dashboard admin
- Format professionnel et clair

## 🎨 Personnalisation

Les templates d'email se trouvent dans `/app/backend/email_service.py`.

Vous pouvez personnaliser :
- Les couleurs (actuellement : teal/vert)
- Le contenu des messages
- Les liens
- Le footer

---

**Note** : Sans credentials AWS SES, l'application fonctionne normalement mais les emails sont seulement loggés dans les logs backend. Les utilisateurs peuvent toujours utiliser la plateforme, mais doivent être informés manuellement de leurs identifiants.

# Tâches Restantes à Implémenter

## ✅ Tâches Complétées
1. **Badge rouge notification** - Fermera le popover après "tout lire" ✅
2. **KALAMAENGLISH ADMIN en vert** - Changé de bleu à vert ✅

## 🔄 Tâches En Cours / À Finaliser

### 3. Message groupé pour professeur
**Statut**: Non implémenté
**Description**: Si un prof a plus d'un étudiant assigné, il doit pouvoir faire un message groupé
**Localisation**: `/app/frontend/src/pages/TeacherDashboard.js` - Onglet Messages
**Approche suggérée**:
- Ajouter un bouton "Mode sélection multiple"
- Permettre la sélection de plusieurs étudiants
- Créer un endpoint backend `/api/messages/send-group` pour envoyer à plusieurs destinataires
- Créer une interface similaire à celle de l'Admin (voir AdminDashboard Discussion tab)

### 4. Classement KALAMA CLUB (Admin uniquement)
**Statut**: Non implémenté
**Description**: 
- Seul l'admin peut créer/modifier le classement
- Sélectionner des étudiants ou profs
- Les classer du 1er au 10e rang
- Médailles: 🥇 Or (1er), 🥈 Argent (2e), 🥉 Bronze (3e)

**Localisation**: `/app/frontend/src/components/KalamaClub.js`

**Approche suggérée**:
1. Backend:
```python
# Nouveau modèle
class LeaderboardEntry(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()))
    user_id: str
    user_name: str
    user_role: str
    rank: int  # 1-10
    created_by: str  # Admin ID
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# Nouveaux endpoints
@api_router.post("/club/leaderboard")  # Admin crée le classement
@api_router.get("/club/leaderboard")   # Tous peuvent voir
@api_router.put("/club/leaderboard/{user_id}")  # Admin modifie le rang
@api_router.delete("/club/leaderboard/{user_id}")  # Admin retire du classement
```

2. Frontend:
- Onglet "Classement" dans KalamaClub
- Si userRole === 'admin':
  - Afficher interface de gestion avec drag & drop
  - Liste de tous les users à droite
  - Classement 1-10 à gauche
  - Boutons pour ajouter/retirer
- Si userRole !== 'admin':
  - Afficher seulement le classement en lecture seule
  - Avec médailles animées

### 5. Problèmes avec Documents Espace Étudiant
**Statut**: Partiellement résolu - Nécessite tests
**Description**:
- Corriger erreur de suppression
- Supprimer les documents existants qui posent problème
- Activer fonctionnalités pour PDF, Word, PowerPoint, liens
- Actions: Visualiser, Ouvrir, Télécharger, Supprimer

**Localisation**: `/app/frontend/src/pages/StudentDashboard.js` - TabsContent "documents"

**Vérifications nécessaires**:
1. Tester la suppression de documents
2. Vérifier que la modale de prévisualisation fonctionne pour:
   - PDF (iframe)
   - Images (img tag)
   - Word/PowerPoint (message "Ouvrir dans un nouvel onglet")
   - Liens (redirection)

**Code déjà implémenté**:
- Modale de prévisualisation existe déjà (lines 556-623 StudentDashboard.js)
- Boutons Visualiser, Ouvrir, Télécharger, Supprimer existent

**Actions à faire**:
1. Identifier et supprimer les documents qui causent des erreurs via MongoDB:
```bash
# Se connecter à MongoDB
docker exec -it mongodb mongosh

# Utiliser la base de données
use kalamaenglish

# Lister les documents problématiques
db.documents.find()

# Supprimer un document spécifique
db.documents.deleteOne({id: "ID_DU_DOCUMENT_PROBLEMATIQUE"})

# Ou supprimer tous les documents de test
db.documents.deleteMany({title: {$regex: /test/i}})
```

2. Tester chaque type de fichier:
   - Uploader un PDF → Visualiser, Ouvrir, Télécharger, Supprimer
   - Uploader une image → idem
   - Ajouter un lien Google Drive → idem
   - Uploader Word/PowerPoint → idem

## 📋 Ordre de Priorité Suggéré
1. **Documents Étudiant** (P0) - Fonctionnalité critique
2. **Classement KALAMA CLUB** (P1) - Fonctionnalité demandée
3. **Message groupé Prof** (P2) - Amélioration UX

## 🛠️ Notes Techniques
- Tous les changements frontend nécessitent un restart: `sudo supervisorctl restart frontend`
- Tous les changements backend nécessitent un restart: `sudo supervisorctl restart backend`
- Pour tester les endpoints: `curl -X GET http://localhost:8001/api/...`
- Pour vérifier les logs: `tail -f /var/log/supervisor/backend.err.log`

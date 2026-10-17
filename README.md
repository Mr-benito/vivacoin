# VivaCoin DApp — interface web

## Fichiers
- `index.html` : structure et pages de l'application
- `styles.css` : design responsive
- `app.js` : connexion MetaMask et appels au contrat fourni

## Lancer
Ouvrir le dossier avec un serveur local (par exemple VS Code Live Server). `ethers.js` est chargé depuis jsDelivr, donc une connexion internet est nécessaire. Ouvrir directement `index.html` peut aussi fonctionner selon le navigateur, mais un serveur local est préférable.

## Configuration actuelle
- Adresse configurée : `0xdfB35aAc60cae37c7312fc3b2B99DE842471dEE6`
- Symbole UI : `VCN`
- ABI : fonctions mentionnées dans le contrat et fonctions ERC-20 de lecture
- Réseau : sélectionnez dans MetaMask le réseau exact sur lequel le contrat a été déployé.

## Important — ne pas activer la revente avant correction du contrat
Dans le contrat donné, `acheterTokens()` fait `montantTokens = msg.value * TAUX_ECHANGE`. Avec 18 décimales, le taux correspond à 1 ETH -> 1000 VCN si la quantité est traitée en unités brutes.

Cependant, `vendreTokens()` calcule :
```solidity
uint256 montantETH = (_montantTokens * 1 ether) / TAUX_ECHANGE;
```
Comme `_montantTokens` est un montant ERC-20 en unités brutes (18 décimales), cette formule multiplie par `1 ether` une valeur qui contient déjà le facteur `10^18`. Le remboursement est surévalué d'un facteur `10^18`, et la vérification de réserve fera normalement échouer la vente.

Pour un taux de 1 ETH = 1000 VCN et un token à 18 décimales, la formule d'un remboursement proportionnel serait généralement :
```solidity
uint256 montantETH = _montantTokens / TAUX_ECHANGE;
```
Cela doit être validé avec la logique économique voulue et testé avant de redéployer. L'interface bloque volontairement la revente tant que cette correction n'est pas déployée. Une modification du contrat déjà déployé ne peut pas être faite depuis le front-end.

## Autres points
- `produits` est indexé de 1 à `nombreProduits` dans le contrat fourni. Le front-end parcourt maintenant `1..nombreProduits`.
- L'historique d'activité est local à la session, pas un indexeur blockchain permanent.
- Le lien Etherscan de transaction dans l'historique est un lien générique Ethereum Mainnet. Si le contrat est sur un testnet ou une autre chaîne, adaptez-le au bon explorateur.
- Aucun prix de marché fictif n'est affiché comme un cours réel.
- Ne demandez jamais la clé privée ou la phrase de récupération des utilisateurs.

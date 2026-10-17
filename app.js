// app.js - DApp VivaCoin (VCN)

// Remplace 0xMETTRE_LA_NOUVELLE_ADRESSE_ICI par ton adresse Remix copiée
const contractAddress = "0xdfB35aAc60cae37c7312fc3b2B99DE842471dEE6";

const contractABI = [
	{
		"inputs": [{ "internalType": "uint256", "name": "_produitId", "type": "uint256" }],
		"name": "acheterProduit",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "acheterTokens",
		"outputs": [],
		"stateMutability": "payable",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "uint256", "name": "_montantTokens", "type": "uint256" }],
		"name": "vendreTokens",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "address", "name": "account", "type": "address" }],
		"name": "balanceOf",
		"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "nombreProduits",
		"outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }],
		"name": "produits",
		"outputs": [
			{ "internalType": "uint256", "name": "id", "type": "uint256" },
			{ "internalType": "string", "name": "nom", "type": "string" },
			{ "internalType": "uint256", "name": "prixEnTokens", "type": "uint256" }
		],
		"stateMutability": "view",
		"type": "function"
	}
];

let provider;
let signer;
let contract;
let userAccount;

async function connecterMetaMask() {
    if (typeof window.ethereum !== 'undefined') {
        try {
            const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
            userAccount = accounts[0];
            
            provider = new ethers.providers.Web3Provider(window.ethereum);
            signer = provider.getSigner();
            contract = new ethers.Contract(contractAddress, contractABI, signer);

            document.getElementById('userAddress').innerText = userAccount.substring(0, 6) + "..." + userAccount.substring(userAccount.length - 4);
            document.getElementById('connectBtn').innerText = "Connecté ✅";
            document.getElementById('connectBtn').style.borderColor = "#00ff7f";

            chargerSolde();
            chargerProduits();
        } catch (error) {
            console.error("Erreur de connexion :", error);
            alert("Connexion refusée.");
        }
    } else {
        alert("Veuillez installer MetaMask !");
    }
}

async function chargerSolde() {
    if (!contract) return;
    try {
        const balanceWei = await contract.balanceOf(userAccount);
        const balanceVCN = ethers.utils.formatUnits(balanceWei, 18);
        document.getElementById('userBalance').innerText = parseFloat(balanceVCN).toFixed(2);
    } catch (error) {
        console.error("Erreur chargement solde :", error);
    }
}

async function acheterTokens() {
    if (!contract) return alert("Connectez MetaMask !");
    const ethAmount = document.getElementById('ethAmount').value;
    if (!ethAmount || ethAmount <= 0) return alert("Saisissez un montant valide en ETH.");

    try {
        const txValue = ethers.utils.parseEther(ethAmount);
        const tx = await contract.acheterTokens({ value: txValue });
        alert("Transaction d'achat envoyée...");
        await tx.wait();
        alert("Achat de VivaCoins réussi ! ");
        chargerSolde();
    } catch (error) {
        console.error("Erreur achat :", error);
        alert("Échec de l'achat.");
    }
}

async function vendreTokens() {
    if (!contract) return alert("Connectez MetaMask !");
    const vcnAmount = document.getElementById('vcnAmount').value;
    if (!vcnAmount || vcnAmount <= 0) return alert("Saisissez un montant valide de VCN.");

    try {
        const tx = await contract.vendreTokens(vcnAmount);
        alert("Transaction de revente envoyée...");
        await tx.wait();
        alert("Revente réussie ! Vous avez récupéré vos ETH ");
        chargerSolde();
    } catch (error) {
        console.error("Erreur revente :", error);
        alert("Échec de la revente. Vérifiez que la réserve du contrat dispose de suffisamment d'ETH.");
    }
}

async function chargerProduits() {
    const productList = document.getElementById('productList');
    if (!productList) return;
    productList.innerHTML = "<p>Chargement des produits...</p>";

    try {
        const nbProduits = await contract.nombreProduits();
        productList.innerHTML = "";

        if (nbProduits.toNumber() === 0) {
            productList.innerHTML = "<p>Aucun produit disponible.</p>";
            return;
        }

        // On commence à i = 1 si ton ID de produit commence à 1 dans Solidity
        for (let i = 1; i <= nbProduits.toNumber(); i++) {
            const produit = await contract.produits(i);
            
            // Sécurité si le produit n'existe pas ou a un nom vide
            if (!produit.nom || produit.nom === "") continue;

            // Conversion propre des Wei vers des VCN lisibles (18 décimales)
            const prixFormate = ethers.utils.formatUnits(produit.prixEnTokens, 18);

            const produitDiv = document.createElement('div');
            produitDiv.className = 'product-item';
            produitDiv.innerHTML = `
                <h3>${produit.nom}</h3>
                <p>Prix : <span>${parseFloat(prixFormate)} VCN</span></p>
                <button onclick="acheterProduit(${produit.id})">ACHETER</button>
            `;
            productList.appendChild(produitDiv);
        }
    } catch (error) {
        console.error("Erreur produits :", error);
        productList.innerHTML = "<p>Erreur lors du chargement de la boutique.</p>";
    }
}

async function acheterProduit(produitId) {
    if (!contract) return;
    try {
        const tx = await contract.acheterProduit(produitId);
        alert("Achat du produit en cours...");
        await tx.wait();
        alert("Produit acheté avec succès ! ");
        chargerSolde();
    } catch (error) {
        console.error("Erreur achat produit :", error);
        alert("Échec de l'achat.");
    }
}
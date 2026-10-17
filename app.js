// VivaCoin DApp — UI connectée au contrat fourni.
// Réseau à sélectionner dans MetaMask : celui où le contrat a été déployé.
// Sécurité : aucune clé privée n'est demandée ni stockée.

const contractAddress = "0x4E2B244D089Ef2796888F22bbFDC511543449b10";
const contractABI = [{"inputs":[{"internalType":"uint256","name":"_produitId","type":"uint256"}],"name":"acheterProduit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[],"name":"acheterTokens","outputs":[],"stateMutability":"payable","type":"function"},{"inputs":[{"internalType":"string","name":"_nom","type":"string"},{"internalType":"uint256","name":"_prixEnTokens","type":"uint256"}],"name":"ajouterProduit","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"approve","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"string","name":"nomCrypto","type":"string"},{"internalType":"string","name":"symboleCrypto","type":"string"}],"stateMutability":"nonpayable","type":"constructor"},{"inputs":[{"internalType":"address","name":"spender","type":"address"},{"internalType":"uint256","name":"allowance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientAllowance","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"},{"internalType":"uint256","name":"balance","type":"uint256"},{"internalType":"uint256","name":"needed","type":"uint256"}],"name":"ERC20InsufficientBalance","type":"error"},{"inputs":[{"internalType":"address","name":"approver","type":"address"}],"name":"ERC20InvalidApprover","type":"error"},{"inputs":[{"internalType":"address","name":"receiver","type":"address"}],"name":"ERC20InvalidReceiver","type":"error"},{"inputs":[{"internalType":"address","name":"sender","type":"address"}],"name":"ERC20InvalidSender","type":"error"},{"inputs":[{"internalType":"address","name":"spender","type":"address"}],"name":"ERC20InvalidSpender","type":"error"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"owner","type":"address"},{"indexed":true,"internalType":"address","name":"spender","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Approval","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"acheteur","type":"address"},{"indexed":false,"internalType":"uint256","name":"produitId","type":"uint256"},{"indexed":false,"internalType":"string","name":"nomProduit","type":"string"},{"indexed":false,"internalType":"uint256","name":"prix","type":"uint256"}],"name":"ProduitAchete","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"acheteur","type":"address"},{"indexed":false,"internalType":"uint256","name":"montantETH","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"montantTokens","type":"uint256"}],"name":"TokensAchetes","type":"event"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"vendeur","type":"address"},{"indexed":false,"internalType":"uint256","name":"montantTokens","type":"uint256"},{"indexed":false,"internalType":"uint256","name":"montantETH","type":"uint256"}],"name":"TokensVendus","type":"event"},{"inputs":[{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transfer","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"anonymous":false,"inputs":[{"indexed":true,"internalType":"address","name":"from","type":"address"},{"indexed":true,"internalType":"address","name":"to","type":"address"},{"indexed":false,"internalType":"uint256","name":"value","type":"uint256"}],"name":"Transfer","type":"event"},{"inputs":[{"internalType":"address","name":"from","type":"address"},{"internalType":"address","name":"to","type":"address"},{"internalType":"uint256","name":"value","type":"uint256"}],"name":"transferFrom","outputs":[{"internalType":"bool","name":"","type":"bool"}],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"uint256","name":"_montantTokens","type":"uint256"}],"name":"vendreTokens","outputs":[],"stateMutability":"nonpayable","type":"function"},{"inputs":[{"internalType":"address","name":"owner","type":"address"},{"internalType":"address","name":"spender","type":"address"}],"name":"allowance","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"address","name":"account","type":"address"}],"name":"balanceOf","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"decimals","outputs":[{"internalType":"uint8","name":"","type":"uint8"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"name","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"nombreProduits","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"owner","outputs":[{"internalType":"address","name":"","type":"address"}],"stateMutability":"view","type":"function"},{"inputs":[{"internalType":"uint256","name":"","type":"uint256"}],"name":"produits","outputs":[{"internalType":"uint256","name":"id","type":"uint256"},{"internalType":"string","name":"nom","type":"string"},{"internalType":"uint256","name":"prixEnTokens","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"symbol","outputs":[{"internalType":"string","name":"","type":"string"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"TAUX_ECHANGE","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"},{"inputs":[],"name":"totalSupply","outputs":[{"internalType":"uint256","name":"","type":"uint256"}],"stateMutability":"view","type":"function"}];
const EXCHANGE_RATE = 1000;
let provider = null, signer = null, contract = null, userAccount = null, tokenDecimals = 18;
let activity = [];
let pendingAction = null;

const $ = (id) => document.getElementById(id);
const shortAddress = (a) => a ? `${a.slice(0, 6)}…${a.slice(-4)}` : "Non connecté";
const fmt = (n, max = 4) => Number(n).toLocaleString("fr-FR", {maximumFractionDigits:max});
const fmtUnits = (raw, max = 4) => fmt(Number(ethers.utils.formatUnits(raw, tokenDecimals)), max);
function notify(title, message, type = "info") {
  $("toastTitle").textContent = title; $("toastMessage").textContent = message;
  $("toast").classList.add("show");
  $("toast").dataset.type = type;
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => $("toast").classList.remove("show"), 6000);
}
$("toastClose").addEventListener("click", () => $("toast").classList.remove("show"));
function shortError(err) {
  const msg = err?.error?.message || err?.data?.message || err?.reason || err?.message || "Erreur inconnue";
  if (err?.code === 4001 || /user rejected|user denied|rejected the request/i.test(msg)) return "Transaction refusée dans MetaMask.";
  if (/insufficient funds/i.test(msg)) return "Fonds ETH insuffisants pour couvrir le montant et les frais de gas.";
  if (/Reserve ETH du contrat insuffisante/i.test(msg)) return "La réserve ETH du contrat ne suffit pas pour cette revente.";
  if (/Solde de tokens insuffisant|insufficient/i.test(msg)) return "Solde VCN insuffisant pour cette opération.";
  return msg.length > 210 ? msg.slice(0, 207) + "…" : msg;
}
function openConfirm(title, message, symbol, action) {
  pendingAction = action; $("modalTitle").textContent = title; $("modalText").textContent = message;
  $("modalSymbol").textContent = symbol; $("confirmModal").classList.remove("hidden");
}
function closeConfirm() { $("confirmModal").classList.add("hidden"); pendingAction = null; }
$("modalCancel").addEventListener("click", closeConfirm);
$("modalConfirm").addEventListener("click", async () => {
  const action = pendingAction; closeConfirm();
  if (action) await action();
});
function setConnectedUI() {
  $("connectBtn").innerHTML = userAccount ? `✓ <span>${shortAddress(userAccount)}</span>` : `◈ <span>Connecter MetaMask</span>`;
  $("walletTag").textContent = userAccount ? "Wallet connecté" : "Wallet déconnecté";
  $("connectionMetric").textContent = userAccount ? "Connecté" : "Non connecté";
  $("connectionSub").textContent = userAccount ? shortAddress(userAccount) : "MetaMask requis";
  $("heroAddress").textContent = userAccount ? userAccount : "Connectez votre portefeuille pour consulter votre solde.";
  $("fullAddress").textContent = userAccount || "Adresse du wallet non disponible";
  $("walletPageStatus").textContent = userAccount ? "Wallet connecté" : "Wallet déconnecté";
  $("securityAccount").textContent = shortAddress(userAccount);
}
async function ensureReady() {
  if (!window.ethereum) { notify("MetaMask requis", "Installez MetaMask ou ouvrez cette page dans un navigateur compatible Web3."); return false; }
  if (!contract || !userAccount) { await connectWallet(); }
  return Boolean(contract && userAccount);
}
async function connectWallet() {
  if (!window.ethereum) { notify("MetaMask introuvable", "Installez l’extension MetaMask ou utilisez son navigateur mobile."); return; }
  if (!window.ethers) { notify("Bibliothèque indisponible", "La bibliothèque ethers.js n’a pas été chargée. Vérifiez votre connexion internet."); return; }
  try {
    const accounts = await window.ethereum.request({method:"eth_requestAccounts"});
    if (!accounts || !accounts.length) throw new Error("Aucun compte autorisé.");
    provider = new ethers.providers.Web3Provider(window.ethereum, "any");
    signer = provider.getSigner();
    userAccount = ethers.utils.getAddress(accounts[0]);
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    const network = await provider.getNetwork();
    tokenDecimals = Number(await contract.decimals().catch(() => 18));
    const symbol = await contract.symbol().catch(() => "VCN");
    $("networkStatus").textContent = "Wallet connecté";
    $("networkDetail").textContent = `${network.name || "Réseau"} · Chain ID ${network.chainId}`;
    $("securityNetwork").textContent = `${network.name || "Réseau"} · Chain ID ${network.chainId}`;
    $("connectBtn").title = `Compte ${userAccount} · Chain ID ${network.chainId}`;
    setConnectedUI();
    await Promise.allSettled([loadBalance(), loadProducts()]);
    notify("Wallet connecté", `Compte ${shortAddress(userAccount)} · ${symbol}. Vérifiez que ce réseau héberge bien votre contrat.`);
  } catch (err) {
    console.error("Connexion MetaMask:", err);
    notify("Connexion impossible", shortError(err), "error");
  }
}
async function loadBalance() {
  if (!contract || !userAccount) return;
  try {
    const balance = await contract.balanceOf(userAccount);
    const text = fmtUnits(balance, 6);
    $("heroBalance").textContent = text; $("walletBalance").textContent = text;
  } catch (err) {
    console.error("Lecture du solde:", err);
    $("heroBalance").textContent = "Indisponible"; $("walletBalance").textContent = "Indisponible";
    notify("Lecture du solde impossible", "Vérifiez le réseau sélectionné et l’adresse du contrat.");
  }
}
async function loadProducts() {
  const list = $("productList");
  if (!list) return;
  if (!contract) { list.innerHTML = '<div class="loading-card">Connectez MetaMask pour charger les produits depuis le contrat.</div>'; $("productCount").textContent = "—"; return; }
  list.innerHTML = '<div class="loading-card">Lecture des produits sur la blockchain…</div>';
  try {
    const countBN = await contract.nombreProduits();
    const count = countBN.toNumber();
    $("productCount").textContent = String(count);
    if (count === 0) { list.innerHTML = '<div class="loading-card">Aucun produit disponible dans ce contrat.</div>'; return; }
    const products = [];
    // IMPORTANT : le contrat fourni incrémente nombreProduits avant d'écrire produits[nombreProduits].
    // Les IDs commencent donc à 1, pas à 0.
    for (let id = 1; id <= count; id++) {
      try {
        const p = await contract.produits(id);
        if (p && p.prixEnTokens && !p.prixEnTokens.isZero()) products.push({id:p.id.toNumber(), name:p.nom, price:p.prixEnTokens});
      } catch (e) { console.warn(`Produit ${id} indisponible`, e); }
    }
    if (!products.length) { list.innerHTML = '<div class="loading-card">Impossible de lire les produits. Vérifiez le réseau et l’ABI.</div>'; return; }
    list.innerHTML = "";
    const icons = ["▤","▣","✦","◈","▧","✧"];
    products.forEach((p, i) => {
      const card = document.createElement("article"); card.className = "product-card";
      const art = document.createElement("div"); art.className = "product-art"; art.textContent = icons[i % icons.length];
      const title = document.createElement("h3"); title.textContent = p.name;
      const desc = document.createElement("p"); desc.textContent = "Produit disponible via le contrat VivaCoin.";
      const price = document.createElement("div"); price.className = "product-price"; price.textContent = `${fmtUnits(p.price, 4)} `; const small = document.createElement("small"); small.textContent = "VCN"; price.appendChild(small);
      const btn = document.createElement("button"); btn.className = "primary-btn full"; btn.textContent = "Acheter ce produit ↗";
      btn.addEventListener("click", () => openConfirm("Confirmer l’achat", `Produit : ${p.name}\nPrix : ${fmtUnits(p.price, 4)} VCN\nContrat : ${shortAddress(contractAddress)}\n\nLa transaction sera envoyée à MetaMask pour signature.`, "▣", () => buyProduct(p.id, p.name)));
      card.append(art, title, desc, price, btn); list.appendChild(card);
    });
  } catch (err) {
    console.error("Chargement des produits:", err);
    $("productCount").textContent = "Erreur";
    list.innerHTML = '<div class="loading-card">Impossible de charger les produits. Vérifiez le réseau sélectionné et la compatibilité du contrat.</div>';
  }
}
async function executeTx(label, txFactory) {
  if (!(await ensureReady())) return;
  try {
    notify(`${label} — préparation`, "Confirmez la transaction dans MetaMask. Ne fermez pas la fenêtre avant le résultat.");
    const tx = await txFactory();
    addActivity({label, hash:tx.hash, status:"En attente", when:new Date().toLocaleString("fr-FR")});
    notify("Transaction envoyée", `Hash : ${shortAddress(tx.hash)}. Attente de confirmation…`);
    renderActivity();
    const receipt = await tx.wait();
    updateActivity(tx.hash, receipt.status === 1 ? "Confirmée" : "Échec");
    if (receipt.status !== 1) throw new Error("La transaction a été exécutée en échec.");
    notify("Transaction confirmée", `${label} a été confirmée sur la blockchain.`);
    await Promise.allSettled([loadBalance(), loadProducts()]);
  } catch (err) {
    console.error(`${label}:`, err);
    notify("Opération échouée", shortError(err), "error");
  }
}
async function buyTokens(amount) {
  if (!(await ensureReady())) return;
  if (!Number.isFinite(amount) || amount <= 0) { notify("Montant invalide", "Saisissez un montant ETH supérieur à zéro."); return; }
  let value;
  try { value = ethers.utils.parseEther(String(amount)); } catch { notify("Montant invalide", "Vérifiez le format du montant ETH."); return; }
  openConfirm("Confirmer l’achat de VCN", `Montant envoyé : ${amount} ETH\nTaux annoncé dans le contrat : 1 ETH = ${EXCHANGE_RATE} unités de token\nRéseau : vérifiez le Chain ID dans MetaMask.\n\nLe contrat mint des tokens à l’achat. Des frais de gas s’appliquent.`, "＋", () => executeTx("Achat de VCN", () => contract.acheterTokens({value})));
}

async function sellTokens(amount) {
  if (!(await ensureReady())) return;

  if (!Number.isFinite(amount) || amount <= 0) {
    notify(
      "Montant invalide",
      "Saisissez un montant de VCN supérieur à zéro.",
      "error"
    );
    return;
  }

  try {
    // Convertir les VCN en unités ERC-20 (18 décimales)
    const amountRaw = ethers.utils.parseUnits(
      String(amount),
      tokenDecimals
    );

    // Vérifier le solde VCN
    const balance = await contract.balanceOf(userAccount);

    if (balance.lt(amountRaw)) {
      notify(
        "Solde VCN insuffisant",
        `Votre solde actuel est de ${fmtUnits(balance, 8)} VCN.`,
        "error"
      );
      return;
    }

    // Lire le taux directement depuis le contrat
    const rate = await contract.TAUX_ECHANGE();

    // Estimation du remboursement en ETH
    const estimatedWei = amountRaw.div(rate);
    const estimatedEth = ethers.utils.formatEther(estimatedWei);

    openConfirm(
      "Confirmer la revente de VCN",
      `Montant à revendre : ${amount} VCN\n` +
      `Remboursement estimé : ${estimatedEth} ETH\n\n` +
      "Le remboursement dépend du code du contrat et de sa réserve ETH.",
      "↘",
      () => executeTx(
        "Revente de VCN",
        () => contract.vendreTokens(amountRaw)
      )
    );

  } catch (err) {
    console.error("Préparation de la revente :", err);
    notify("Revente impossible", shortError(err), "error");
  }
}
async function buyProduct(id, name) {
  if (!(await ensureReady())) return;
  await executeTx(`Achat produit : ${name}`, () => contract.acheterProduit(id));
}
function addActivity(item) { activity.unshift(item); renderActivity(); }
function updateActivity(hash, status) { const item = activity.find(x => x.hash === hash); if (item) item.status = status; renderActivity(); }
function renderActivity() {
  $("activityCount").textContent = `${activity.length} opération${activity.length > 1 ? "s" : ""}`;
  const draw = (container) => {
    if (!activity.length) { container.className = "empty-state"; container.innerHTML = '<span class="empty-icon">↻</span><b>Rien à afficher pour le moment</b><p>Les opérations confirmées apparaîtront ici.</p>'; return; }
    container.className = "activity-list";
    container.innerHTML = "";
    activity.forEach(item => {
      const row = document.createElement("div"); row.className = "activity-row";
      const icon = document.createElement("span"); icon.className = "activity-row-icon"; icon.textContent = item.label.startsWith("Achat produit") ? "▣" : item.label.startsWith("Revente") ? "↘" : "＋";
      const details = document.createElement("div"); details.className = "activity-details";
      const name = document.createElement("b"); name.textContent = item.label;
      const hash = document.createElement("a"); hash.href = `https://etherscan.io/tx/${item.hash}`; hash.target = "_blank"; hash.rel = "noopener noreferrer"; hash.textContent = item.hash ? `${item.hash.slice(0,10)}…${item.hash.slice(-6)} ↗` : "Hash non disponible"; hash.title = "Ouvre Etherscan. Vérifiez que le réseau est Ethereum mainnet.";
      const date = document.createElement("small"); date.textContent = item.when;
      details.append(name, hash, date);
      const status = document.createElement("span"); status.className = `activity-status ${item.status === "Confirmée" ? "ok" : item.status === "Échec" ? "bad" : ""}`; status.textContent = item.status;
      row.append(icon, details, status); container.appendChild(row);
    });
  };
  draw($("activityList")); draw($("recentActivity"));
}
function go(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.remove("active"));
  const target = $(`page-${page}`); if (!target) return;
  target.classList.add("active");
  document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page === page));
  const map = {dashboard:"Vue d’ensemble",wallet:"Mon portefeuille",exchange:"Acheter / revendre",shop:"Boutique VCN",activity:"Activité",security:"Sécurité & réseau"};
  $("pageCrumb").textContent = map[page] || page;
  $("sidebar").classList.remove("open");
  window.scrollTo({top:0,behavior:"smooth"});
}
document.querySelectorAll("[data-page]").forEach(b => b.addEventListener("click", e => { e.preventDefault(); go(b.dataset.page); }));
document.querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => go(b.dataset.goto)));
$("connectBtn").addEventListener("click", connectWallet);
$("reloadProducts").addEventListener("click", loadProducts);
$("buyForm").addEventListener("submit", e => { e.preventDefault(); buyTokens(Number($("ethAmount").value)); });
$("sellForm").addEventListener("submit", e => { e.preventDefault(); sellTokens(Number($("vcnAmount").value)); });
$("ethAmount").addEventListener("input", () => { const v = Math.max(0, Number($("ethAmount").value) || 0); $("buyEstimate").textContent = `≈ ${fmt(v * EXCHANGE_RATE, 4)} VCN*`; });
$("vcnAmount").addEventListener("input", () => { const v = Math.max(0, Number($("vcnAmount").value) || 0); $("sellEstimate").textContent = `≈ ${fmt(v / EXCHANGE_RATE, 8)} ETH*`; });
["copyContract","copyContract2","copyContract3"].forEach(id => $(id).addEventListener("click", () => copyText(contractAddress, "Adresse du contrat copiée.")));
$("copyWallet").addEventListener("click", () => userAccount ? copyText(userAccount, "Adresse du wallet copiée.") : notify("Wallet déconnecté", "Connectez MetaMask pour copier votre adresse."));
async function copyText(value, success) {
  try { await navigator.clipboard.writeText(value); notify("Copié", success); }
  catch { notify("Copie indisponible", `Copiez manuellement : ${value}`); }
}
$("themeBtn").addEventListener("click", () => {
  const isDark = document.documentElement.dataset.theme !== "light";
  document.documentElement.dataset.theme = isDark ? "light" : "dark";
  document.documentElement.style.colorScheme = isDark ? "light" : "dark";
  notify("Apparence modifiée", isDark ? "Mode clair activé." : "Mode sombre activé.");
});
$("menuBtn").addEventListener("click", () => $("sidebar").classList.toggle("open"));
$("clearActivity").addEventListener("click", () => { activity = []; renderActivity(); notify("Historique effacé", "Seul l’historique local de cette session a été effacé. La blockchain reste inchangée."); });
if (window.ethereum) {
  window.ethereum.on?.("accountsChanged", async accounts => {
    if (!accounts || !accounts.length) { userAccount = null; signer = null; contract = null; setConnectedUI(); $("heroBalance").textContent = "—"; $("walletBalance").textContent = "—"; $("productList").innerHTML = '<div class="loading-card">Connectez MetaMask pour charger les produits depuis le contrat.</div>'; $("networkStatus").textContent = "Wallet déconnecté"; $("networkDetail").textContent = "Connectez MetaMask"; notify("Wallet déconnecté", "Aucun compte actif."); return; }
    userAccount = ethers.utils.getAddress(accounts[0]); provider = new ethers.providers.Web3Provider(window.ethereum, "any"); signer = provider.getSigner(); contract = new ethers.Contract(contractAddress, contractABI, signer); setConnectedUI(); await Promise.allSettled([loadBalance(), loadProducts()]);
  });
  window.ethereum.on?.("chainChanged", () => window.location.reload());
}
setConnectedUI();
renderActivity();

let cart = [];

// Carregar endereço salvo ao abrir a página
window.onload = () => {
    const savedAddress = localStorage.getItem("lk_address");
    const addressInput = document.getElementById("address");
    if (savedAddress && addressInput) {
        addressInput.value = savedAddress;
    }
};

// ===============================
// ALTERAR QUANTIDADE NOS CARDS
// ===============================
function changeQty(button, amount) {
    let span = button.parentElement.querySelector("span");
    let current = parseInt(span.innerText);
    current += amount;
    if (current < 1) current = 1;
    span.innerText = current;
}

// ===============================
// ADICIONAR AO CARRINHO (LÓGICA BASE)
// ===============================
function addToCart(name, price, qty) {
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({
            name: name,
            price: price,
            qty: qty
        });
    }
    updateCart();
}

// ITENS COM ADICIONAIS
function addToCartComExtras(button, nome, precoBase) {
    let card = button.closest(".card");
    let quantidade = parseInt(card.querySelector(".qty-control span").innerText);
    
    // Captura a observação específica deste lanche
    let obsInput = card.querySelector(".individual-obs");
    let observacao = obsInput ? obsInput.value.trim() : "";

    let totalExtras = 0;
    let nomesExtras = [];
    let checkboxes = card.querySelectorAll("input[type='checkbox']:checked");
    
    checkboxes.forEach(extra => {
        totalExtras += Number(extra.value);
        nomesExtras.push(extra.getAttribute("data-nome"));
    });

    let precoUnitario = precoBase + totalExtras;
    
    // Monta o nome final: Nome + Extras + Observação
    let nomeFinal = nome;
    if (nomesExtras.length > 0) {
        nomeFinal += ` *[Adicionais: ${nomesExtras.join(", ")}]*`;
    }
    if (observacao) {
        nomeFinal += ` [OBS: ${observacao}]`;
    }

    addToCart(nomeFinal, precoUnitario, quantidade);

    // Reset visual do card
    if (obsInput) obsInput.value = ""; // Limpa o campo de texto
    checkboxes.forEach(cb => cb.checked = false);
    card.querySelector(".qty-control span").innerText = 1;
    
    let extrasBox = card.querySelector(".extras-box");
    if (extrasBox) {
        extrasBox.style.display = "none";
        card.querySelector(".btn-extras").innerHTML = "➕ Adicionais";
    }
}
// MINI PASTÉIS
function addMiniPastel(btn, nome) {
    let card = btn.closest(".card");
    let selectQtd = card.querySelector(".select-qtd");
    let selectSabor = card.querySelector(".select-sabor");
    
    let preco = parseFloat(selectQtd.value);
    let qtdLabel = selectQtd.options[selectQtd.selectedIndex].text;
    let sabor = selectSabor.value;
    let quantidade = parseInt(card.querySelector(".qty-control span").innerText);

    addToCart(`${nome} - ${qtdLabel} (${sabor})`, preco, quantidade);
    card.querySelector(".qty-control span").innerText = 1;
}

function addSuco(btn, nome, precoFixo) {
    let card = btn.closest(".card");
    let selectSabor = card.querySelector(".select-sabor");
    
    if (selectSabor.value === "" || selectSabor.value === "selecione") {
        alert("Por favor, selecione o sabor!");
        return;
    }

    let sabor = selectSabor.value;
    let quantidade = parseInt(card.querySelector(".qty-control span").innerText);

    addToCart(`${nome} - ${sabor}`, precoFixo, quantidade);

    // ZERANDO APÓS ADICIONAR
    selectSabor.selectedIndex = 0; 
    card.querySelector(".qty-control span").innerText = 1;
}
// ===============================
// ATUALIZAR INTERFACE DO CARRINHO
// ===============================
function updateCart() {
    let cartItems = document.getElementById("cartItems");
    let cartCount = document.getElementById("cartCount");
    let totalElement = document.getElementById("total");

    if(!cartItems) return;

    cartItems.innerHTML = "";
    let total = 0;
    let totalQty = 0;

    cart.forEach((item, index) => {
        let subtotal = item.price * item.qty;
        total += subtotal;
        totalQty += item.qty;

        cartItems.innerHTML += `
            <div style="margin-bottom:12px; border-bottom:1px solid #333; padding-bottom:10px; color: white;">
                <p style="font-weight:600; font-size:14px; margin-bottom:5px;">${item.name}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="display:flex; align-items:center; gap:10px; background:#222; padding:4px 10px; border-radius:20px;">
                        <button onclick="changeCartQty(${index}, -1)" style="background:none; border:none; color:white; cursor:pointer;">−</button>
                        <span>${item.qty}</span>
                        <button onclick="changeCartQty(${index}, 1)" style="background:none; border:none; color:white; cursor:pointer;">+</button>
                    </div>
                    <strong style="color:#ffca2c;">R$ ${subtotal.toFixed(2)}</strong>
                </div>
            </div>`;
    });

    if(cartCount) cartCount.innerText = totalQty;
    if(totalElement) totalElement.innerText = "Total: R$ " + total.toFixed(2);
}

function changeCartQty(index, amount) {
    cart[index].qty += amount;
    if (cart[index].qty <= 0) cart.splice(index, 1);
    updateCart();
}

// ===============================
// UI E FILTROS
// ===============================
function toggleCart() {
    const panel = document.getElementById("cartPanel");
    if(panel) panel.classList.toggle("active");
}

function toggleExtras(button) {
    let container = button.closest(".extras-container");
    let box = container.querySelector(".extras-box");
    let isHidden = box.style.display === "none";
    box.style.display = isHidden ? "block" : "none";
    button.innerHTML = isHidden ? "➖ Ocultar adicionais" : "➕ Adicionais";
}

function checkPayment() {
    const payment = document.getElementById("payment").value;
    const pixArea = document.getElementById("pixArea");
    const trocoArea = document.getElementById("trocoArea");

    if (trocoArea) {
        trocoArea.style.display = (payment === "Dinheiro") ? "block" : "none";
        
        if (payment !== "Dinheiro") {
            const trocoInput = document.getElementById("troco");
            if (trocoInput) trocoInput.value = "";
        }
    }

    if (pixArea) {
        pixArea.style.display = (payment === "PIX") ? "block" : "none";
    }
}
function copiarPix(btn) { // Adicionei 'btn' aqui
    const chave = document.getElementById("chavePixValor").innerText.trim();

    navigator.clipboard.writeText(chave).then(() => {
        const textoOriginal = btn.innerHTML;
        const corOriginal = btn.style.background; // Salva a cor atual

        btn.innerHTML = "✅ COPIADO!";
        btn.style.background = "#ffffff"; 
        btn.style.color = "#000000"; // Garante que o texto fique legível no branco
        
        setTimeout(() => {
            btn.innerHTML = textoOriginal;
            btn.style.background = corOriginal; 
            btn.style.color = ""; // Volta ao padrão
        }, 2000);
    }).catch(err => {
        alert("Erro ao copiar. Por favor, selecione o texto manualmente.");
    });
}

function filter(cat, button) {
    document.querySelectorAll(".categories button").forEach(b => b.classList.remove("active"));
    if (button) button.classList.add("active");

    document.querySelectorAll(".card").forEach(card => {
        card.style.display = (cat === "all" || card.classList.contains(cat)) ? "flex" : "none";
    });
}

// ===============================
// DADOS E GERADOR (ESTRUTURA COMPLETA)
// ===============================
const adicionais = [
    {nome:"Bacon", preco:4}, {nome:"Cheddar", preco:3}, {nome:"Catupiry", preco:3},
    {nome:"Cream Chesee", preco:4}, {nome:"Ovo", preco:2}, {nome:"Calabresa", preco:3},
    {nome:"Queijo Coalho", preco:4}, {nome:"Molho Verde", preco:2}
];

const produtos = {
    combosTradicionais: [
        { nome: "Pequeno", preco: 18, img: "img/combo1.png", desc: "1 X-Burguer + Fritas Pequena", ingredientes: "Pão, hambúrguer, ovo, presunto, mussarela, alface, tomate, cebola." },
        { nome: "Médio", preco: 35, img: "img/combo2.png", desc: "2 Hambúrguer + Fritas Média com Calabresa e Cheddar", ingredientes: "Pão, hambúrguer, mussarela, alface, tomate, cebola." },
        { nome: "Grande", preco: 45, img: "img/combo3.png", desc: "3 Hambúrguer + Fritas Média com Calabresa e Cheddar", ingredientes: "Pão, hambúrguer, mussarela, alface, tomate, cebola." },
        { nome: "Gigante", preco: 60, img: "img/combo4.png", desc: "4 Hambúrguer + Fritas Grande com Calabresa e Cheddar", ingredientes: "Pão, hambúrguer, mussarela, alface, tomate, cebola." }
    ],
    combosArtesanais: [
        { nome: "Solteirão", preco: 20, img: "img/combo5.png", desc: "1 Barra + Fritas Pequena", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." },
        { nome: "Casal", preco: 42, img: "img/combo6.png", desc: "2 Barra + Fritas Média com Calabresa e Cheddar", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." },
        { nome: "Casal + Refri", preco: 50, img: "img/combocasalrefri.png", desc: "2 Barra + Fritas Média com Calabresa e Cheddar + Guaraná 1L ", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." },       
        { nome: "Amigos", preco: 55, img: "img/combo6.png", desc: "3 Barra + Fritas Média com Calabresa e Cheddar", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." },
        { nome: "Familia", preco: 78, img: "img/combo7.png", desc: "4 Barra + Fritas Grande com Calabresa e Cheddar", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." }
    ],
    artesanais: [
        { nome: "Barra", preco: 12, desc: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola.", img: "img/barra.png" },
        { nome: "Pôr do Sol", preco: 15, desc: "Pão de Brioche, hambúrguer 130g, ovo, mussarela, alface, tomate, cebola.", img: "img/pordosol.png" },
        { nome: "Crôa da Viúva", preco: 18, desc: "Pão de Brioche, hambúrguer 130g, calabresa, mussarela, alface, tomate, cebola.", img: "img/croa.png" },
        { nome: "Pedra da Galé", preco: 18, desc: "Pão de Brioche, hambúrguer 130g, frango desfiado, mussarela, alface, tomate, cebola.", img: "img/pedra.png" },
        { nome: "Carrasco", preco: 18, desc: "Pão de Brioche, hambúrguer 160g, cheddar, cebola caramelizada.", img: "img/carrasco.png" },
        { nome: "Maria-Dia", preco: 19, desc: "Pão de Brioche, hambúrguer 160g, bacon, mussarela, cream cheese, alface, tomate, cebola.", img: "img/mariadia.png" },
        { nome: "Farol", preco: 24, desc: "Pão de Brioche, 2 hambúrgueres 160g, cheddar, farofa de bacon.", img: "img/farol.png" },
        { nome: "Acaú Meu Amor", preco: 25, desc: "Pão de Brioche, hambúrguer 160g, bacon, ovo, calabresa, frango desfiado, mussarela, cream cheese, alface, tomate, cebola, batata palha, ervilha e milho.", img: "img/acau.png" },
        { nome: "Praia Azul", preco: 25, desc: "Pão de Brioche, hambúrguer 160g, fatia de cheddar, creme especial.", img: "img/praiaazul.png" }
    ],
    tradicionais: [
        { nome: "X-Burguer", preco: 10, img: "img/xburguer.png", desc: "Clássico", ingredientes: "Pão, carne, queijo, ovo e salada." },
        { nome: "X-Salada", preco: 8, img: "img/xsalada.png", desc: "Simples e gostoso", ingredientes: "Pão, carne, queijo e salada." },
        { nome: "X-Bacon", preco: 14, img: "img/xbacon.png", desc: "Muito bacon", ingredientes: "Pão, carne, queijo, bacon e salada." },
        { nome: "X-Frango", preco: 12, img: "img/xfrango.png", desc: "Frango desfiado", ingredientes: "Pão, frango, queijo e salada." },
        { nome: "X-Calabresa", preco: 12, img: "img/xcalabresa.png", desc: "Calabresa frita", ingredientes: "Pão, carne, calabresa e queijo." },
        { nome: "X-Tudo", preco: 15, img: "img/xtudo.png", desc: "Completo", ingredientes: "Todos os ingredientes tradicionais." },
        { nome: "Poderoso Cheddar", preco: 13, img: "img/cheddar.png", desc: "Muito cheddar", ingredientes: "Pão, carne e cheddar." }
    ],
    sandubas: [
        { nome: "Sanduba Frango", preco: 20, img: "img/sanduba-frango.png", desc: "Baguete 20cm", ingredientes: "Frango, milho, batata palha e mussarela." },
        { nome: "Sanduba Frango c/ Bacon", preco: 22, img: "img/sanduba-frangocombacon.png", desc: "Baguete 20cm", ingredientes: "Frango, bacon e cheddar." },
        { nome: "Sanduba Carne de Sol", preco: 24, img: "img/sanduba-carnedesol.png", desc: "Baguete 20cm", ingredientes: "Carne de sol, nata e queijo coalho." },
        { nome: "Sanduba Carne Seca", preco: 24, img: "img/sanduba-carneseca.png", desc: "Baguete 20cm", ingredientes: "Carne seca e queijo coalho." }
    ],
    pasteis: [
        {nome:"Pastel Carne", preco:10, img:"img/pasteldecarne.png"}, {nome:"Pastel Frango", preco:10, img:"img/pasteldefrango.png"},
        {nome:"Pastel Calabresa", preco:10, img:"img/calabresa.png"}, {nome:"Pastel Pizza", preco:10, img:"img/pizza.png"},
        {nome:"Pastel Presunto", preco:10, img:"img/presunto.png"}, {nome:"Pastel Misto", preco:10, img:"img/pastelmisto.png"},
        {nome:"Pastel 3 Queijos", preco:14, img:"img/4queijos.png"}, {nome:"Pastel 4 Queijos", preco:14, img:"img/4queijos.png"},
        {nome:"Pastel Charque", preco:14, img:"img/carnedesol.png"}, {nome:"Pastel Carne de Sol", preco:14, img:"img/carnedesol.png"}, 
        {nome:"Pastel Frango com Bacon", preco:14, img:"img/frangocombacon.png"}, {nome:"Pastel Queijo Coalho", preco:13, img:"img/queijocoalho.png"}, 
        {nome:"Pastel Chocolate", preco:14, img:"img/chocolate.png"}
    ],
    porcoespastel: [
        { nome: "Mini Pastéis", img: "img/6minipastel.png", opcoes: [{label:"6 unidades", preco:7}, {label:"12 unidades", preco:14}], sabores: ["Pizza", "Queijo"] }
    ],
    porcoes: [
        {nome:"Fritas Pequena", preco:10, img:"img/batata.png"}, {nome:"Fritas Média", preco:18, img:"img/batata.png"},
        {nome:"Fritas Grande", preco:25, img:"img/batata.png"}, {nome:"Batata Cheddar Bacon", preco:25, img:"img/batatabacon.png"},
        {nome:"Fritas Pequena com Calabresa", preco:15, img:"img/batatacalabresa.png"}, {nome:"Fritas Média com Calabresa", preco:20, img:"img/batatacalabresa.png"},
        {nome:"Fritas Grande com Calabresa", preco:32, img:"img/batatacalabresa.png"}
    ],
    salgados: [
        { nome: "Coxinha", preco: 6, img: "img/coxinha.png", desc: "Frango" },
        { nome: "Cachorro Quente", preco: 6, img: "img/cachorro-quente.png", desc: "Pão, carne, salsicha, vinagrete, milho e evilha, batata palha, queijo ralado e molhos." },
        { nome: "Misto Quente", preco: 7, img: "img/misto-quente.png", desc: "Queijo cremoso" }
    ],
    sucos: [
    { 
        nome: "Suco Natural (500ml)", 
        preco: 8, // Preço fixo
        img: "img/suco.png", 
        sabores: ["Laranja", "Abacaxi", "Maracujá", "Goiaba"] 
    },
    { 
        nome: "Suco com Leite (500ml)", 
        preco: 10, // Preço fixo
        img: "img/suco.png", 
        sabores: ["Morango", "Acerola", "Graviola"] 
    }
    ],
    bebidas: [
        { nome: "Mini Refri Guaraná", preco: 3, img: "img/minirefri.png", desc: "250ml" },
        { nome: "Coca-Cola Lata", preco: 7, img: "img/coca-lata.png", desc: "350ml" },
        { nome: "Coca-Cola Zero Lata ", preco: 7, img: "img/cocazero.png", desc: "350ml" },
        { nome: "Guaraná Antartica Lata", preco: 7, img: "img/guaranalata.png", desc: "350ml" },
        { nome: "Coca-Cola 1L", preco: 10, img: "img/coca1l.png", desc: "1000ml" },
        { nome: "Coca-Cola Zero 1L", preco: 10, img: "img/cocazero1l.png", desc: "1000ml" },
        { nome: "Guaraná Antartica 1L", preco: 10, img: "img/guarana1l.png", desc: "1000ml" },
        { nome: "Coca-Cola 2L", preco: 16, img: "img/coca2l.png", desc: "2000ml" },
        { nome: "Guaraná Antartica 2L", preco: 10, img: "img/guarana2l.png", desc: "2000ml" }  
    ]
};

function gerarCards(categoria, containerId) {
    let container = document.getElementById(containerId);
    if(!container || !produtos[categoria]) return;
    container.innerHTML = "";

    produtos[categoria].forEach(produto => {
        // 1. LÓGICA PARA ITENS COM SELETORES (Sucos e Mini Pastéis)
        if (produto.sabores) {
            let isSuco = categoria === "sucos";
            
            // Se for suco, mostra o preço fixo. Se for mini pastel, o preço varia no select.
            let precoHTML = isSuco 
                ? `<p class="price">R$ ${produto.preco.toFixed(2)}</p>` 
                : ""; 

            let selectQtdHTML = produto.opcoes 
                ? `<select class="select-qtd">${produto.opcoes.map(op => `<option value="${op.preco}">${op.label} - R$ ${op.preco.toFixed(2)}</option>`).join("")}</select>`
                : "";

            container.innerHTML += `
                <div class="card">
                    <img src="${produto.img}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    ${precoHTML} ${selectQtdHTML}
                    <select class="select-sabor">
                        <option value="">Escolha o sabor...</option>
                        ${produto.sabores.map(s => `<option value="${s}">${s}</option>`).join("")}
                    </select>
                    <div class="actions">
                        <div class="qty-control">
                            <button onclick="changeQty(this,-1)">−</button>
                            <span>1</span>
                            <button onclick="changeQty(this,1)">+</button>
                        </div>
                        <button class="add-btn" onclick="${isSuco ? `addSuco(this,'${produto.nome}',${produto.preco})` : `addMiniPastel(this,'${produto.nome}')`}">
                            Adicionar
                        </button>
                    </div>
                </div>`;
        } 
        // 2. LÓGICA PARA PRODUTOS NORMAIS (Lanches, Porções, Bebidas, etc)
        else {
            let catComExtras = ["pasteis", "artesanais", "artesanal", "tradicionais", "tradicional", "porcoes", "sandubas"];
            let mostrarExtras = catComExtras.includes(categoria);
            let mostrarObs = categoria !== "bebidas";

            container.innerHTML += `
                <div class="card">
                    <img src="${produto.img}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    ${produto.desc ? `<p class="desc-text">${produto.desc}</p>` : ""}
                    
                    ${mostrarObs ? `
                    <div class="item-obs">
                        <input type="text" placeholder="Observação (Ex: Sem cebola)" class="individual-obs">
                    </div>` : ""}

                    ${mostrarExtras ? `
                        <div class="extras-container">
                            <button class="btn-extras" onclick="toggleExtras(this)">➕ Adicionais</button>
                            <div class="extras-box" style="display:none;">
                                <div class="extras-grid">${adicionais.map(e => `<label class="extra-item"><input type="checkbox" value="${e.preco}" data-nome="${e.nome}"><span>+ ${e.nome}</span></label>`).join("")}</div>
                            </div>
                        </div>` : ""}
                        
                    <p class="price">R$ ${produto.preco.toFixed(2)}</p>
                    <div class="actions">
                        <div class="qty-control">
                            <button onclick="changeQty(this,-1)">−</button>
                            <span>1</span>
                            <button onclick="changeQty(this,1)">+</button>
                        </div>
                        <button class="add-btn" onclick="addToCartComExtras(this,'${produto.nome}',${produto.preco})">Adicionar</button>
                    </div>
                </div>`;
        }
    });
}

// Inicializar vitrines
Object.keys(produtos).forEach(cat => {
    let idMap = {
        "porcoespastel": "porcoespastel-list",
        "tradicionais": "tradicionais-list",
        "artesanais": "artesanais-list",
        "salgados": "salgados-list",
        "pasteis": "pasteis-list",
        "combosTradicionais": "combos-tradicionais-list",
        "combosArtesanais": "combos-artesanais-list",
        "sandubas": "sanduba-list",
        "sucos": "sucos-list",
        "bebidas": "bebidas-list"
        
    };
    let id = idMap[cat] || `${cat}-list`;
    gerarCards(cat, id);
});

// ===============================
// ENVIO PARA WHATSAPP
// ===============================
function sendWhatsApp() {
    // 1. Captura dos elementos com segurança (sem alertas aqui)
    const elName = document.getElementById("clientName");
    const elAddress = document.getElementById("address");
    const elPayment = document.getElementById("payment");
    const elObs = document.getElementById("obs");
    const elTroco = document.getElementById("troco");

    // Pegamos os valores (usando as variáveis elName, etc, para evitar erro de duplicidade)
    const name = elName ? elName.value.trim() : "";
    const address = elAddress ? elAddress.value.trim() : "";
    const payment = elPayment ? elPayment.value : "";
    const obs = elObs ? elObs.value.trim() : "";
    const troco = elTroco ? elTroco.value : "";

    // 2. Validações rápidas
    if (cart.length === 0) { alert("Carrinho vazio!"); return; }
    if (!name || !address || !payment) { alert("Preencha nome, endereço e pagamento!"); return; }

    // 3. Montagem da Mensagem
    let msg = `🍔 *NOVO PEDIDO - LK LANCHES*\n`;
    msg += `──────────────────\n\n`;
    msg += `👤 *Cliente:* ${name}\n`;
    msg += `──────────────────\n\n`;

    let total = 0;
    cart.forEach(item => {
        const subtotal = item.price * item.qty;
        msg += `✅ *${item.qty}x* ${item.name}\n`;
        msg += `R$ ${subtotal.toFixed(2)}\n\n`;
        total += subtotal;
    });

    msg += `──────────────────\n`;
    msg += `💰 *Total:* R$ ${total.toFixed(2)}\n`;
    msg += `💳 *Pagamento:* ${payment}\n`;
    msg += `📍 *Endereço:* ${address}\n`;

    if (obs) msg += `📝 *Obs:* ${obs}\n`;

    if (payment === "Dinheiro" && troco) {
        const vPago = parseFloat(troco.replace(',', '.'));
        if (!isNaN(vPago) && vPago > total) {
            msg += `💵 *Troco para:* R$ ${vPago.toFixed(2)}\n`;
            msg += `🪙 *Valor do Troco:* R$ ${(vPago - total).toFixed(2)}\n`;
        }
    }

    if (payment === "PIX") {
        msg += `\n⚠️ _Enviarei o comprovante em seguida._`;
    }

    // 4. ENVIO ANTI-BLOQUEIO
    const fone = "5583999963331"; 
    const url = `https://wa.me/${fone}?text=${encodeURIComponent(msg)}`;
    
    // Tenta abrir em nova aba
    const novaAba = window.open(url, '_blank');
    
    // Se a nova aba não abriu (bloqueada pelo celular), abre na mesma aba
    if (!novaAba || novaAba.closed || typeof novaAba.closed == 'undefined') {
        window.location.href = url; 
    }

    // 5. Limpeza (Executa após o comando de abrir)
    cart = []; 
    if (localStorage.getItem('cart')) localStorage.removeItem('cart');
    updateCart();
}

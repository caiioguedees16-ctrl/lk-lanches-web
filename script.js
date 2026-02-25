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

function aplicarEfeitoFeedback(button) {
    const textoOriginal = button.innerText;
    const corOriginal = button.style.backgroundColor;

    button.innerText = "✅ Adicionado!";
    button.style.backgroundColor = "#28a745"; // Verde Sucesso
    button.disabled = true;

    setTimeout(() => {
        button.innerText = textoOriginal;
        button.style.backgroundColor = corOriginal;
        button.disabled = false;
    }, 1500);
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
    aplicarEfeitoFeedback(button);
    setTimeout(() => {
        if (obsInput) obsInput.value = ""; 
        checkboxes.forEach(cb => cb.checked = false);
        card.querySelector(".qty-control span").innerText = 1;
        
        // Atualiza o preço exibido no card para o valor original (sem os extras)
        const displayPreco = card.querySelector('.preco-final-display');
        if (displayPreco) displayPreco.innerText = `R$ ${precoBase.toFixed(2)}`;
        
        let extrasBox = card.querySelector(".extras-box");
        if (extrasBox) {
            extrasBox.style.display = "none";
            card.querySelector(".btn-extras").innerHTML = "➕ Adicionais";
        }
    }, 1500);
}

// --- FUNÇÃO DO PASTEL (REVISADA PARA NÃO TRAVAR) ---
function addMiniPastel(btn, nome) {
    let card = btn.closest(".card");
    let selectQtd = card.querySelector(".select-qtd");
    let selectSabor = card.querySelector(".select-sabor");

    // Verifica se os elementos existem antes de ler o .value
    if (!selectSabor || !selectQtd) {
        console.error("Este card não parece ser de um Pastel. Verifique o onclick no HTML.");
        return; 
    }

    if (selectSabor.value === "" || selectSabor.value === "selecione") {
        alert("Por favor, escolha o sabor do seu pastel!");
        return;
    }
    
    let preco = parseFloat(selectQtd.value);
    let qtdLabel = selectQtd.options[selectQtd.selectedIndex].text;
    let sabor = selectSabor.value;
    let quantidade = parseInt(card.querySelector(".qty-control span").innerText);

    addToCart(`${nome} - ${qtdLabel} (${sabor})`, preco, quantidade);
    aplicarEfeitoFeedback(btn);
    
    setTimeout(() => {
        selectSabor.selectedIndex = 0;
        card.querySelector(".qty-control span").innerText = 1;
    }, 1500);
}

// --- FUNÇÃO ÚNICA PARA O SORVETE (RESOLVE O ERRO) ---
function addSorvete(btn, nome, precoUnitario) {
    const card = btn.closest(".card-sorvete");
    const inputSabor = card.querySelector(".input-sabor-sorvete");
    const qtdElemento = card.querySelector(".qtd-numero");
    
    const saborDigitado = inputSabor.value.trim();
    const quantidade = parseInt(qtdElemento.innerText);
    const valorTotal = quantidade * precoUnitario;

    if (saborDigitado === "") {
        alert("Por favor, digite os sabores desejados!");
        inputSabor.focus();
        return;
    }

    // Envia para o carrinho principal
    const itemNome = `${nome} (${quantidade} bolas) - Sabores: ${saborDigitado}`;
    addToCart(itemNome, valorTotal, 1);
    
    // Feedback visual de sucesso
    aplicarEfeitoFeedback(btn);

    // Reseta o card
    setTimeout(() => {
        inputSabor.value = "";
        qtdElemento.innerText = "1";
        card.querySelector(".preco-final-sorvete").innerText = `R$ ${precoUnitario.toFixed(2)}`;
    }, 1000);
}

function gerarCardSorvete(produto) {
    return `
        <div class="card card-sorvete">
            <img src="${produto.img}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            <p class="desc-text">Escolha a quantidade de bolas e digite os sabores abaixo.</p>
            
            <div class="sorvete-inputs" style="padding: 0 15px;">
                <input type="text" class="input-sabor-sorvete" 
                    placeholder="Sabores (ex: Morango, Chocolate)">
            </div>

            <p class="price" style="margin-top:10px;">
                Total: <span class="preco-final-sorvete">R$ ${produto.preco.toFixed(2)}</span>
            </p>

            <div class="actions">
                <div class="qty-control">
                    <button onclick="alterarQtdSorvete(this, -1, ${produto.preco})">−</button>
                    <span class="qtd-numero">1</span>
                    <button onclick="alterarQtdSorvete(this, 1, ${produto.preco})">+</button>
                </div>
                <button class="add-btn" onclick="addSorvete(this, '${produto.nome}', ${produto.preco})">
                    Adicionar
                </button>
            </div>
        </div>`;
}
// Faz o cálculo do preço aparecer na tela (R$ 5,00 -> R$ 10,00 etc)
function alterarQtdSorvete(btn, delta, precoUnitario) {
    const card = btn.closest(".card-sorvete");
    const qtdSpan = card.querySelector(".qtd-numero");
    const precoSpan = card.querySelector(".preco-final-sorvete");
    
    let qtd = parseInt(qtdSpan.innerText) + delta;
    if (qtd < 1) qtd = 1; // Não deixa ser menor que 1 bola
    
    qtdSpan.innerText = qtd;
    let total = qtd * precoUnitario;
    precoSpan.innerText = `R$ ${total.toFixed(2)}`;
}

// Função de apoio para garantir o envio correto
function finalizarCompraSorvete(item) {
    // Verificamos se o carrinho existe (geralmente é um array chamado carrinho ou cart)
    if (typeof carrinho !== "undefined") {
        // Adicionamos direto no array, pulando a função principal que tem o erro do pastel
        carrinho.push({
            nome: item.nome + " - Sabor: " + item.sabor,
            preco: item.preco,
            quantidade: 1
        });

        // Chamamos apenas as funções de atualizar o visual (se existirem)
        if (typeof atualizarCarrinho === "function") atualizarCarrinho();
        if (typeof mostrarCarrinho === "function") mostrarCarrinho();
    } else {
        // Se não houver array global, usamos o addToCart mas com um "truque"
        // Passamos um quarto parâmetro 'true' para avisar que é sorvete (opcional)
        addToCart(item.nome + " - Sabor: " + item.sabor, item.preco, 1);
    }
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
        
        // Só soma na contagem de itens o que não for taxa
        if (!item.isTax) totalQty += item.qty;

        // Lógica para esconder os botões se for taxa
        const controls = item.isTax 
            ? `<span style="font-size: 12px; color: #aaa; font-style: italic;">Taxa Fixa</span>` 
            : `<div style="display:flex; align-items:center; gap:10px; background:#222; padding:4px 10px; border-radius:20px;">
                <button onclick="changeCartQty(${index}, -1)" style="background:none; border:none; color:white; cursor:pointer;">−</button>
                <span>${item.qty}</span>
                <button onclick="changeCartQty(${index}, 1)" style="background:none; border:none; color:white; cursor:pointer;">+</button>
               </div>`;

        cartItems.innerHTML += `
            <div style="margin-bottom:12px; border-bottom:1px solid #333; padding-bottom:10px; color: white;">
                <p style="font-weight:600; font-size:14px; margin-bottom:5px;">${item.name}</p>
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    ${controls}
                    <strong style="color:${item.isTax ? '#4caf50' : '#ffca2c'};">R$ ${subtotal.toFixed(2)}</strong>
                </div>
            </div>`;
    });

    if(cartCount) cartCount.innerText = totalQty;
    if(totalElement) totalElement.innerText = "Total: R$ " + total.toFixed(2);
}

function updateCartModal() {
  cartItemsContainer.innerHTML = "";

  cart.forEach(item => {
    const itemElement = document.createElement("div");
    
    // Se for a taxa, não mostramos os botões de (+) ou (-)
    const controls = item.isTax 
      ? `<span>(Fixo)</span>` 
      : `<button onclick="removeItem('${item.name}')">-</button>`;

    itemElement.innerHTML = `
      <div class="flex justify-between">
        <p>${item.name}</p>
        <p>R$ ${item.price.toFixed(2)}</p>
        ${controls}
      </div>
    `;
    cartItemsContainer.appendChild(itemElement);
  });
}

// ===============================
// ADICIONAR AO CARRINHO (LÓGICA BASE)
// ===============================

const deliveryFee = 2.00;

// Substitua a sua função addToCart atual por esta:
function addToCart(name, price, qty = 1) {
    // 1. Se o carrinho estiver vazio, adiciona a taxa primeiro
    if (cart.length === 0) {
        cart.push({
            name: "🚚 Taxa de Entrega",
            price: deliveryFee,
            qty: 1,
            isTax: true 
        });
    }

    // 2. Verifica se o item já existe (usando o nome completo que já inclui o sabor)
    let existingItem = cart.find(item => item.name === name);

    if (existingItem) {
        existingItem.qty += qty;
    } else {
        cart.push({
            name: name,
            price: price,
            qty: qty,
            isTax: false
        });
    }

    // 3. Atualiza a interface
    updateCart();
}

function changeCartQty(index, amount) {
    if (cart[index].isTax) return; // Bloqueia qualquer alteração na taxa

    cart[index].qty += amount;
    if (cart[index].qty <= 0) cart.splice(index, 1);

    // Se remover o último lanche e sobrar só a taxa, limpa o carrinho
    if (cart.length === 1 && cart[0].isTax) {
        cart = [];
    }
    
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
        preco: 7, // Preço fixo
        img: "img/suco.png", 
        sabores: ["Cajá", "Abacaxi com Hortelã", "Maracujá", "Graviola", "Mangaba", "Acerola"] 
    },
    { 
        nome: "Suco com Leite (500ml)", 
        preco: 10, // Preço fixo
        img: "img/suco.png", 
        sabores: ["Cajá", "Abacaxi com Hortelã", "Maracujá", "Graviola", "Mangaba", "Acerola"]  
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
        { nome: "Guaraná Antartica 2L", preco: 16, img: "img/guarana2l.png", desc: "2000ml" }  
    ],
    acai: [
    { 
        nome: "Açaí na Tigela", 
        img: "img/acai.png", 
        desc: "Monte do seu jeito! Escolha entre bolas de Açaí e Ninho + acompanhamentos.",
        opcoes: [
            {label: "Pequeno (2 bolas)", preco: 5, limiteBolas: 2},
            {label: "Médio (4 bolas)", preco: 8, limiteBolas: 4},
            {label: "Grande (5 bolas)", preco: 10, limiteBolas: 5}
        ],
        precoBolaExtra: 2 // Valor de cada bola adicional
    }
    ],
    sorvete: [
    { 
        nome: "Sorvete", 
        img: "img/sorvete.png",
        preco: 2.50,
        sabores: ["Consultar sabores disponíveis", "Chocolate", "Morango", "Creme"],
        categoria: "sorvete"
    }
    ]
};

let montagemAcai = {
    bolas: [],
    acompanhamentos: {}
};

function gerarCardAcai(produto) {
    const acompanhamentosAcai = ["Granola", "Leite em Pó", "Leite Condensado", "Amendoim", "Farinha Láctea"];
    
    return `
        <div class="card acai-card">
            <img src="${produto.img}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            
            <label>1. Escolha o Tamanho:</label>
            <select class="select-tamanho" onchange="resetarEMudarTamanho(this)">
                ${produto.opcoes.map(op => `<option value="${op.preco}" data-limite="${op.limiteBolas}">${op.label} - R$ ${op.preco.toFixed(2)}</option>`).join("")}
            </select>

            <div class="montagem-secao">
                <div class="instrucao-montagem">
                    ⚠️ Importante: Escolha as bolas e acompanhamentos abaixo!
                </div>

                <p class="secao-titulo"><strong>Bolas (<span class="count-bolas">0</span> selecionadas)</strong></p>
                <div class="bolas-grid">
                    ${['Açaí', 'Ninho','Cupuaçu'].map(tipo => `
                        <div class="item-controle">
                            <span>${tipo}</span>
                            <div class="qty-control">
                                <button onclick="alterarBola('${tipo}', -1, this)">−</button>
                                <span class="qtd-bola-${tipo}">0</span>
                                <button onclick="alterarBola('${tipo}', 1, this)">+</button>
                            </div>
                        </div>
                    `).join("")}
                </div>

                <p class="secao-titulo"><strong>Acompanhamentos</strong></p>
                <p class="info-adicional">🎁 O 1º é de graça! Extras: R$ 2,00 cada</p>
                <div class="extras-grid">
                    ${acompanhamentosAcai.map(acc => `
                        <div class="item-controle">
                            <span>${acc}</span>
                            <div class="qty-control">
                                <button onclick="alterarAcc('${acc}', -1, this)">−</button>
                                <span class="qtd-acc" data-nome="${acc}">0</span>
                                <button onclick="alterarAcc('${acc}', 1, this)">+</button>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="footer-acai">
                <p class="price preco-final-display">R$ ${produto.opcoes[0].preco.toFixed(2)}</p>
                <button class="add-btn" onclick="finalizarPedidoAcai(this, '${produto.nome}')">Adicionar ao Carrinho</button>
            </div>
        </div>
    `;
}
// --- FUNÇÕES DE LÓGICA ---

function alterarBola(tipo, mudanca, btn) {
    const card = btn.closest('.card');
    const span = card.querySelector(`.qtd-bola-${tipo}`);
    let qtd = (montagemAcai.bolas.filter(b => b === tipo).length) + mudanca;

    if (mudanca > 0) {
        montagemAcai.bolas.push(tipo);
    } else {
        const index = montagemAcai.bolas.lastIndexOf(tipo);
        if (index > -1) montagemAcai.bolas.splice(index, 1);
    }
    
    span.innerText = montagemAcai.bolas.filter(b => b === tipo).length;
    card.querySelector('.count-bolas').innerText = montagemAcai.bolas.length;
    atualizarPrecoAcai(card);
}

function alterarAcc(nome, mudanca, btn) {
    const card = btn.closest('.card');
    const span = btn.parentElement.querySelector('.qtd-acc');
    let qtd = (montagemAcai.acompanhamentos[nome] || 0) + mudanca;
    
    if (qtd < 0) qtd = 0;
    montagemAcai.acompanhamentos[nome] = qtd;
    span.innerText = qtd;
    atualizarPrecoAcai(card);
}

function atualizarPrecoAcai(card) {
    const select = card.querySelector('.select-tamanho');
    const precoBase = parseFloat(select.value);
    const limiteGratis = parseInt(select.options[select.selectedIndex].getAttribute('data-limite'));
    
    // Cálculo Bolas Extras
    let extraBolas = 0;
    if (montagemAcai.bolas.length > limiteGratis) {
        extraBolas = (montagemAcai.bolas.length - limiteGratis) * 2.00;
    }

    // Cálculo Acompanhamentos Extras (Cobra a partir do 2º)
    let extraAcc = 0;
    for (let nome in montagemAcai.acompanhamentos) {
        let qtd = montagemAcai.acompanhamentos[nome];
        if (qtd > 1) extraAcc += (qtd - 1) * 2.00;
    }

    const total = precoBase + extraBolas + extraAcc;
    card.querySelector('.preco-final-display').innerText = `R$ ${total.toFixed(2)}`;
}

function resetarEMudarTamanho(select) {
    const card = select.closest('.card');
    montagemAcai = { bolas: [], acompanhamentos: {} };
    card.querySelectorAll('.qty-control span').forEach(s => s.innerText = "0");
    card.querySelector('.count-bolas').innerText = "0";
    atualizarPrecoAcai(card);
}

// Agrupa bolas repetidas (Ex: "2x Açaí, 1x Ninho") para o WhatsApp
function formatarBolas(lista) {
    const contagem = lista.reduce((acc, curr) => {
        acc[curr] = (acc[curr] || 0) + 1;
        return acc;
    }, {});
    return Object.entries(contagem).map(([nome, qtd]) => `${qtd}x ${nome}`).join(", ");
}

function finalizarPedidoAcai(button, nomeBase) {
    const card = button.closest('.card');
    const select = card.querySelector('.select-tamanho');
    const tamanhoTxt = select.options[select.selectedIndex].text.split(' -')[0];
    const limite = parseInt(select.options[select.selectedIndex].getAttribute('data-limite'));

    if (montagemAcai.bolas.length < limite) {
        alert(`O tamanho ${tamanhoTxt} inclui ${limite} bolas. Selecione pelo menos essa quantidade.`);
        return;
    }

    let resumoBolas = formatarBolas(montagemAcai.bolas);
    let detalhes = `[${tamanhoTxt}] Bolas: ${resumoBolas}`;
    
    let accs = [];
    for (let n in montagemAcai.acompanhamentos) {
        if (montagemAcai.acompanhamentos[n] > 0) {
            accs.push(`${montagemAcai.acompanhamentos[n]}x ${n}`);
        }
    }
    
    if (accs.length > 0) detalhes += ` | Extras: ${accs.join(", ")}`;

    const precoFinal = parseFloat(card.querySelector('.preco-final-display').innerText.replace("R$ ", "").replace(",", "."));
    
    addToCart(`${nomeBase} ${detalhes}`, precoFinal, 1);
    aplicarEfeitoFeedback(button);
    resetarEMudarTamanho(select);
}

function gerarCards(categoria, containerId) {
    let container = document.getElementById(containerId);
    if(!container || !produtos[categoria]) return;
    container.innerHTML = "";

    produtos[categoria].forEach(produto => {
        
        // 1. LÓGICA ESPECIAL PARA AÇAÍ
        if (categoria === "acai") {
            container.innerHTML += gerarCardAcai(produto);
        }
        
        // 2. LÓGICA PARA SORVETES (ADICIONE ESTE BLOCO NOVO)
        else if (categoria === "sorvete") {
            container.innerHTML += gerarCardSorvete(produto);
        }
        
        // 3. LÓGICA PARA ITENS COM SELETORES (Sucos e Mini Pastéis)
        else if (produto.sabores) {
            let isSuco = categoria === "sucos";
            let precoHTML = isSuco ? `<p class="price">R$ ${produto.preco.toFixed(2)}</p>` : ""; 
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
        
        // 4. LÓGICA PARA PRODUTOS NORMAIS (Lanches, Porções, etc)
        else {
            let catComExtras = ["pasteis", "artesanais", "tradicionais", "porcoes", "sandubas"];
            let mostrarExtras = catComExtras.includes(categoria);
            let mostrarObs = categoria !== "bebidas";

            container.innerHTML += `
                <div class="card">
                    <img src="${produto.img}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    ${produto.desc ? `<p class="desc-text">${produto.desc}</p>` : ""}
                    ${mostrarObs ? `<div class="item-obs"><input type="text" placeholder="Observação" class="individual-obs"></div>` : ""}
                    ${mostrarExtras ? `
                        <div class="extras-container">
                            <button class="btn-extras" onclick="toggleExtras(this)">➕ Adicionais</button>
                            <div class="extras-box" style="display:none;">
                                <div class="extras-grid">
                                    ${adicionais.map(e => `
                                        <label class="extra-item">
                                            <input type="checkbox" value="${e.preco}" data-nome="${e.nome}" 
                                            onchange="atualizarPrecoTotalModal(this.closest('.card'), ${produto.preco})">
                                            <span>+ ${e.nome} (R$ ${e.preco.toFixed(2)})</span>
                                        </label>
                                    `).join("")}
                                </div>
                            </div>
                        </div>` : ""}
                    <p class="price preco-final-display">R$ ${produto.preco.toFixed(2)}</p>
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
        "bebidas": "bebidas-list",
        "acai": "acai-list",
        "sorvete": "sorvete-list"
        
    };
    let id = idMap[cat] || `${cat}-list`;
    gerarCards(cat, id);
});

function atualizarPrecoTotalModal(modalElement, precoBase) {
    const checkboxes = modalElement.querySelectorAll('.extra-item input[type="checkbox"]:checked');
    let totalAdicionais = 0;

    checkboxes.forEach(input => {
        totalAdicionais += parseFloat(input.value);
    });

    const precoFinal = precoBase + totalAdicionais;
    const displayPreco = modalElement.querySelector('.preco-final-display'); 
    
    if (displayPreco) {
        displayPreco.innerText = `R$ ${precoFinal.toFixed(2)}`;
    }
}

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

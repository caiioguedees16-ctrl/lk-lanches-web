let cart = [];

// Carregar endereço salvo ao abrir a página
window.onload = () => {
    const savedAddress = localStorage.getItem("lk_address");
    const addressInput = document.getElementById("address");
    if (savedAddress && addressInput) {
        addressInput.value = savedAddress;
    }
};
// Aguarda o site carregar
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('.section');
    const navLinks = document.querySelectorAll('nav a');
    const navContainer = document.querySelector('nav');

    let currentSectionId = "";

    // Verifica qual seção está mais visível no topo da tela
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        // O 200 é uma margem para o destaque mudar um pouco antes de chegar na seção
        if (pageYOffset >= (sectionTop - 200)) {
            currentSectionId = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        // Remove a cor vermelha de todos
        link.classList.remove('active');
        
        // Se o link for da seção atual, acende ele e move a barra
        if (link.getAttribute('href') === `#${currentSectionId}`) {
            link.classList.add('active');

            // Lógica para centralizar o botão na barra horizontal
            const linkOffset = link.offsetLeft;
            const containerWidth = navContainer.offsetWidth;
            const linkWidth = link.offsetWidth;

            navContainer.scrollTo({
                left: linkOffset - (containerWidth / 2) + (linkWidth / 2),
                behavior: 'smooth'
            });
        }
    });
});
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

function gerarCardSorvete(produto) {
    return `
        <div class="card card-sorvete">
            <img src="${produto.img}" alt="${produto.nome}">
            <h3>${produto.nome}</h3>
            
            <div style="background: rgba(255, 202, 44, 0.1); border: 1px dashed #ffca2c; margin: 10px 15px; padding: 10px; border-radius: 8px;">
                <p style="font-size: 13px; color: #ffca2c; margin: 0; font-weight: bold; line-height: 1.4;">
                    🍦 Escolha a quantidade de bolas abaixo.<br>
                    <span style="color: #fff; font-weight: normal;">Os sabores disponíveis serão confirmados com a atendente via WhatsApp.</span>
                </p>
            </div>

            <p class="price" style="margin-top:10px;">
                Total (<span class="qtd-bolas-texto">1</span> bola): 
                <span class="preco-final-sorvete" style="color: #28a745; font-weight: bold;">R$ ${produto.preco.toFixed(2)}</span>
            </p>

            <div class="actions">
                <div class="qty-control">
                    <button type="button" onclick="alterarQtdSorvete(this, -1, ${produto.preco})">−</button>
                    <span class="qtd-numero">1</span>
                    <button type="button" onclick="alterarQtdSorvete(this, 1, ${produto.preco})">+</button>
                </div>
                <button type="button" class="add-btn" onclick="addSorveteSimples(this, '${produto.nome}', ${produto.preco})">
                    Adicionar
                </button>
            </div>
        </div>`;
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
function addSorveteSimples(btn, nome, precoUnitario) {
    const card = btn.closest(".card-sorvete");
    const qtdElemento = card.querySelector(".qtd-numero");
    const quantidade = parseInt(qtdElemento.innerText);
    const valorTotal = quantidade * precoUnitario;

    // Monta o nome para o carrinho de forma clara
    const nomeFinal = `${nome} (${quantidade} bola${quantidade > 1 ? 's' : ''}) - Combinar sabores no Whats`;

    // Envia para o carrinho principal
    addToCart(nomeFinal, valorTotal, 1);
    
    // Feedback visual
    aplicarEfeitoFeedback(btn);

    // Reseta para 1 após adicionar
    setTimeout(() => {
        qtdElemento.innerText = "1";
        card.querySelector(".qtd-bolas-texto").innerText = "1";
        card.querySelector(".preco-final-sorvete").innerText = `R$ ${precoUnitario.toFixed(2)}`;
    }, 1000);
}
// Faz o cálculo do preço aparecer na tela (R$ 5,00 -> R$ 10,00 etc)
function alterarQtdSorvete(btn, delta, precoUnitario) {
    const card = btn.closest(".card-sorvete");
    const qtdSpan = card.querySelector(".qtd-numero");
    const textoBolas = card.querySelector(".qtd-bolas-texto");
    const precoSpan = card.querySelector(".preco-final-sorvete");
    
    let qtd = parseInt(qtdSpan.innerText) + delta;
    if (qtd < 1) qtd = 1;
    
    qtdSpan.innerText = qtd;
    if (textoBolas) textoBolas.innerText = qtd; // Muda o "1 bola" para "2 bolas" etc.
    
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
    
    if (cart.length > 0) {
        cartItems.innerHTML = `
            <div style="background: #ffca2c; color: #000; text-align: center; padding: 10px; font-size: 13px; font-weight: bold; border-radius: 8px; margin-bottom: 15px; display: flex; align-items: center; justify-content: center; gap: 8px;">
                <span>👨‍🍳</span>
                <span>Lanche preparado na hora! Entrega: 20 a 40 min.</span>
            </div>
        `;
    }
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
        { nome: "Pequeno", preco: 18, img: "img/combo1.vspng", desc: "1 X-Burguer + Fritas Pequena", ingredientes: "Pão, hambúrguer, ovo, presunto, mussarela, alface, tomate, cebola." },
        { nome: "Médio", preco: 35, img: "img/combo2.webp", desc: "2 Hambúrguer + Fritas Média com Calabresa e Cheddar", ingredientes: "Pão, hambúrguer, mussarela, alface, tomate, cebola." },
        { nome: "Grande", preco: 45, img: "img/combo3.webp", desc: "3 Hambúrguer + Fritas Média com Calabresa e Cheddar", ingredientes: "Pão, hambúrguer, mussarela, alface, tomate, cebola." },
        { nome: "Gigante", preco: 60, img: "img/combo4.webp", desc: "4 Hambúrguer + Fritas Grande com Calabresa e Cheddar", ingredientes: "Pão, hambúrguer, mussarela, alface, tomate, cebola." }
    ],
    combosArtesanais: [
        { nome: "Solteirão", preco: 20, img: "img/combo5.webp", desc: "1 Barra + Fritas Pequena", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." },
        { nome: "Casal", preco: 42, img: "img/combo6.webp", desc: "2 Barra + Fritas Média com Calabresa e Cheddar", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." },
        { nome: "Casal + Refri", preco: 50, img: "img/combocasalrefri.webp", desc: "2 Barra + Fritas Média com Calabresa e Cheddar + Guaraná 1L ", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." },       
        { nome: "Amigos", preco: 55, img: "img/combo6.webp", desc: "3 Barra + Fritas Média com Calabresa e Cheddar", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." },
        { nome: "Familia", preco: 78, img: "img/combo7.webp", desc: "4 Barra + Fritas Grande com Calabresa e Cheddar", ingredientes: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola." }
    ],
    artesanais: [
        { nome: "Barra", preco: 12, desc: "Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola.", img: "img/barra.webp" },
        { nome: "Pôr do Sol", preco: 15, desc: "Pão de Brioche, hambúrguer 130g, ovo, mussarela, alface, tomate, cebola.", img: "img/pordosol.webp" },
        { nome: "Crôa da Viúva", preco: 18, desc: "Pão de Brioche, hambúrguer 130g, calabresa, mussarela, alface, tomate, cebola.", img: "img/croa.webp" },
        { nome: "Pedra da Galé", preco: 18, desc: "Pão de Brioche, hambúrguer 130g, frango desfiado, mussarela, alface, tomate, cebola.", img: "img/pedra.webp" },
        { nome: "Carrasco", preco: 18, desc: "Pão de Brioche, hambúrguer 160g, cheddar, cebola caramelizada.", img: "img/carrasco.webp" },
        { nome: "Maria-Dia", preco: 19, desc: "Pão de Brioche, hambúrguer 160g, bacon, mussarela, cream cheese, alface, tomate, cebola.", img: "img/mariadia.webp" },
        { nome: "Farol", preco: 24, desc: "Pão de Brioche, 2 hambúrgueres 160g, cheddar, farofa de bacon.", img: "img/farol.webp" },
        { nome: "Acaú Meu Amor", preco: 25, desc: "Pão de Brioche, hambúrguer 160g, bacon, ovo, calabresa, frango desfiado, mussarela, cream cheese, alface, tomate, cebola, batata palha, ervilha e milho.", img: "img/acau.webp" },
        { nome: "Praia Azul", preco: 25, desc: "Pão de Brioche, hambúrguer 160g, fatia de cheddar, creme especial.", img: "img/praiaazul.webp" }
    ],
    tradicionais: [
        { nome: "X-Burguer", preco: 10, img: "img/xburguer.webp", desc: "Clássico", ingredientes: "Pão, carne, queijo, ovo e salada." },
        { nome: "X-Salada", preco: 8, img: "img/xsalada.webp", desc: "Simples e gostoso", ingredientes: "Pão, carne, queijo e salada." },
        { nome: "X-Bacon", preco: 14, img: "img/xbacon.webp", desc: "Muito bacon", ingredientes: "Pão, carne, queijo, bacon e salada." },
        { nome: "X-Frango", preco: 12, img: "img/xfrango.webp", desc: "Frango desfiado", ingredientes: "Pão, frango, queijo e salada." },
        { nome: "X-Calabresa", preco: 12, img: "img/xcalabresa.webp", desc: "Calabresa frita", ingredientes: "Pão, carne, calabresa e queijo." },
        { nome: "X-Tudo", preco: 15, img: "img/xtudo.webp", desc: "Completo", ingredientes: "Todos os ingredientes tradicionais." },
        { nome: "Poderoso Cheddar", preco: 13, img: "img/cheddar.webp", desc: "Muito cheddar", ingredientes: "Pão, carne e cheddar." }
    ],
    sandubas: [
        { nome: "Sanduba Frango", preco: 20, img: "img/sanduba-frango.webp", desc: "Pão baguete de 20cm, frango com cream cheese, milho, batata palha, queijo mussarela maçaricado, maionese ou molho verde, e salada (alface e tomate)." },
        { nome: "Sanduba Frango c/ Bacon", preco: 22, img: "img/sanduba-frangocombacon.webp", desc: "Pão baguete de 20cm, frango com cream cheese, farofa de bacon, cheddar maçaricado, maionese ou molho verde, e salada (alface e tomate)." },
        { nome: "Sanduba Carne de Sol", preco: 24, img: "img/sanduba-carnedesol.webp", desc: "Pão baguete de 20cm, carne de sol na nata, queijo coalho maçaricado, maionese ou molho verde, e salada (alface e tomate)." },
        { nome: "Sanduba Carne Seca", preco: 24, img: "img/sanduba-carneseca.webp", desc: "Pão baguete de 20cm, carne seca, queijo coalho maçaricado, maionese ou molho verde, e salada (alface e tomate)." }
    ],
    pasteis: [
        {nome:"Pastel Carne", preco:10, img:"img/pasteldecarne.webp", desc: "Carne, vinagrete, milho e ervilha."}, {nome:"Pastel Frango", preco:10, img:"img/pasteldefrango.webp", desc: "Frango, vinagrete, milho e ervilha."},
        {nome:"Pastel Calabresa", preco:10, img:"img/calabresa.webp", desc: "Calabresa, vinagrete, milho e ervilha."}, {nome:"Pastel Pizza", preco:10, img:"img/pizza.webp", desc: "Queijo, presunto, orégano, vinagrete, milho e ervilha."},
        {nome:"Pastel Presunto", preco:10, img:"img/presunto.webp", desc: "Presunto, vinagrete, milho e ervilha."}, {nome:"Pastel Misto", preco:10, img:"img/pastelmisto.webp", desc: "Frango, carne, presunto, calabresa, vinagrete, milho e ervilha."},
        {nome:"Pastel 3 Queijos", preco:14, img:"img/4queijos.webp", desc: "Queijo mussarela, cheddar, catupiry, vinagrete, milho e ervilha."}, {nome:"Pastel 4 Queijos", preco:14, img:"img/4queijos.webp", desc: "Queijo mussarela, queijo coalho, cheddar, catupiry, vinagrete, milho e ervilha."},
        {nome:"Pastel Charque", preco:14, img:"img/carnedesol.webp", desc: "Charque, queijo, vinagrete, milho e ervilha."}, {nome:"Pastel Carne de Sol", preco:14, img:"img/carnedesol.webp", desc: "Carne de sol, queijo, vinagrete, milho e ervilha."}, 
        {nome:"Pastel Frango com Bacon", preco:14, img:"img/frangocombacon.webp", desc: "Frango, bacon, queijo, vinagrete, milho e ervilha."}, {nome:"Pastel Queijo Coalho", preco:13, img:"img/queijocoalho.webp", desc: "Queijo Coalho, vinagrete, milho e ervilha."}, 
        {nome:"Pastel Chocolate", preco:14, img:"img/chocolate.webp", desc: "Chocolate Cremoso."}
    ],
    porcoespastel: [
        { nome: "Mini Pastéis", img: "img/6minipastel.webp", opcoes: [{label:"6 unidades", preco:7}, {label:"12 unidades", preco:14}], sabores: ["Pizza", "Queijo"] }
    ],
    porcoes: [
        {nome:"Fritas Pequena", preco:10, img:"img/batata.webp"}, {nome:"Fritas Média", preco:18, img:"img/batata.webp"},
        {nome:"Fritas Grande", preco:25, img:"img/batata.webp"}, {nome:"Batata Cheddar Bacon", preco:25, img:"img/batatabacon.webp"},
        {nome:"Fritas Pequena com Calabresa", preco:15, img:"img/batatacalabresa.webp"}, {nome:"Fritas Média com Calabresa", preco:20, img:"img/batatacalabresa.webp"},
        {nome:"Fritas Grande com Calabresa", preco:32, img:"img/batatacalabresa.webp"}
    ],
    salgados: [
        { nome: "Coxinha", preco: 6, img: "img/coxinha.webp", desc: "Frango" },
        { nome: "Cachorro Quente", preco: 6, img: "img/cachorro-quente.webp", desc: "Pão, carne, salsicha, vinagrete, milho e evilha, batata palha, queijo ralado e molhos." },
        { nome: "Misto Quente", preco: 7, img: "img/misto-quente.webp", desc: "Queijo cremoso" }
    ],
    sucos: [
    { 
        nome: "Suco Natural (500ml)", 
        preco: 7, // Preço fixo
        img: "img/suco.webp", 
        sabores: ["Cajá", "Abacaxi com Hortelã", "Maracujá", "Graviola", "Mangaba", "Acerola"] 
    },
    { 
        nome: "Suco com Leite (500ml)", 
        preco: 10, // Preço fixo
        img: "img/suco.webp", 
        sabores: ["Cajá", "Abacaxi com Hortelã", "Maracujá", "Graviola", "Mangaba", "Acerola"]  
    }
    ],
    bebidas: [
        { nome: "Mini Refri Guaraná", preco: 3, img: "img/minirefri.webp", desc: "250ml" },
        { nome: "Coca-Cola Lata", preco: 7, img: "img/coca-lata.webp", desc: "350ml" },
        { nome: "Coca-Cola Zero Lata ", preco: 7, img: "img/cocazero.webp", desc: "350ml" },
        { nome: "Guaraná Antartica Lata", preco: 7, img: "img/guaranalata.webp", desc: "350ml" },
        { nome: "Coca-Cola 1L", preco: 10, img: "img/coca1l.webp", desc: "1000ml" },
        { nome: "Coca-Cola Zero 1L", preco: 10, img: "img/cocazero1l.webp", desc: "1000ml" },
        { nome: "Guaraná Antartica 1L", preco: 10, img: "img/guarana1l.webp", desc: "1000ml" },
        { nome: "Coca-Cola 2L", preco: 16, img: "img/coca2l.webp", desc: "2000ml" },
        { nome: "Guaraná Antartica 2L", preco: 16, img: "img/guarana2l.webp", desc: "2000ml" }  
    ],
    acai: [
    { 
        nome: "Açaí na Tigela", 
        img: "img/acai.webp", 
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
        img: "img/sorvete.webp",
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
            <h3 style="margin-bottom: 15px;">${produto.nome}</h3>
            
            <div style="padding: 0 15px; text-align: left;">
                <label style="display: block; font-size: 14px; color: #ffca2c; margin-bottom: 5px; font-weight: bold;">
                    1. Escolha o Tamanho:
                </label>
                <select class="select-tamanho" onchange="resetarEMudarTamanho(this)" 
                    style="width: 100%; padding: 12px; margin-bottom: 20px; border-radius: 8px; background: #1a1a1a; color: white; border: 1px solid #444; font-size: 16px;">
                    ${produto.opcoes.map(op => `<option value="${op.preco}" data-limite="${op.limiteBolas}">${op.label} - R$ ${op.preco.toFixed(2)}</option>`).join("")}
                </select>

                <div class="montagem-secao">
                    <div class="instrucao-montagem" style="background: rgba(255, 202, 44, 0.1); color: #ffca2c; padding: 10px; border-radius: 8px; font-size: 13px; text-align: center; margin-bottom: 15px; border: 1px dashed #ffca2c;">
                        ⚠️ Importante: Escolha as bolas e acompanhamentos abaixo!
                    </div>

                    <p class="secao-titulo" style="color: #fff; font-size: 15px; margin-bottom: 10px;">
                        <strong>2. Sabor desejado (<span class="count-bolas">0</span> selecionadas)</strong>
                    </p>
                    <div class="bolas-grid" style="display: grid; gap: 10px; margin-bottom: 20px;">
                        ${['Açaí', 'Ninho','Cupuaçu'].map(tipo => `
                            <div class="item-controle" style="display: flex; justify-content: space-between; align-items: center; background: #222; padding: 8px 12px; border-radius: 8px;">
                                <span style="color: #eee;">${tipo}</span>
                                <div class="qty-control">
                                    <button onclick="alterarBola('${tipo}', -1, this)">−</button>
                                    <span class="qtd-bola-${tipo}" style="min-width: 20px; text-align: center;">0</span>
                                    <button onclick="alterarBola('${tipo}', 1, this)">+</button>
                                </div>
                            </div>
                        `).join("")}
                    </div>

                    <p class="secao-titulo" style="color: #fff; font-size: 15px; margin-bottom: 5px;">
                        <strong>3. Acompanhamentos</strong>
                    </p>
                    <p class="info-adicional" style="font-size: 12px; color: #aaa; margin-bottom: 10px;">✅Escolha quantos itens quiser (1x de cada é grátis!). Repetir o mesmo item: + R$ 2,00 cada.</p>
                    <div class="extras-grid" style="display: grid; gap: 8px; margin-bottom: 15px;">
                        ${acompanhamentosAcai.map(acc => `
                            <div class="item-controle" style="display: flex; justify-content: space-between; align-items: center; background: #222; padding: 8px 12px; border-radius: 8px;">
                                <span style="color: #eee;">${acc}</span>
                                <div class="qty-control">
                                    <button onclick="alterarAcc('${acc}', -1, this)">−</button>
                                    <span class="qtd-acc" data-nome="${acc}" style="min-width: 20px; text-align: center;">0</span>
                                    <button onclick="alterarAcc('${acc}', 1, this)">+</button>
                                </div>
                            </div>
                        `).join("")}
                    </div>

                    <label style="display: block; font-size: 14px; color: #ffca2c; margin-bottom: 5px; font-weight: bold;">
                        4. Alguma observação?
                    </label>
                    <div class="item-obs" style="margin-bottom: 20px;">
                        <input type="text" placeholder="Ex: (Sem amendoim, extra leite em pó)" 
                            class="individual-obs" 
                            style="width: 100%; padding: 12px; border-radius: 8px; background: #1a1a1a; color: #fff; border: 1px solid #444; font-size: 14px;">
                    </div>
                </div>
            </div>

            <div class="footer-acai" style="padding: 15px; border-top: 1px solid #333; text-align: center;">
                <p class="price preco-final-display" style="font-size: 22px; margin-bottom: 15px; color: #fff;">R$ ${produto.opcoes[0].preco.toFixed(2)}</p>
                <button class="add-btn" style="width: 100%; padding: 15px; border-radius: 30px; background: red; color: white; border: none; font-weight: bold; cursor: pointer; font-size: 16px;" 
                    onclick="finalizarPedidoAcai(this, '${produto.nome}')">
                    Adicionar ao Carrinho
                </button>
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

function obterNumeroPedidoDia() {
    const hoje = new Date().toLocaleDateString(); // Pega a data atual (ex: 25/02/2026)
    let contadorData = localStorage.getItem("last_order_date");
    let contadorNumero = parseInt(localStorage.getItem("last_order_number")) || 0;

    // Se a data salva for diferente de hoje, resetamos para o pedido nº 1
    if (contadorData !== hoje) {
        contadorNumero = 1;
        localStorage.setItem("last_order_date", hoje);
    } else {
        // Se for o mesmo dia, apenas soma +1
        contadorNumero++;
    }

    localStorage.setItem("last_order_number", contadorNumero);
    return contadorNumero;
}

function finalizarPedidoAcai(botao, nome) {
    const card = botao.closest('.card');
    const select = card.querySelector('.select-tamanho');
    
    // Captura o limite e o nome do tamanho selecionado para a validação
    const limite = parseInt(select.options[select.selectedIndex].getAttribute('data-limite'));
    const tamanhoTxt = select.options[select.selectedIndex].text.split('-')[0].trim();
    
    // Validação que você deseja: não deixar pedir menos bolas do que o tamanho permite
    if (montagemAcai.bolas.length < limite) {
        alert(`O tamanho ${tamanhoTxt} inclui ${limite} bolas. Selecione pelo menos essa quantidade antes de adicionar!`);
        return;
    }

    // Se passou na validação, seguimos com o preço e a observação
    const precoTexto = card.querySelector('.preco-final-display').innerText;
    const precoFinal = parseFloat(precoTexto.replace('R$ ', '').replace(',', '.'));
    
    const obsInput = card.querySelector(".individual-obs");
    const observacao = obsInput ? obsInput.value.trim() : "";

    // Formatação dos detalhes para o WhatsApp
    let detalhes = `Tam: ${tamanhoTxt} | Bolas: ${formatarBolas(montagemAcai.bolas)}`;
    
    let accs = [];
    for (let nomeAcc in montagemAcai.acompanhamentos) {
        if (montagemAcai.acompanhamentos[nomeAcc] > 0) {
            accs.push(`${montagemAcai.acompanhamentos[nomeAcc]}x ${nomeAcc}`);
        }
    }
    
    if (accs.length > 0) detalhes += ` | Accs: ${accs.join(", ")}`;
    if (observacao) detalhes += ` | OBS: ${observacao}`;

    // Adiciona ao carrinho
    addToCart(`${nome} (${detalhes})`, precoFinal, 1);
    
    // Feedback visual e Reset
    aplicarEfeitoFeedback(botao);
    setTimeout(() => {
        resetarEMudarTamanho(select);
        if (obsInput) obsInput.value = "";
    }, 1500);
}

function addSuco(btn, nome, precoBase) {
    const card = btn.closest(".card");
    const sabor = card.querySelector(".select-sabor").value;
    const qtd = parseInt(card.querySelector(".qty-control span").innerText);

    if (!sabor) {
        alert("Por favor, selecione o sabor do suco!");
        return;
    }

    addToCart(`${nome} (${sabor})`, precoBase, qtd);
    aplicarEfeitoFeedback(btn);
}

function gerarCards(categoria, containerId) {
    let container = document.getElementById(containerId);
    if (!container || !produtos[categoria]) return;
    container.innerHTML = "";

    produtos[categoria].forEach(produto => {

        // 1. LÓGICA ESPECIAL PARA AÇAÍ
        if (categoria === "acai") {
            container.innerHTML += gerarCardAcai(produto);
        }

        // 2. LÓGICA PARA SORVETES
        else if (categoria === "sorvete") {
            container.innerHTML += gerarCardSorvete(produto);
        }

        // 3. LÓGICA PARA MINI PASTÉIS E SUCOS (COM SELETORES)
        else if (produto.sabores) {
            let isSuco = categoria === "sucos";
            
            // Aqui está o segredo: verificamos se tem opções antes de tentar criar o Passo 1
            let temOpcoes = produto.opcoes && produto.opcoes.length > 0;

            container.innerHTML += `
                <div class="card">
                    <img src="${produto.img}" alt="${produto.nome}">
                    <h3 style="margin-bottom: 15px;">${produto.nome}</h3>
            
                    <div style="padding: 0 15px; text-align: left;">
                        ${temOpcoes ? `
                            <label style="display: block; font-size: 14px; color: #ffca2c; margin-bottom: 5px; font-weight: bold;">
                                1. Escolha a quantidade de unidades:
                            </label>
                            <select class="select-qtd" style="width: 100%; padding: 12px; margin-bottom: 15px; border-radius: 8px; background: #1a1a1a; color: white; border: 1px solid #444; font-size: 16px;">
                                ${produto.opcoes.map(op => `<option value="${op.preco}">${op.label} - R$ ${op.preco.toFixed(2)}</option>`).join("")}
                            </select>
                            <label style="display: block; font-size: 14px; color: #ffca2c; margin-bottom: 5px; font-weight: bold;">
                                2. Escolha o sabor desejado:
                            </label>
                        ` : `
                            <p class="price" style="margin-bottom: 10px;">R$ ${produto.preco.toFixed(2)}</p>
                            <input type="hidden" class="select-qtd" value="${produto.preco}">
                            <label style="display: block; font-size: 14px; color: #ffca2c; margin-bottom: 5px; font-weight: bold;">
                                Escolha o sabor desejado:
                            </label>
                        `}

                        <select class="select-sabor" style="width: 100%; padding: 12px; margin-bottom: 20px; border-radius: 8px; background: #1a1a1a; color: white; border: 1px solid #444; font-size: 16px;">
                            <option value="">Clique para selecionar...</option>
                            ${produto.sabores.map(s => `<option value="${s}">${s}</option>`).join("")}
                        </select>
                    </div>

                    <div class="actions">
                        <div class="qty-control">
                            <button onclick="changeQty(this,-1)">−</button>
                            <span>1</span>
                            <button onclick="changeQty(this,1)">+</button>
                        </div>
                        <button class="add-btn" style="flex: 1; margin-left: 10px;" onclick="${isSuco ? `addSuco(this,'${produto.nome}',${produto.preco})` : `addMiniPastel(this,'${produto.nome}')`}">
                            Adicionar
                        </button>
                    </div>
                </div>`;
        }

        // 4. LÓGICA PARA PRODUTOS NORMAIS (Lanches, Porções, Bebidas, etc)
        else {
            let catComExtras = ["pasteis", "artesanais", "tradicionais", "porcoes", "sandubas"];
            let mostrarExtras = catComExtras.includes(categoria);
            let mostrarObs = categoria !== "bebidas";

            container.innerHTML += `
                <div class="card">
                    <img src="${produto.img}" alt="${produto.nome}">
                    <h3>${produto.nome}</h3>
                    ${produto.desc ? `<p class="desc-text">${produto.desc}</p>` : ""}
                    ${mostrarObs ? `<div class="item-obs"><input type="text" placeholder=" Observação (Ex: Sem Cebola)" class="individual-obs"></div>` : ""}
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

    const numPedido = obterNumeroPedidoDia();
    const dataAtual = new Date().toLocaleDateString();
    // 3. Montagem da Mensagem
    let msg = `🍔 *NOVO PEDIDO - LK LANCHES*\n`;
    msg += `──────────────────\n`;
    msg += `*--- PEDIDO Nº ${numPedido} ---*\n`;
    msg += `*Data:* ${dataAtual}\n\n`;
    msg += `──────────────────\n`;
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

let cart = [];

// ===============================
// ALTERAR QUANTIDADE (+ e -)
// ===============================
function changeQty(button, amount) {
  let span = button.parentElement.querySelector("span");
  let current = parseInt(span.innerText);

  current += amount;
  if (current < 1) current = 1;

  span.innerText = current;
}

function addMiniPastel(btn,nome){

let card = btn.closest(".card")

let selectQtd = card.querySelector(".select-qtd")
let selectSabor = card.querySelector(".select-sabor")

let preco = parseFloat(selectQtd.value)
let qtdLabel = selectQtd.options[selectQtd.selectedIndex].text
let sabor = selectSabor.value

let quantidade = parseInt(card.querySelector(".qty-control span").innerText)

addToCart(btn, nome + " - " + qtdLabel + " - " + sabor, preco, quantidade)
}

// ===============================
// ADICIONAR AO CARRINHO
// ===============================

function checkPayment(){
let payment = document.getElementById("payment").value
let trocoArea = document.getElementById("trocoArea")

if(payment === "Dinheiro"){
trocoArea.style.display = "block"
}else{
trocoArea.style.display = "none"
}

}
function addToCart(button, name, price) {

  let qty = parseInt(button.parentElement.querySelector("span").innerText);

  // verifica se o item já existe no carrinho
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

  // reseta quantidade para 1
  button.parentElement.querySelector("span").innerText = 1;
}

// ===============================
// ATUALIZAR CARRINHO
// ===============================
function updateCart() {

  let cartItems = document.getElementById("cartItems");
  let cartCount = document.getElementById("cartCount");
  let totalElement = document.getElementById("total");

  cartItems.innerHTML = "";

  let total = 0;
  let totalQty = 0;

  cart.forEach(item => {

    let subtotal = item.price * item.qty;
    total += subtotal;
    totalQty += item.qty;

    cartItems.innerHTML += `
      <p>${item.name} x${item.qty} - R$ ${subtotal.toFixed(2)}</p>
    `;
  });

  cartCount.innerText = totalQty;
  totalElement.innerText = "Total: R$ " + total.toFixed(2);
}

// ===============================
// ABRIR / FECHAR CARRINHO
// ===============================
function toggleCart() {
  document.getElementById("cartPanel").classList.toggle("open");
}

// ===============================
// FILTRO DE CATEGORIA
// ===============================
function filter(cat, button) {

  document.querySelectorAll(".categories button")
    .forEach(b => b.classList.remove("active"));

  if (button) button.classList.add("active");

  document.querySelectorAll(".card")
    .forEach(card => {

      if (cat === "all") {
        card.style.display = "flex";
      } else {
        card.style.display =
          card.classList.contains(cat) ? "flex" : "none";
      }

    });
}



// LISTA DE ADICIONAIS (FORA DO PRODUTOS)
const adicionais = [
{nome:"Bacon", preco:4},
{nome:"Cheddar", preco:3},
{nome:"Catupiry", preco:3},
{nome:"Cream Chesse", preco:4},
{nome:"Ovo", preco:2},
{nome:"Calabresa", preco:3},
{nome:"Queijo Coalho", preco:4},
{nome:"Molho Verde", preco:2}
]

// ============================
// LISTA COMPLETA DE PRODUTOS
// ============================

const produtos = {
combosTradicionais: [

{
nome:"Pequeno",
preco:18,
img:"img/combo1.png",
desc:"1 X-Burguer + Fritas Pequena",
ingredientes:"Pão, hambúrguer, ovo, presunto, mussarela, alface, tomate, cebola."
},

{
nome:"Médio",
preco:35,
img:"img/combo2.png",
desc:"2 Hambúrguer + Fritas Média com Calabresa e Cheddar",
ingredientes:"Pão, hambúrguer, mussarela, alface, tomate, cebola."
},

{
nome:"Grande",
preco:45,
img:"img/combo3.png",
desc:"3 Hambúrguer + Fritas Média com Calabresa e Cheddar",
ingredientes:"Pão, hambúrguer, mussarela, alface, tomate, cebola."
},

{
nome:"Gigante",
preco:60,
img:"img/combo4.png",
desc:"4 Hambúrguer + Fritas Grande com Calabresa e Cheddar",
ingredientes:"Pão, hambúrguer, mussarela, alface, tomate, cebola."
}

],

combosArtesanais: [

{
nome:"Solteirão",
preco:20,
img:"img/combo5.png",
desc:"1 Barra + Fritas Pequena",
ingredientes:"Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola."
},

{
nome:"Casal",
preco:42,
img:"img/combo6.png",
desc:"2 Barra + Fritas Média com Calabresa e Cheddar",
ingredientes:"Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola."
},

{
nome:"Amigos",
preco:55,
img:"img/combo6.png",
desc:"3 Barra + Fritas Média com Calabresa e Cheddar",
ingredientes:"Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola."
},

{
nome:"Familia",
preco:78,
img:"img/combo7.png",
desc:"4 Barra + Fritas Grande com Calabresa e Cheddar",
ingredientes:"Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola."
}

],


artesanais: [
{
nome:"Barra",
preco:12,
desc:"Pão de Brioche, hambúrguer 130g, mussarela, alface, tomate, cebola.",
img:"img/barra.png"
},
{
nome:"Pôr do Sol",
preco:15,
desc:"Pão de Brioche, hambúrguer 130g, ovo, mussarela, alface, tomate, cebola.",
img:"img/pordosol.png"
},
{
nome:"Crôa da Viúva",
preco:18,
desc:"Pão de Brioche, hambúrguer 130g, calabresa, mussarela, alface, tomate, cebola.",
img:"img/croa.png"
},
{
nome:"Pedra da Galé",
preco:18,
desc:"Pão de Brioche, hambúrguer 130g, frango desfiado, mussarela, alface, tomate, cebola.",
img:"img/pedra.png"
},
{
nome:"Carrasco",
preco:18,
desc:"Pão de Brioche, hambúrguer 160g, cheddar, cebola caramelizada.",
img:"img/carrasco.png"
},
{
nome:"Maria-Dia",
preco:19,
desc:"Pão de Brioche, hambúrguer 160g, bacon, mussarela, cream cheese, alface, tomate, cebola.",
img:"img/mariadia.png"
},
{
nome:"Farol",
preco:24,
desc:"Pão de Brioche, 2 hambúrgueres 160g, cheddar, farofa de bacon.",
img:"img/farol.png"
},
{
nome:"Acau Meu Amor",
preco:25,
desc:"Pão de Brioche, hambúrguer 160g, bacon, ovo, calabresa, frango desfiado, mussarela, cream cheese, alface, tomate, cebola, batata palha, ervilha e milho.",
img:"img/acau.png"
},
{
nome:"Praia Azul",
preco:25,
desc:"Pão de Brioche, hambúrguer 160g, fatia de cheddar, creme especial.",
img:"img/praiaazul.png"
}
],

tradicionais: [

{
nome:"X-Burguer",
preco:10,
img:"img/xburguer.png",
desc:"Clássico tradicional",
ingredientes:"Pão, hambúrguer, ovo, presunto, mussarela, alface crespa, tomate e cebola."
},

{
nome:"X-Salada",
preco:8,
img:"img/xsalada.png",
desc:"Tradicional com salada",
ingredientes:"Pão, hambúrguer, alface, tomate e cebola."
},

{
nome:"X-Bacon",
preco:14,
img:"img/xbacon.png",
desc:"Com bacon crocante",
ingredientes:"Pão, hambúrguer, bacon, presunto, mussarela, alface crespa, tomate e cebola."
},

{
nome:"X-Frango",
preco:12,
img:"img/xfrango.png",
desc:"Frango suculento",
ingredientes:"Pão, hambúrguer, frango desfiado, presunto, mussarela, alface crespa, tomate e cebola."
},

{
nome:"X-Calabresa",
preco:12,
img:"img/xcalabresa.png",
desc:"Calabresa especial",
ingredientes:"Pão, hambúrguer, calabresa, presunto, mussarela, alface crespa, tomate e cebola."
},

{
nome:"X-Tudo",
preco:15,
img:"img/xtudo.png",
desc:"O mais completo",
ingredientes:"Pão, 2 hambúrguer, 2 ovos, calabresa, frango desfiado, presunto, mussarela, alface, tomate, cebola, milho e ervilha."
},

{
nome:"Poderoso Cheddar",
preco:13,
img:"img/cheddar.png",
desc:"Explosão de cheddar",
ingredientes:"Pão, hambúrguer, cheddar cremoso, cebola caramelizada."
}

],

sandubas: [

{
nome:"Sanduba Frango",
preco:20,
img:"img/sanduba-frango.png",
desc:"Pão baguete 20cm",
ingredientes:"Frango com cream cheese, milho, batata palha, mussarela maçaricada, maionese/molho verde, alface e tomate."
},

{
nome:"Sanduba Frango c/ Bacon",
preco:22,
img:"img/sanduba-frangocombacon.png",
desc:"Pão baguete 20cm",
ingredientes:"Frango com cream cheese, farofa de bacon, cheddar maçaricado, maionese/molho verde, alface e tomate."
},

{
nome:"Sanduba Carne de Sol",
preco:24,
img:"img/sanduba-carnedesol.png",
desc:"Pão baguete 20cm",
ingredientes:"Carne de sol na nata, queijo coalho maçaricado, maionese/molho verde, alface e tomate."
},

{
nome:"Sanduba Carne Seca",
preco:24,
img:"img/sanduba-carneseca.png",
desc:"Pão baguete 20cm",
ingredientes:"Carne seca, queijo coalho maçaricado, maionese/molho verde, alface e tomate."
}

],

pasteis: [
{nome:"Pastel Carne", preco:10, img:"img/pasteldecarne.png"},
{nome:"Pastel Frango", preco:10, img:"img/pasteldefrango.png"},
{nome:"Pastel Calabresa", preco:10, img:"img/calabresa.png"},
{nome:"Pastel Pizza", preco:10, img:"img/pizza.png"},
{nome:"Pastel Presunto", preco:10, img:"img/presunto.png"},
{nome:"Pastel 3 Queijos", preco:8, img:"img/4queijos.png"},
{nome:"Pastel 4 Queijos", preco:8, img:"img/4queijos.png"},
{nome:"Pastel Charque", preco:8, img:"img/carnedesol.png"},
{nome:"Pastel Carne de Sol", preco:8, img:"img/carnedesol.png"},
{nome:"Pastel Frango com Bacon", preco:8, img:"img/frangocombacon.png"}
],

porcoespastel: [
{
nome:"Mini Pastéis",
img:"img/6minipastel.png",
opcoes:[
{label:"6 unidades", preco:15},
{label:"12 unidades", preco:28}
],
sabores:["Pizza","Queijo"]
}
],

porcoes: [
{nome:"Fritas Pequena", preco:10, img:"img/batata.png"},
{nome:"Fritas Média", preco:18, img:"img/batata.png"},
{nome:"Fritas Grande", preco:25, img:"img/batata.png"},
{nome:"Batata Cheddar Bacon", preco:25, img:"img/batatabacon.png"},
{nome:"Fritas Pequena + Calabresa", preco:15, img:"img/batatacalabresa.png"},
{nome:"Fritas Média + Calabresa", preco:20, img:"img/batatacalabresa.png"},
{nome:"Fritas Grande + Calabresa", preco:32, img:"img/batatacalabresa.png"},
],

salgados: [

{
nome:"Coxinha",
preco:6,
img:"img/coxinha.png",
desc:"Frango",
ingredientes:"Massa crocante com recheio especial."
},

{
nome:"Pastel de forno",
preco:7,
img:"img/pastelforno.png",
desc:"Tradicional",
ingredientes:"Massa amanteigada e recheio de frango."
},

{
nome:"Cachorro Quente",
preco:7,
img:"img/cachorro-quente.png",
desc:"Tradicional",
ingredientes:"O melhor da região."
},

{
nome:"Misto Quente",
preco:7,
img:"img/misto-quente.png",
desc:"Clássico",
ingredientes:"Mussarela derretida e presunto saboroso."
}

],

bebidas: [

{
nome:"Coca-Cola Lata",
preco:6,
img:"img/coca-lata.png",
desc:"350ml",
ingredientes:"Refrigerante gelado."
},

{
nome:"Guaraná Lata",
preco:6,
img:"img/guarana-lata.png",
desc:"350ml",
ingredientes:"Refrigerante gelado."
},

{
nome:"Fanta Lata",
preco:6,
img:"img/fanta-lata.png",
desc:"350ml",
ingredientes:"Refrigerante gelado."
},

{
nome:"Coca-Cola 2L",
preco:12,
img:"img/coca2l.png",
desc:"2 Litros",
ingredientes:"Refrigerante gelado."
},

{
nome:"Suco natural",
preco:6,
img:"img/suco.png",
desc:"350ml",
ingredientes:"Suco refrescante."
}

]

}


// ============================
// GERAR CARDS AUTOMATICAMENTE
// ============================

function gerarCards(categoria, containerId){

let container = document.getElementById(containerId)
container.innerHTML = ""

produtos[categoria].forEach(produto => {

if(produto.opcoes){

// =========================
// MINI PASTEL (SEM ADICIONAIS)
// =========================

container.innerHTML += `
<div class="card">
<img src="${produto.img}" alt="${produto.nome}">
<h3>${produto.nome}</h3>

<select class="select-qtd">
${produto.opcoes.map(op => 
`<option value="${op.preco}">
${op.label} - R$ ${op.preco.toFixed(2)}
</option>`
).join("")}
</select>

<select class="select-sabor">
${produto.sabores.map(sabor => 
`<option value="${sabor}">
${sabor}
</option>`
).join("")}
</select>

<div class="actions">
<div class="qty-control">
<button onclick="changeQty(this,-1)">−</button>
<span>1</span>
<button onclick="changeQty(this,1)">+</button>
</div>

<button class="add-btn"
onclick="addMiniPastel(this,'${produto.nome}')">
Adicionar
</button>
</div>
</div>
`

} else {

// =========================
// LANCHES NORMAIS (COM ADICIONAIS)
// =========================

// CATEGORIAS QUE TERÃO ADICIONAIS
let categoriasComExtras = ["pasteis","artesanais","tradicionais","porcoes","sandubas"]
let mostrarExtras = categoriasComExtras.includes(categoria)

container.innerHTML += `
<div class="card">
<img src="${produto.img}" alt="${produto.nome}">
<h3>${produto.nome}</h3>
${produto.desc ? `<p>${produto.desc}</p>` : ""}
${produto.ingredientes ? `<p class="ingredientes">${produto.ingredientes}</p>` : ""}

${mostrarExtras ? `
<div class="extras-container">

<button class="btn-extras" onclick="toggleExtras(this)">
➕ Adicionais
</button>

<div class="extras-box" style="display:none;">
<div class="extras-grid">
${adicionais.map(extra => `
<label class="extra-item">
<input type="checkbox"
value="${extra.preco}"
data-nome="${extra.nome}">
<span>+ ${extra.nome}</span>
<small>R$ ${extra.preco.toFixed(2)}</small>
</label>
`).join("")}
</div>
</div>

</div>
` : ""}

<p class="price">R$ ${produto.preco.toFixed(2)}</p>

<div class="actions">
<div class="qty-control">
<button onclick="changeQty(this,-1)">−</button>
<span>1</span>
<button onclick="changeQty(this,1)">+</button>
</div>

<button class="add-btn"
onclick="addToCartComExtras(this,'${produto.nome}',${produto.preco})">
Adicionar
</button>
</div>
</div>
`
}

})

}

gerarCards("combosTradicionais","combos-tradicionais-list")
gerarCards("combosArtesanais","combos-artesanais-list")
gerarCards("artesanais","artesanais-list")
gerarCards("tradicionais","tradicionais-list")
gerarCards("sandubas","sanduba-list")
gerarCards("pasteis","pasteis-list")
gerarCards("porcoes","porcoes-list")
gerarCards("porcoespastel","porcoespastel-list")
gerarCards("salgados","salgados-list")
gerarCards("bebidas","bebidas-list")

// ============================
// CARRINHO
// ============================

function changeQty(button, amount){
let span = button.parentElement.querySelector("span")
let current = parseInt(span.innerText)
current += amount
if(current < 1) current = 1
span.innerText = current
}

function addToCart(button,name,price){
let qty = parseInt(button.parentElement.querySelector("span").innerText)

let existing = cart.find(item => item.name === name)

if(existing){
existing.qty += qty
}else{
cart.push({name, price, qty})
}

updateCart()
button.parentElement.querySelector("span").innerText = 1
}

function toggleExtras(button){

let container = button.closest(".extras-container")
let box = container.querySelector(".extras-box")

if(box.style.display === "none"){
box.style.display = "block"
button.innerHTML = "➖ Ocultar adicionais"
} else {
box.style.display = "none"
button.innerHTML = "➕ Adicionais"
}

}

function addToCartComExtras(button,nome,precoBase){

let card = button.closest(".card")
let quantidade = parseInt(card.querySelector(".qty-control span").innerText)

let totalExtras = 0
let nomesExtras = []

let checkboxes = card.querySelectorAll("input[type='checkbox']:checked")

checkboxes.forEach(extra=>{
totalExtras += Number(extra.value)
nomesExtras.push(extra.getAttribute("data-nome"))
})

let precoUnitario = precoBase + totalExtras
let nomeFinal = nome

if(nomesExtras.length > 0){
nomeFinal += " (" + nomesExtras.join(", ") + ")"
}

// adiciona quantidade correta
for(let i=0;i<quantidade;i++){
addToCart(button,nomeFinal,precoUnitario)
}

// 🔥 FECHAR ADICIONAIS AUTOMATICAMENTE
let extrasContainer = card.querySelector(".extras-container")
if(extrasContainer){

let box = extrasContainer.querySelector(".extras-box")
let btn = extrasContainer.querySelector(".btn-extras")

box.style.display = "none"
btn.innerHTML = "➕ Adicionais"

// 🔥 LIMPAR CHECKBOX
checkboxes.forEach(cb => cb.checked = false)

}

// 🔥 RESETAR QUANTIDADE PARA 1
card.querySelector(".qty-control span").innerText = 1

}

function updateCart(){

let cartItems=document.getElementById("cartItems")
let cartCount=document.getElementById("cartCount")
let totalElement=document.getElementById("total")

cartItems.innerHTML=""
let total=0
let totalQty=0

cart.forEach((item,index)=>{

let subtotal=item.price*item.qty
total+=subtotal
totalQty+=item.qty

cartItems.innerHTML+=`
<div style="margin-bottom:10px;border-bottom:1px solid #333;padding-bottom:8px;">
<p>${item.name}</p>

<div style="display:flex;justify-content:space-between;align-items:center;">

<div>
<button onclick="changeCartQty(${index},-1)">−</button>
<span style="margin:0 10px;">${item.qty}</span>
<button onclick="changeCartQty(${index},1)">+</button>
</div>

<strong>R$ ${subtotal.toFixed(2)}</strong>

</div>
</div>
`
})

cartCount.innerText=totalQty
totalElement.innerText="Total: R$ "+total.toFixed(2)
}

function changeCartQty(index, amount){

cart[index].qty += amount

if(cart[index].qty <= 0){
cart.splice(index,1)
}

updateCart()
}

function toggleCart(){
document.getElementById("cartPanel").classList.toggle("active")
}

function sendWhatsApp() {
  const address = document.getElementById("address").value.trim();
  const payment = document.getElementById("payment").value;
  const obs = document.getElementById("obs").value.trim();
  const troco = document.getElementById("troco").value;

  if(cart.length === 0){
    alert("Seu carrinho está vazio!");
    return;
  }

  if(!address){
    alert("Digite seu endereço!");
    return;
  }

  if(!payment){
    alert("Selecione a forma de pagamento!");
    return;
  }

  if(payment === "Dinheiro" && !troco){
    alert("Digite o valor que vai pagar em dinheiro!");
    return;
  }

  let msg = "🍔 Pedido LK Lanches:\n\n";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.qty;
    msg += `- ${item.qty} x ${item.name}  = R$ ${subtotal.toFixed(2)}\n`;
    total += subtotal;
  });

  msg += `Observações: ${obs}\n`;
  msg += `\nTotal: R$ ${total.toFixed(2)}\n`;
  msg += `Endereço: ${address}\n`;

  if(payment === "Dinheiro"){
    const trocoFinal = (parseFloat(troco) - total).toFixed(2);
    msg += `Pagamento: Dinheiro (vai pagar com R$ ${parseFloat(troco).toFixed(2)})\n`;
    msg += `Troco: R$ ${trocoFinal}\n`;
  } else {
    msg += `Pagamento: ${payment}\n`;
  }


  // Abre WhatsApp
  window.open(`https://wa.me/5583999963331?text=${encodeURIComponent(msg)}`);
}

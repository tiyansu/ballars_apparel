/* Balar's Apparel - simple JavaScript (product filter + working cart) */

var CART_KEY = 'balarCart';

function getCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_KEY)) || [];
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function peso(n) {
  return '\u20B1' + n.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

/* ---------- Product page ---------- */
function show(category, clicked) {
  var cards = document.querySelectorAll('.card');
  var shown = 0;

  for (var i = 0; i < cards.length; i++) {
    var match = category === 'all' || cards[i].dataset.category === category;
    cards[i].hidden = !match;
    if (match) { shown++; }
  }

  var empty = document.getElementById('empty');
  if (empty) { empty.hidden = shown !== 0; }

  var buttons = document.querySelectorAll('.options .btn');
  for (var j = 0; j < buttons.length; j++) {
    buttons[j].classList.remove('active');
  }
  clicked.classList.add('active');
}

function addToCart(button) {
  var card = button.closest('.card');
  var name = card.querySelector('h3').textContent;
  var price = parseFloat(card.querySelector('.price').textContent.replace(/[^0-9.]/g, ''));

  var cart = getCart();
  var found = false;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].name === name) {
      cart[i].qty++;
      found = true;
    }
  }
  if (!found) { cart.push({ name: name, price: price, qty: 1 }); }
  saveCart(cart);

  var old = button.textContent;
  button.textContent = 'Added!';
  setTimeout(function () { button.textContent = old; }, 900);
}

/* ---------- Cart page ---------- */
function changeQty(index, amount) {
  var cart = getCart();
  cart[index].qty += amount;
  if (cart[index].qty < 1) { cart.splice(index, 1); }
  saveCart(cart);
  renderCart();
}

function removeItem(index) {
  var cart = getCart();
  cart.splice(index, 1);
  saveCart(cart);
  renderCart();
}

function renderCart() {
  var body = document.getElementById('cart-body');
  if (!body) { return; }

  var cart = getCart();
  var subtotal = 0;
  var html = '';

  if (cart.length === 0) {
    html = '<tr><td colspan="5">Your cart is empty.</td></tr>';
  }

  for (var i = 0; i < cart.length; i++) {
    var total = cart[i].price * cart[i].qty;
    subtotal += total;
    html += '<tr>' +
      '<td>' + cart[i].name + '</td>' +
      '<td>' + peso(cart[i].price) + '</td>' +
      '<td><button type="button" onclick="changeQty(' + i + ', -1)">-</button> ' +
      cart[i].qty +
      ' <button type="button" onclick="changeQty(' + i + ', 1)">+</button></td>' +
      '<td>' + peso(total) + '</td>' +
      '<td><button type="button" onclick="removeItem(' + i + ')">Remove</button></td>' +
      '</tr>';
  }

  body.innerHTML = html;
  document.getElementById('subtotal').textContent = peso(subtotal);
  document.getElementById('total').textContent = peso(subtotal);
}

function checkout() {
  if (getCart().length === 0) {
    alert('Your cart is empty.');
    return;
  }
  alert('Redirecting to checkout...');
}

/* ---------- Run on page load ---------- */
document.addEventListener('DOMContentLoaded', function () {
  var addButtons = document.querySelectorAll('.card .btn');
  for (var i = 0; i < addButtons.length; i++) {
    addButtons[i].addEventListener('click', function () { addToCart(this); });
  }
  renderCart();
});

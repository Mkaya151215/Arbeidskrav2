//! variables
const cartBtn = document.querySelector(".cart-btn");
const clearCartBtn = document.querySelector(".btn-clear");
const mainPageBtn = document.querySelector(".btn-main");
const cartTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-list");

const productService = new ProductService();

let cart = [];


class UI {
  saveCartValues(cart) {
    let tempTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
  }
  
  addCartItem(item) {
    const li = document.createElement("li");
    li.classList.add("cart-list-item");
    li.innerHTML = `
            <div class="cart-left">
                <div class="cart-left-image">
                    <img src="${item.image}" alt="product" class="img-fluid" />
                </div>
                <div class="cart-left-info">
                    <a class="cart-left-info-title" href="#">${item.title}</a>
                    <span class="cart-left-info-price">$ ${item.price}</span>
                </div>
            </div>
            <div class="cart-right">
                <div class="cart-right-quantity">
                    <button class="quantity-minus" data-id=${item.id}>
                        <i class="fas fa-minus"></i>
                    </button>
                    <span class="quantity">${item.amount}</span>
                    <button class="quantity-plus" data-id=${item.id}>
                        <i class="fas fa-plus"></i>
                    </button>
                </div>
                <div class="cart-right-remove">
                    <button class="cart-remove-btn" data-id=${item.id}>
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    cartContent.appendChild(li);
  }

  setupAPP() {
    cart = Storage.getCart();
    this.saveCartValues(cart);
    this.populateCart(cart);
  }

  populateCart(cart) {
    cart.forEach((item) => this.addCartItem(item));
  }

  cartLogic() {
    clearCartBtn.addEventListener("click", () => {
      this.clearCart();
    });
    mainPageBtn.addEventListener("click", () => {
      window.location.href = `index.html`;
    });

    cartContent.addEventListener("click", (event) => {
      if (event.target.classList.contains("cart-remove-btn")) {
        let removeItem = event.target;
        let id = removeItem.dataset.id;
        removeItem.parentElement.parentElement.parentElement.remove();
        this.removeItem(id);
      } else if (event.target.classList.contains("quantity-minus")) {
        let lowerAmount = event.target;
        let id = lowerAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount - 1;
        if (tempItem.amount > 0) {
          Storage.saveCart(cart);
          this.saveCartValues(cart);
          lowerAmount.nextElementSibling.innerText = tempItem.amount;
        } else {
          lowerAmount.parentElement.parentElement.parentElement.remove();
          this.removeItem(id);
        }
      } else if (event.target.classList.contains("quantity-plus")) {
        let addAmount = event.target;
        let id = addAmount.dataset.id;
        let tempItem = cart.find((item) => item.id === id);
        tempItem.amount = tempItem.amount + 1;
        Storage.saveCart(cart);
        this.saveCartValues(cart);
        addAmount.previousElementSibling.innerText = tempItem.amount;
      }
    });
  }

  clearCart() {
    let cartItems = cart.map((item) => item.id);
    cartItems.forEach((id) => this.removeItem(id));
    while (cartContent.children.length > 0) {
      cartContent.removeChild(cartContent.children[0]);
    }
  }

  removeItem(id) {
    cart = cart.filter((item) => item.id !== id);
    this.saveCartValues(cart);
    Storage.saveCart(cart);
    let button = this.getSinleButton(id);
    button.disabled = false;
    button.style.opacity = "1";
  }

  getSinleButton(id) {
    return buttonsDOM.find(button => button.dataset.id === id);
  }
}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  }

  static async getProduct(id) {
    let data = await productService.getProduct(id);
    return data;
  }

  static saveCart(cart) {
    localStorage.setItem("cart", JSON.stringify(cart));
  }

  static getCart() {
    return localStorage.getItem("cart")
      ? JSON.parse(localStorage.getItem("cart"))
      : [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const ui = new UI();

  ui.setupAPP();

  productService
    .getAllProducts()
    .then((products) => {
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.cartLogic();
    });
});

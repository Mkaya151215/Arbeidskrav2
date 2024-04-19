//! variables
const cartBtn = document.querySelector(".cart-btn");
const clearCartBtn = document.querySelector(".btn-clear");
const basketBtn = document.querySelector(".btn-basket");
const cartItems = document.querySelector(".cart-items");
const cartTotal = document.querySelector(".total-value");
const cartContent = document.querySelector(".cart-list");
const productsDOM = document.querySelector("#products-dom");

const addButton = document.getElementById("add-btn");
const popup = document.querySelector('.popup');
const popupTitle = document.getElementById('popup-title');
const popupPrice= document.getElementById('popup-price');
const popupDescription = document.getElementById('popup-description');
const addPopupButton = document.getElementById('add-popup');
const closePopupButton = document.getElementById('close-popup');

const productService = new ProductService();

let cart = [];
let buttonsDOM = [];
let buttonsDeleteDOM = [];


class UI {
  displayProducts(products) {
    let result = "";
    products.forEach((item) => {
      result += `
            <div class="col-lg-4 col-md-6">
                <div class="product">
                    <div class="product-image">
                        <img src="${item.image}" alt="product" class="img-fluid" />
                    </div>
                    <div class="product-hover">
                        <span class="product-title">${item.title}</span>
                        <span class="product-price">$ ${item.price}</span>
                        <button class="btn-product btn-show-details" data-id=${item.id}>
                            <i class="fas fa-cart-white fa-info-circle"></i>
                        </button>
                        <button class="btn-product btn-delete" data-id=${item.id}>
                            <i class="fas fa-cart-white fa-trash"></i>
                        </button>
                        <button class="btn-product btn-add-to-cart" data-id=${item.id}>
                            <i class="fas fa-cart-white fa-cart-shopping"></i>
                        </button>
                    </div>
                </div>
            </div>
            `;
    });
    productsDOM.innerHTML = result;
  }

  async getBagButtons() {
    const buttonsDelete = [...document.querySelectorAll(".btn-delete")];
    buttonsDeleteDOM = buttonsDelete;
    buttonsDelete.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.setAttribute("disabled", "disabled");
        button.style.opacity = ".3";
      } else {
        button.addEventListener("click", (event) => {
          event.target.disabled = true;
          event.target.style.opacity = ".3";
          (async() => {
            //* get product from service
            await Storage.deleteProduct(id);
            location.reload(true);
          })();
        });
      }
    });

    const buttonsAddCart = [...document.querySelectorAll(".btn-add-to-cart")];
    buttonsDOM = buttonsAddCart;
    buttonsAddCart.forEach((button) => {
      let id = button.dataset.id;
      let inCart = cart.find((item) => item.id === id);
      if (inCart) {
        button.setAttribute("disabled", "disabled");
        button.style.opacity = ".3";
      } else {
        button.addEventListener("click", (event) => {
          event.target.disabled = true;
          event.target.style.opacity = ".3";
          let deleteButton =this.getDeleteButton(id);
          deleteButton.setAttribute("disabled", "disabled");
          deleteButton.style.opacity = ".3";
          (async() => {
            //* get product from service
            let product = await Storage.getProduct(id);
            let cartItem = {...product, amount: 1 };
            //* add procuct to the cart
            cart = [...cart, cartItem];
            //* save cart in local storage
            Storage.saveCart(cart);
            //* save cart values
            this.saveCartValues(cart);
            //* display cart item
            this.addCartItem(cartItem);
            //* show the cart
            this.showCart();
          })();
        });
      }
    });

    const buttonsDetails = [...document.querySelectorAll(".btn-show-details")];
    buttonsDetails.forEach((button) => {
      const productId = button.dataset.id;
      button.addEventListener("click", (event) => {
        window.location.href = `product-detail.html?id=${productId}`;
      });
    });
  }

  saveCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;
    cart.map((item) => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });

    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
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

  showCart() {
    cartBtn.click();
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
    basketBtn.addEventListener("click", () => {
      window.location.href = `basket.html`;
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
    let button = this.getCartButton(id);
    button.disabled = false;
    button.style.opacity = "1";
    let buttonDelete = this.getDeleteButton(id);
    buttonDelete.disabled = false;
    buttonDelete.style.opacity = "1";
  }

  getCartButton(id) {
    return buttonsDOM.find((button) => button.dataset.id === id);
  }

  getDeleteButton(id) {
    return buttonsDeleteDOM.find((button) => button.dataset.id === id);
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

  static async deleteProduct(id) {
    let data = await productService.deleteProduct(id);
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

  addButton.addEventListener("click", event => {
    popupTitle.value = "";
    popupDescription.value = "";
    popup.style.display = 'flex';
  });
  addPopupButton.addEventListener("click", event => {
    (async() => {
      await productService.addProduct({ title: popupTitle.value, description: popupDescription.value, price: popupPrice.value });
      location.reload(true);
    })();
  });
  closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
  });

  productService
    .getAllProducts()
    .then((products) => {
      ui.displayProducts(products);
      Storage.saveProducts(products);
    })
    .then(() => {
      ui.getBagButtons();
      ui.cartLogic();
    });
});
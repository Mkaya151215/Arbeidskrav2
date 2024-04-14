const itemElement = document.createElement("div");
document.addEventListener("DOMContentLoaded", () => {
  const itemList = document.getElementById("item-list");
  const deleteAllBtn = document.getElementById("delete-all");

  let cartItems = JSON.parse(localStorage.getItem("cart")) || [];
  
  console.log("shopping-cart innhold", cartItems);

  function displayCartItem() {
    itemList.innerHTML = "";
    if (cartItems.length === 0) {
      itemList.innerHTML = "<p>No items in cart</p>";
    } else {
      cartItems.forEach((item) => {
        const itemElement = document.createElement("div");
        itemElement.classList.add("item");

        itemElement.innerHTML = `
                    <img src="${item.image}" alt="${item.title}" class="item-image">
                    <div class="item-info">
                        <h3 class="item-title">${item.title}</h3>
                        <p class="item-price">$${item.price}</p>
                        <div class="item-quantity">
                            <button class="quantity-btn" data-id="${item.id}" data-action="decrease">-</button>
                            <span class="quantity">${item.amount}</span>
                            <button class="quantity-btn" data-id="${item.id}" data-action="increase">+</button>
                        </div>
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    </div>
                `;
        itemList.appendChild(itemElement);
      });
    }
  }

  displayCartItem();

  itemList.addEventListener("click", (event) => {
    if (event.target.classList.contains("remove-btn")) {
      const itemId = event.target.dataset.id;
      cartItems = cartItems.filter((item) => item.id !== itemId);
      localStorage.setItem("cart", JSON.stringify(cartItems));
      displayCartItem();
    }
  });

  itemList.addEventListener("click", (event) => {
    if (event.target.classList.contains("quantity-btn")) {
      const itemId = event.target.dataset.id;
      const action = event.target.dataset.action;
      const selectedItem = cartItems.find((item) => item.id === itemId);

      if (action === "decrease" && selectedItem.amount > 1) {
        selectedItem.amount--;
      } else if (action === "increase") {
        selectedItem.amount++;
      }

      localStorage.setItem("cart", JSON.stringify(cartItems));
      displayCartItem();
    }
  });

  deleteAllBtn.addEventListener("click", () => {
    cartItems = [];
    localStorage.removeItem("cart");
    displayCartItem();
  });
});

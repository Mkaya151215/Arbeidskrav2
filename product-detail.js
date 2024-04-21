const productDetail = document.querySelector(".product-detail");
const productDetailTitle = document.getElementById("product-detail-title");
const productDetailPrice = document.getElementById("product-detail-price");
const productDetailDescription = document.getElementById("product-detail-description");
const productDetailImage = document.getElementById("product-detail-image");
const editButton = document.getElementById("edit-product-detail");
const closeButton = document.getElementById("close-product-detail");

const popup = document.querySelector('.popup');
const popupTitle = document.getElementById('popup-title');
const popupPrice = document.getElementById('popup-price');
const popupDescription = document.getElementById('popup-description');
const popupImage = document.getElementById('popup-image');

const updatePopupButton = document.getElementById('update-popup');
const closePopupButton = document.getElementById('close-popup');

const productService = new ProductService();

function getProductIdFromQuery() {
  const params = new URLSearchParams(window.location.search);
  return params.get('id');
}

function displayProductDetails() {
  (async () => {
    let product = await ProductCrud.getProduct(getProductIdFromQuery());
    productDetailTitle.textContent = product.title;
    productDetailDescription.textContent = product.description;
    productDetailPrice.textContent = "$ " +product.price;
    productDetailImage.src = product.image;
    editButton.addEventListener("click", event => {
      popupTitle.value = product.title;
      popupDescription.value= product.description;
      popupPrice.value= product.price;
      popupImage.src= product.image;
      popup.style.display = 'flex';
    });
    updatePopupButton.addEventListener("click", event => {
      (async() => {
        await productService.updateProduct(product.id, { title: popupTitle.value, description: popupDescription.value, price: popupPrice.value });
        location.reload(true);
      })();
    });
    productDetail.style.display = "flex";
  })();
}

function addToBasket() {
  const product = getProductDetailsFromQuery();
    alert(`Added ${product.name} to basket!`);
}
document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener('load', displayProductDetails);


  closeButton.addEventListener("click", () => {
      window.location.href = `index.html`;
  });

  closePopupButton.addEventListener('click', () => {
    popup.style.display = 'none';
  });
});


class ProductCrud {
  static async saveProducts(id, title, description) {
    await productService.updateProduct(id, { title: title, description: description });
  }

  static async getProduct(id) {
    let data = await productService.getProduct(id);
    return data;
  }
}



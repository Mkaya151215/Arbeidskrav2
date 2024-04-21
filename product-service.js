const BASE_URL = "https://661433702fc47b4cf27bdd78.mockapi.io/products";

class ProductService {
  // GET request to retrieve all products
  async getAllProducts() {
    try {
      const response = await fetch(BASE_URL);
      const data = await response.json();
      console.log("All Products:", data);
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  async getProduct(productId) {
    try {
      const response = await fetch(`${BASE_URL}/${productId}`);
      const data = await response.json();
      console.log("Product:", data);
      return data;
    } catch (error) {
      console.error("Error fetching products:", error);
      throw error;
    }
  }

  // POST request to add a new product
  async addProduct(productData) {
    try {
      const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(productData),
      });
      const data = await response.json();
      console.log("Added Product:", data);
      return data;
    } catch (error) {
      console.error("Error adding product:", error);
      throw error;
    }
  }

  // PUT request to update a product
  async updateProduct(productId, updatedProductData) {
    try {
      const response = await fetch(`${BASE_URL}/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedProductData),
      });
      const data = await response.json();
      console.log("Updated Product:", data);
      return data;
    } catch (error) {
      console.error("Error updating product:", error);
      throw error;
    }
  }

  // DELETE request to delete a product
  async deleteProduct(productId) {
    try {
      const response = await fetch(`${BASE_URL}/${productId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      console.log("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
      throw error;
    }
  }
}

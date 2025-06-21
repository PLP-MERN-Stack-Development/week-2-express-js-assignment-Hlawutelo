class Product {
  constructor(id, name, category, price, description = '', inStock = true) {
    this.id = id;
    this.name = name;
    this.category = category;
    this.price = price;
    this.description = description;
    this.inStock = inStock;
  }
}

module.exports = Product;
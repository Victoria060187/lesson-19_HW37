const categories = {
    electronics: [
      { name: 'Laptop', price: 25000, description: 'Powerful and portable laptop for all your computing needs' },
      { name: 'Smartphone', price: 15000, description: 'Feature-packed smartphone with a stunning display' }
    ],
    clothing: [
      { name: 'Coat', price: 8000, description: 'Stylish and warm coat for the cold weather' },
      { name: 'Jacket', price: 5000, description: 'Lightweight jacket for a trendy look' }
    ],
    books: [
      { name: 'Classical literature', price: 800, description: 'Timeless classics that everyone should read' },
      { name: 'E-book', price: 650, description: 'Digital books for convenient reading on the go' }
    ]
  };
  
  const getElement = (selector) => document.querySelector(selector);
  const getElements = (selector) => document.querySelectorAll(selector);
  
  const displayProducts = (category) => {
    const productsList = getElement('#products');
    const productInfo = getElement('#product-info');
  
    productsList.textContent = '';
    productInfo.textContent = '';
  
    categories[category].forEach((product) => {
      const listItem = document.createElement('li');
      listItem.innerText = product.name;
      listItem.addEventListener('click', () => displayProductInfo(product));
      productsList.appendChild(listItem);
    });
  };
  
  const displayProductInfo = (product) => {
    const productInfo = getElement('#product-info');
    productInfo.textContent = '';
  
    const { name, price, description } = product;
  
    const productName = document.createElement('div');
    productName.innerText = name;
  
    const productPrice = document.createElement('div');
    productPrice.innerText = `Price: ${price} UAH`;
  
    const productDescription = document.createElement('p');
    productDescription.innerText = `Description: ${description}`;
  
    const buyButton = document.createElement('button');
    buyButton.innerText = 'Buy it now';
    buyButton.addEventListener('click', () => showOrderForm(product));
  
    productInfo.appendChild(productName);
    productInfo.appendChild(productPrice);
    productInfo.appendChild(productDescription);
    productInfo.appendChild(buyButton);
  };
  
  const showOrderForm = (product) => {
    const productInfo = getElement('#product-info');
    const orderForm = getElement('#order-form');
  
    productInfo.style.display = 'none';
    orderForm.style.display = 'block';
  
    const orderFormSubmit = getElement('#order-form');
    orderFormSubmit.addEventListener('submit', (event) => placeOrder(event, product));
  };
  
  const placeOrder = (event, product) => {
    event.preventDefault();
    const form = event.target;
    const { name, city, warehouse, payment, quantity, comment } = form.elements;
  
    if (!name.value.trim() || !city.value || !warehouse.value || !payment.value || !quantity.value) {
      displayErrorMessage('Please fill in all required fields.');
      return;
    }
  
    const nameRegex = /^[\p{L}\s-]+$/u;
    if (!nameRegex.test(name.value.trim())) {
      displayErrorMessage('Please enter a valid name containing only alphabetical characters, spaces, and hyphens.');
      return;
    }
  
    const quantityValue = parseInt(quantity.value);
    if (quantityValue <= 0) {
      displayErrorMessage('Please enter a quantity greater than 1.');
      return;
    }
  
    const orderInfo = document.createElement('div');
    orderInfo.innerHTML = `
      <h3>Order Information</h3>
      <p><strong>Product:</strong> ${product.name}</p>
      <p><strong>Price:</strong> ${product.price} UAH</p>
      <p><strong>Customer:</strong> ${name.value.trim()}</p>
      <p><strong>City:</strong> ${city.value}</p>
      <p><strong>Delivery Warehouse:</strong> ${warehouse.value}</p>
      <p><strong>Payment Method:</strong> ${payment.value}</p>
      <p><strong>Quantity:</strong> ${quantityValue}</p>
      <p><strong>Comment:</strong> ${comment.value.trim()}</p>
    `;
  
    const productInfo = getElement('#product-info');
    const orderForm = getElement('#order-form');
  
    productInfo.style.display = 'block';
    orderForm.style.display = 'none';
  
    productInfo.textContent = '';
    productInfo.appendChild(orderInfo);
  
    const orderData = {
      productName: product.name,
      productPrice: product.price,
      customerName: name.value.trim(),
      city: city.value,
      warehouse: warehouse.value,
      paymentMethod: payment.value,
      quantity: quantityValue,
      comment: comment.value.trim(),
      orderDate: new Date().toLocaleDateString(),
    };
  
    const userOrders = JSON.parse(localStorage.getItem('userOrders')) || [];
    userOrders.push(orderData);
    localStorage.setItem('userOrders', JSON.stringify(userOrders));
  };
  
  const displayErrorMessage = (message) => {
    const errorContainer = getElement('#error-container');
    errorContainer.innerHTML = '';
  
    const errorElement = document.createElement('p');
    errorElement.textContent = message;
    errorElement.style.color = 'red';
    errorContainer.appendChild(errorElement);
  };
  
  const displayUserOrders = () => {
    const categories = getElement('#categories');
    categories.style.display = 'none';
  
    const userOrders = JSON.parse(localStorage.getItem('userOrders'));
    const productInfo = getElement('#product-info');
    productInfo.textContent = '';
  
    if (userOrders && userOrders.length > 0) {
      userOrders.forEach((order, index) => {
        const orderSummary = document.createElement('div');
        orderSummary.innerHTML = `
          <p>Order ${index + 1} - ${order.orderDate} - Total Price: ${order.productPrice * order.quantity} UAH</p>
          <button onclick="displayOrderDetails(${index})">View Details</button>
          <button onclick="deleteOrder(${index})">Delete</button>
        `;
        productInfo.appendChild(orderSummary);
      });
    } else {
      productInfo.textContent = 'No orders placed yet.';
    }
  };
  
  const displayOrderDetails = (index) => {
    const userOrders = JSON.parse(localStorage.getItem('userOrders'));
    const order = userOrders[index];
  
    const orderDetails = document.createElement('div');
    orderDetails.innerHTML = `
      <h3>Order Details</h3>
      <p><strong>Product:</strong> ${order.productName}</p>
      <p><strong>Price:</strong> ${order.productPrice} UAH</p>
      <p><strong>Customer:</strong> ${order.customerName}</p>
      <p><strong>City:</strong> ${order.city}</p>
      <p><strong>Delivery Warehouse:</strong> ${order.warehouse}</p>
      <p><strong>Payment Method:</strong> ${order.paymentMethod}</p>
      <p><strong>Quantity:</strong> ${order.quantity}</p>
      <p><strong>Comment:</strong> ${order.comment}</p>
    `;
  
    const productInfo = getElement('#product-info');
    productInfo.textContent = '';
    productInfo.appendChild(orderDetails);
  };
  
  const deleteOrder = (index) => {
    const userOrders = JSON.parse(localStorage.getItem('userOrders'));
  
    if (index >= 0 && index < userOrders.length) {
      userOrders.splice(index, 1);
      localStorage.setItem('userOrders', JSON.stringify(userOrders));
      displayUserOrders();
    }
  };
  
  const myOrdersButton = getElement('#my-orders-button');
  myOrdersButton.addEventListener('click', displayUserOrders);
  
  const categoriesList = getElements('.category');
  categoriesList.forEach((category) => {
    category.addEventListener('click', () => displayProducts(category.textContent));
});
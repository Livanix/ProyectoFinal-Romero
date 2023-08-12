// Arreglo para almacenar los productos en el carrito
const cart = [];

// Funcion para actualizar la informacion del carrito en la pagina
function updateCart() {
  // Obtener los elementos del DOM para mostrar la informacion del carrito
  const cartItemsContainer = document.querySelector('#cart-items');
  const cartTotalElement = document.querySelector('#cart-total');
  const cartCountElement = document.querySelector('#cart-count');

  // Limpiar el contenedor de elementos del carrito
  cartItemsContainer.innerHTML = '';

  // Variable para almacenar el total del carrito
  let total = 0;

  // Recorrer los productos en el carrito y crear elementos HTML para mostrarlos
  cart.forEach((item, index) => {
    const itemElement = document.createElement('li');
    itemElement.classList.add('flex', 'items-center', 'space-x-4', 'mb-4');
    itemElement.innerHTML = `
      <img src="${item.imageUrl}" alt="${item.name}" class="rounded-lg shadow-lg h-16 object-cover" />
      <div class="flex-grow">
        <h4 class="text-lg font-bold">${item.name}</h4>
        <span>$${item.price}</span>
      </div>
      <button data-index="${index}" class="bg-red-500 text-white rounded-full px-2 py-1 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-600">Remove</button>
    `;

    // Agregar un controlador de eventos para el botón "Eliminar" de cada producto
    itemElement.querySelector('button').addEventListener('click', event => {
      // Obtener el índice del producto a eliminar
      const index = parseInt(event.target.dataset.index);

      // Mostrar una notificación con Toastify JS
      Toastify({
        text: 'Producto eliminado del carrito',
        duration: 3000,
        close: true,
        gravity: 'top',
        position: 'right',
        style: {
         backgroundColor: 'red'   
        }
      }).showToast();

      // Eliminar el producto del carrito
      cart.splice(index, 1);

      // Actualizar la información del carrito en la pagina
      updateCart();
    });

    // Agregar el elemento HTML del producto al contenedor de elementos del carrito
    cartItemsContainer.appendChild(itemElement);

    // Actualizar el contador de elementos en el carrito
    cartCountElement.textContent = cart.length;

    // Acumular el precio del producto en el total del carrito
    total += parseFloat(item.price);
  });

  // Mostrar el total del carrito en la paina
  cartTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Obtener los productos destacados desde un archivo de texto
fetch('featured-products.txt')
  .then(response => response.text())
  .then(text => {
    // Crear un arreglo de objetos con la informacion de cada producto
    const products = text.split('\n').map(line => {
      const [name, price, imageUrl] = line.split(', ');
      return { name, price, imageUrl };
    });

    // Obtener el contenedor de productos destacados en la pagina
    const featuredProductsContainer = document.querySelector('#featured-products');

    // Recorrer los primeros 4 productos destacados y crear elementos HTML para mostrarlos
    products.slice(0, 4).forEach(product => {
      const productElement = document.createElement('li');
      productElement.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'p-4', 'flex', 'flex-col', 'items-center');
      productElement.innerHTML = `
        <img src="${product.imageUrl}" alt="${product.name}" class="mb-4 rounded-lg shadow-lg h-32 object-cover" />
        <h3 class="text-lg font-bold mb-2">${product.name}</h3>
        <span>$${product.price}</span>
        <button class="bg-blue-500 text-white rounded-full px-4 py-2 mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600">Buy</button>
      `;

      // Agregar un controlador de eventos para el botón "Comprar" de cada producto
      productElement.querySelector('button').addEventListener('click', () => {
        // Añadir el producto al carrito
        cart.push(product);

        // Actualizar la informacion del carrito en la pagina
        updateCart();

        // Mostrar una notificacion con Toastify JS
        Toastify({
          text: 'Producto añadido al carrito',
          duration: 3000,
          close: true,
          gravity: 'top',
          position: 'right',
          style:{
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
        }
        }).showToast();
      });

      // Agregar el elemento HTML del producto al contenedor de productos destacados
      featuredProductsContainer.appendChild(productElement);
    });
  });
// Selecciona el botón del carrito y los elementos desplegables del carrito
const cartButton = document.querySelector('#cart-button');
const cartDropdown = document.querySelector('#cart-dropdown');

// Agrega un detector de eventos al boton del carrito para alternar la visibilidad del menu desplegable del carrito
cartButton.addEventListener('click', () => {
  cartDropdown.classList.toggle('hidden');
});

// Define una funcion para buscar productos por nombre
function searchProductsScan(query) {
  return products.filter(product => product.name.toLowerCase().includes(query.toLowerCase()));
}

// Selecciona el campo de busqueda, el contenedor de resultados de busqueda, el contenedor de todos los productos, el elemento de filtro de precio y el elemento de valor de filtro de precio
const searchInput = document.querySelector('#search-input');
const searchResultsContainer = document.querySelector('#search-results');
const allProductsContainer = document.querySelector('#all-products');
const priceFilterElement = document.querySelector('#price-filter');
const priceFilterValueElement = document.querySelector('#price-filter-value');

// Define una función para actualizar el valor del filtro de precio mostrado
function updatePriceFilterValue() {
  priceFilterValueElement.textContent = `$${priceFilterElement.value}`;
}

// Define una funcion para actualizar la lista de productos mostrada en funcion del valor actual del filtro de precio
function updateProductList(products) {
  // Borra la lista actual de productos
  allProductsContainer.innerHTML = '';
  // Obtiene el precio maximo del elemento de filtro de precio
  const maxPrice = parseFloat(priceFilterElement.value);
  // Filtra los productos por precio y crea un elemento para cada producto
  products.filter(product => parseFloat(product.price) <= maxPrice).forEach(product => {
    const productElement = document.createElement('li');
    productElement.classList.add('bg-white', 'rounded-lg', 'shadow-lg', 'p-4', 'flex', 'flex-col', 'items-center');
    productElement.innerHTML = `
      <img src="${product.imageUrl}" alt="${product.name}" class="mb-4 rounded-lg shadow-lg h-32 object-cover" />
      <h3 class="text-lg font-bold mb-2">${product.name}</h3>
      <span>$${product.price}</span>
    <button class="bg-blue-500 text-white rounded-full px-4 py-2 mt-4 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-600">Comprar</button>`;
    // Agrega un detector de eventos al boton Comprar para mostrar una notificación emergente y actualizar el carrito
    const buyButton = productElement.querySelector('button');
    buyButton.addEventListener('click', () => {
     Toastify({
            text: 'Producto añadido al carrito',
            duration: 3000,
            close: true,
            gravity: 'top',
            position: 'right',
            style:{
            background: 'linear-gradient(to right, #00b09b, #96c93d)',
            }
    }).showToast();
    cart.push(product);
    updateCart();

});

    
    // Agrega el elemento del producto al contenedor de todos los productos
    allProductsContainer.appendChild(productElement);
  });
}

// Obtiene la lista de productos destacados desde un archivo de texto
fetch('featured-products.txt')
  .then(response => response.text())
  .then(text => {
    // Analiza el archivo de texto en una matriz de objetos de producto
    const products = text.split('\n').map(line => {
      const [name, price, imageUrl] = line.split(', ');
      return { name, price, imageUrl };
    });
    // Actualiza la lista mostrada de productos y el valor del filtro de precio
    updateProductList(products);
    updatePriceFilterValue();
    // Agrega un detector de eventos al elemento de filtro de precio para actualizar la lista mostrada de productos cuando cambia el valor
    priceFilterElement.addEventListener('input', () => {
      updatePriceFilterValue();
      updateProductList(products);
    });
  });

// Función para obtener los productos del archivo de texto
const getProducts = async () => {
    const response = await fetch('featured-products.txt');
    const text = await response.text();
    const lines = text.split('\n');
    const products = lines.map(line => {
      const fields = line.split(',');
      if (fields.length >= 4) {
        return {
          name: fields[0].trim(),
          price: parseFloat(fields[1].trim()),
          image: fields[2].trim(),
          description: fields[3].trim()
        };
      }
    }).filter(product => product);
    return products;
  };
  
  
  // Funcion para buscar productos
  const searchProducts = async (searchValue, products) => {
    // Obtener los productos del archivo de texto
    products = await getProducts();
  
    // Convertir el valor de busqueda a minusculas para hacer la busqueda insensible a mayusculas y minusculas
    searchValue = searchValue.toLowerCase();
  
    // Filtrar los productos que coincidan con el valor de busqueda
    const results = products.filter(product => product.name.toLowerCase().includes(searchValue));
  
    // Mostrar los resultados en el menu desplegable
    const resultsContainer = document.querySelector('#search-suggestions');
    resultsContainer.innerHTML = '';
    results.forEach(result => {
      const resultElement = document.createElement('li');
      resultElement.innerHTML = `
        <img src="${result.image}" alt="${result.name}" class="w-16 h-16 rounded-full mr-4" />
        <div>
          <h3 class="text-lg font-bold">${result.name}</h3>
          <p class="text-gray-500">$${result.price.toFixed(2)}</p>
        </div>
      `;
      resultElement.classList.add('flex', 'items-center');
      resultsContainer.appendChild(resultElement);
    });
  
    // Mostrar u ocultar el menu desplegable dependiendo de si hay resultados o no
    if (results.length > 0) {
      resultsContainer.classList.remove('hidden');
    } else {
      resultsContainer.classList.add('hidden');
    }
  }
  
  // Llamar a la función de busqueda cuando el usuario escriba en el campo de busqueda
  document.querySelector('input[type="text"]').addEventListener('input', event => {
    searchProducts(event.target.value);
  });
  // Funcion para cerrar el menu desplegable de busqueda
const closeSearchMenu = () => {
    const resultsContainer = document.querySelector('#search-suggestions');
    resultsContainer.classList.add('hidden');
  }
  
  // Agregar un controlador de eventos para el evento blur en el campo de busqueda
  document.querySelector('input[type="text"]').addEventListener('blur', closeSearchMenu);
  
  document.querySelector('#contact-link').addEventListener('click', event => {
    // Prevenir que el enlace abra una nueva pagina
    event.preventDefault();
  
    Toastify({
        text: 'Mi correo electrónico es: iivaaanromero@gmail.com',
        duration: -1,
        close: true,
        gravity: 'top',
        position: 'center',
        className: 'large-notification',
        stopOnFocus: true,
        style: {
        background: 'linear-gradient(to right, #00b09b, #96c93d)',
        }
      }).showToast();
  });
  
  

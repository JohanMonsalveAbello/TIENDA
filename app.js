// Variable que mantiene el estado visible del carrito
var carritoVisible = false;

// Función que agrega un item al carrito y hace visible el carrito al mismo tiempo
function agregarItemYMostrarCarrito(titulo, precio, imagenSrc) {
    // Lógica para agregar el item al carrito...

    // Luego de agregar el item, haces visible el carrito
    hacerVisibleCarrito();
}

// Esperamos a que todos los elementos de la página carguen para ejecutar el script
if (document.readyState == 'loading') {
    document.addEventListener('DOMContentLoaded', ready)
} else {
    ready();
}

function ready() {
    // Agregamos funcionalidad a los botones eliminar del carrito
    var botonesEliminarItem = document.getElementsByClassName('btn-eliminar');
    for (var i = 0; i < botonesEliminarItem.length; i++) {
        var button = botonesEliminarItem[i];
        button.addEventListener('click', eliminarItemCarrito);
    }

    // Agregamos funcionalidad al boton sumar cantidad
    var botonesSumarCantidad = document.getElementsByClassName('sumar-cantidad');
    for (var i = 0; i < botonesSumarCantidad.length; i++) {
        var button = botonesSumarCantidad[i];
        button.addEventListener('click', sumarCantidad);
    }

    // Agregamos funcionalidad al botón restar cantidad
    var botonesRestarCantidad = document.getElementsByClassName('restar-cantidad');
    for (var i = 0; i < botonesRestarCantidad.length; i++) {
        var button = botonesRestarCantidad[i];
        button.addEventListener('click', restarCantidad);
    }

    // Agregamos funcionalidad al boton Agregar al carrito
    var botonesAgregarAlCarrito = document.getElementsByClassName('boton-item');
    for (var i = 0; i < botonesAgregarAlCarrito.length; i++) {
        var button = botonesAgregarAlCarrito[i];
        button.addEventListener('click', agregarAlCarritoClicked);
    }

    // Configuramos evento para el botón de pagar
    document.getElementsByClassName('btn-pagar')[0].addEventListener('click', pagarClicked);

    // Integración del botón de PayPal
    paypal.Buttons({
        style: {
            layout: 'vertical',
            color: 'blue',
            shape: 'rect',
            label: 'paypal'
        }
    }).render('.btn-pagar');

    // Llama a la función al cargar la página para obtener los productos de la base de datos
    obtenerProductosDeBaseDeDatos();
}

// Eliminamos todos los elementos del carrito y lo ocultamos
function pagarClicked() {
    alert("Gracias por la compra");
    // Elimino todos los elementos del carrito
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    while (carritoItems.hasChildNodes()) {
        carritoItems.removeChild(carritoItems.firstChild)
    }
    actualizarTotalCarrito();
    ocultarCarrito();
}

// Función que controla el botón clickeado de agregar al carrito
function agregarAlCarritoClicked(event) {
    var button = event.target;
    var item = button.parentElement;
    var titulo = item.getElementsByClassName('titulo-item')[0].innerText;
    var precio = item.getElementsByClassName('precio-item')[0].innerText;
    var imagenSrc = item.getElementsByClassName('img-item')[0].src;

    agregarAlCarrito(titulo, precio, imagenSrc);
    hacerVisibleCarrito();
}

// Función que hace visible el carrito
function hacerVisibleCarrito() {
    carritoVisible = true;
    var carrito = document.getElementsByClassName('carrito')[0];
    carrito.style.marginRight = '0';
    carrito.style.opacity = '1';

    var items = document.getElementsByClassName('contenedor-items')[0];
    items.style.width = '60%';
}

// Función que oculta el carrito si está vacío
function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

// Función para agregar un producto al carrito
function agregarAlCarrito(nombre, precio, imagenSrc) {
    // Creamos un nuevo elemento para el producto en el carrito
    var item = document.createElement('div');
    item.classList.add('carrito-item');

    // Contenido del item del carrito
    item.innerHTML = `
        <img src="${imagenSrc}" width="80px" alt="">
        <div class="carrito-item-detalles">
            <span class="carrito-item-titulo">${nombre}</span>
            <div class="selector-cantidad">
                <i class="fa-solid fa-minus restar-cantidad"></i>
                <input type="text" value="1" class="carrito-item-cantidad" disabled>
                <i class="fa-solid fa-plus sumar-cantidad"></i>
            </div>
            <span class="carrito-item-precio">${precio}</span>
        </div>
        <button class="btn-eliminar">
            <i class="fa-solid fa-trash"></i>
        </button>
    `;

    // Agregamos el nuevo item al carrito
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    carritoItems.appendChild(item);

    // Agregamos la funcionalidad eliminar al nuevo item
    item.getElementsByClassName('btn-eliminar')[0].addEventListener('click', eliminarItemCarrito);

    // Agregamos la funcionalidad restar cantidad del nuevo item
    var botonRestarCantidad = item.getElementsByClassName('restar-cantidad')[0];
    botonRestarCantidad.addEventListener('click', restarCantidad);

    // Agregamos la funcionalidad sumar cantidad del nuevo item
    var botonSumarCantidad = item.getElementsByClassName('sumar-cantidad')[0];
    botonSumarCantidad.addEventListener('click', sumarCantidad);

    // Actualizamos total
    actualizarTotalCarrito();
}

// Aumento en uno la cantidad del elemento seleccionado
function sumarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual++;
    selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
    actualizarTotalCarrito();
}

// Resto en uno la cantidad del elemento seleccionado
function restarCantidad(event) {
    var buttonClicked = event.target;
    var selector = buttonClicked.parentElement;
    var cantidadActual = selector.getElementsByClassName('carrito-item-cantidad')[0].value;
    cantidadActual--;
    if (cantidadActual >= 1) {
        selector.getElementsByClassName('carrito-item-cantidad')[0].value = cantidadActual;
        actualizarTotalCarrito();
    }
}

// Elimino el item seleccionado del carrito
function eliminarItemCarrito(event) {
    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    // Actualizamos el total del carrito
    actualizarTotalCarrito();

    // La siguiente función controla si hay elementos en el carrito
    // Si no hay, elimino el carrito
    ocultarCarrito();
}

// Función que controla si hay elementos en el carrito. Si no hay, oculto el carrito.
function ocultarCarrito() {
    var carritoItems = document.getElementsByClassName('carrito-items')[0];
    if (carritoItems.childElementCount == 0) {
        var carrito = document.getElementsByClassName('carrito')[0];
        carrito.style.marginRight = '-100%';
        carrito.style.opacity = '0';
        carritoVisible = false;

        var items = document.getElementsByClassName('contenedor-items')[0];
        items.style.width = '100%';
    }
}

// Actualizamos el total de Carrito
function actualizarTotalCarrito() {
    // Seleccionamos el contenedor carrito
    var carritoContenedor = document.getElementsByClassName('carrito')[0];
    var carritoItems = carritoContenedor.getElementsByClassName('carrito-item');
    var total = 0;
    // Recorremos cada elemento del carrito para actualizar el total
    for (var i = 0; i < carritoItems.length; i++) {
        var item = carritoItems[i];
        var precioElemento = item.getElementsByClassName('carrito-item-precio')[0];
        // Quitamos el símbolo peso y el punto de milesimos.
        var precio = parseFloat(precioElemento.innerText.replace('$', '').replace('.', ''));
        var cantidadItem = item.getElementsByClassName('carrito-item-cantidad')[0];
        var cantidad = cantidadItem.value;
        total = total + (precio * cantidad);
    }
    total = Math.round(total * 100) / 100;

    document.getElementsByClassName('carrito-precio-total')[0].innerText = '$' + total.toLocaleString("es") + ",00";

}

// Función para obtener los productos de la base de datos
function obtenerProductosDeBaseDeDatos() {
    fetch('http://localhost:3000/productos')
        .then(response => response.json())
        .then(productos => {
            // Aquí puedes manejar los productos obtenidos de la base de datos
            // Por ejemplo, puedes recorrer la lista de productos y crear elementos HTML para mostrarlos en la página
            const contenedorItems = document.querySelector('.contenedor-items');
            productos.forEach(producto => {
                const nuevoItem = document.createElement('div');
                nuevoItem.classList.add('items');
                nuevoItem.innerHTML = `
                    <span class="titulo-item">${producto.nombre}</span>
                    <img src="${producto.imagen}" alt="" class="img-item">
                    <span class="precio-item">$${producto.precio}</span>
                    <button class="boton-item">Agregar al carrito</button>
                `;
                contenedorItems.appendChild(nuevoItem);

                // Agrega un event listener al botón "Agregar al carrito" del nuevo producto
                const botonAgregar = nuevoItem.querySelector('.boton-item');
                botonAgregar.addEventListener('click', () => {
                    // Aquí puedes manejar la lógica para agregar el producto al carrito
                    // Por ejemplo, puedes obtener la información del producto y agregarlo al carrito
                    const nombreProducto = producto.nombre;
                    const precioProducto = producto.precio;
                    const imagenProducto = producto.imagen;
                    agregarAlCarrito(nombreProducto, precioProducto, imagenProducto);
                    hacerVisibleCarrito(); // Asegurar que el carrito sea visible después de agregar el producto
                });
            });
        })
        .catch(error => console.error('Error al obtener productos:', error));
}

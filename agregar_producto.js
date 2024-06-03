const form = document.getElementById('nuevoProductoForm');

form.addEventListener('submit', async function(event) {
    event.preventDefault();

    const nombre = document.getElementById('nombre').value;
    const precio = parseFloat(document.getElementById('precio').value);
    const fileInput = document.getElementById('imagen');
    const file = fileInput.files[0];

    console.log('Datos del formulario:', { nombre, precio, file });

    const reader = new FileReader();

    reader.onload = async function() {
        const imagenBase64 = reader.result;
        console.log('Imagen en base64:', imagenBase64);

        try {
            const response = await fetch('http://localhost:3000/productos', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ nombre, precio, imagen: imagenBase64 }),
            });

            if (response.ok) {
                console.log('Producto agregado con éxito');
                window.location.href = 'TIENDA.HTML';
            } else {
                console.error('Error al agregar el producto:', response.statusText);
            }
        } catch (error) {
            console.error('Error al enviar la solicitud:', error);
        }
    };

    reader.readAsDataURL(file);
});

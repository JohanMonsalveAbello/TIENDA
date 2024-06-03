const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

// Crear una instancia de Express
const app = express();

// Configura CORS para permitir solicitudes desde otros orígenes
app.use(cors());

// Configura Express para aceptar solicitudes JSON con un límite de tamaño personalizado
app.use(express.json({ limit: '50mb' })); // Ajusta el límite según tus necesidades

// Configuración de la conexión con MySQL
const connection = mysql.createConnection({
    host: 'ghanjadrops.mysql.database.azure.com',
    user: 'johan',
    password: 'MONSALVE#2006', // Ajusta según tu configuración
    database: 'ghanjadrops'
});

// Verificar la conexión a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error de conexión a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// Ruta para obtener todos los productos
app.get('/productos', (req, res) => {
    connection.query('SELECT * FROM productos', (err, results) => {
        if (err) {
            console.error('Error al obtener productos:', err);
            res.status(500).send('Error del servidor');
        } else {
            res.json(results);
        }
    });
});

// Ruta para agregar un nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, precio, imagen } = req.body;

    const query = 'INSERT INTO productos (nombre, precio, imagen) VALUES (?, ?, ?)';
    connection.query(query, [nombre, precio, imagen], (err, results) => {
        if (err) {
            console.error('Error al agregar producto:', err);
            res.status(500).send('Error del servidor');
        } else {
            res.status(201).send('Producto agregado con éxito');
        }
    });
});

// Iniciar el servidor en el puerto 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`API REST funcionando en http://localhost:${PORT}`);
});

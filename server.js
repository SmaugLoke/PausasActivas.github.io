const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { GoogleSpreadsheet } = require('google-spreadsheet');
require('dotenv').config();  // Cargar las variables de entorno

const app = express();
const port = process.env.PORT || 3000;

// Configuración del middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Configura la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pausas_activas'
});

db.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Función para agregar datos a Google Sheets
async function addToGoogleSheet(data) {
    const doc = new GoogleSpreadsheet('1M0ZeA2ClJx7vye6tuOa0qV-3S-2ozA2gVyYR2QagjB8'); // ID de Google Sheet configurado

    // Cargar las credenciales desde variables de entorno
    await doc.useServiceAccountAuth({
        client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    });

    await doc.loadInfo();

    const sheet = doc.sheetsByIndex[0]; // Accede a la primera hoja

    await sheet.addRow(data);
}

// Ruta principal para servir la página HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'html', 'presentacion.html'));
});

// Manejo de envío del formulario de registro
app.post('/submit-form', async (req, res) => {
    const { fullName, documentType, document, position, dataAuthorization, pauseActive } = req.body;

    const query = 'INSERT INTO usuarios (nombre_completo, tipo_documento, documento, cargo, autorizacion_datos, realizo_pausas) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [fullName, documentType, document, position, dataAuthorization ? 1 : 0, pauseActive ? 1 : 0], async (err, result) => {
        if (err) {
            console.error('Error al guardar los datos en MySQL:', err);
            return res.status(500).json({ success: false, message: 'Error al guardar los datos en MySQL' });
        }

        console.log(`Formulario enviado por: ${fullName}`);

        // Guardar en Google Sheets
        try {
            await addToGoogleSheet({
                "Nombre Completo": fullName,
                "Tipo de Documento": documentType,
                "Documento": document,
                "Cargo": position,
                "Autorización de Datos": dataAuthorization ? "Sí" : "No",
                "Realizó Pausas Activas": pauseActive ? "Sí" : "No",
            });

            console.log('Datos guardados en Google Sheets');
            res.status(200).json({ success: true, message: 'Registro completado con éxito' });
        } catch (error) {
            console.error('Error al guardar los datos en Google Sheets:', error);
            res.status(500).json({ success: false, message: 'Error al guardar los datos en Google Sheets' });
        }
    });
});

// Inicio del servidor
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

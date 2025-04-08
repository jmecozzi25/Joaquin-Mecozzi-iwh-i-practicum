const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

require('dotenv').config();
const PRIVATE_APP_ACCESS = process.env.ACCESS_TOKEN;
app.get('/', async (req, res) => {
    const url = 'https://api.hubapi.com/crm/v3/objects/p49645532_estudiantes?properties=nombre,carrera,numero_de_telefono';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    try {
        const response = await axios.get(url, { headers });
        const estudiantes = response.data.results;
        res.render('index', { title: 'Estudiantes', estudiantes });
    } catch (error) {
        console.error('Error obteniendo estudiantes:', error.response?.data || error.message);
        res.status(500).send('Error obteniendo estudiantes');
    }
});

app.get('/form', (req, res) => {
    res.render('form', { title: 'Crear Estudiante' });
});

app.get('/update-cobj', (req, res) => {
    res.render('actualizaciones', {
        title: 'Actualizar formulario de objeto personalizado | Integración con HubSpot I Practicum'
    });
});

app.post('/update-cobj', async (req, res) => {
    const {nombre, carrera, numero_de_telefono} = req.body;
    const url = 'https://api.hubapi.com/crm/v3/objects/p49645532_estudiantes?properties=nombre,carrera,numero_de_telefono';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const newEstudiante = {
        properties: {
            nombre,
            carrera,
            numero_de_telefono
        }
    };

    try {
        await axios.post(url, newEstudiante, { headers });
        res.redirect('/');
    } catch (error) {
        console.error('Error creando estudiante:', error.response?.data || error.message);
        res.status(500).send('Error creando estudiante');
    }
});

app.listen(3000, () => console.log('🚀 Listening on http://localhost:3000'));

const express = require('express');
const axios = require('axios');
const path = require('path');
const cors = require('cors');

// chama arquivo que está protegendo a key da api
const config = require('./config.json')

// define a key da api
const API_KEY = config.API_KEY;

const app = express();
const PORT = 3000;
app.listen(PORT, () => {
    console.log("Site no ar!", `http://localhost:${PORT}/climatempo/Marilia`);
});

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const traducaoClima = {
    // incluir as traduções
    "few clouds": "Poucas Nuvens"
}

app.get('/climatempo/:cidade', async (req, res) => {
    const city = req.params.cidade;

    try {
        const response = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (response.status === 200) {
            const clima = traducaoClima[response.data.weather[0].description] || response.data.weather[0].description;

            const weatherData = {
                Temperatura: response.data.main.temp,
                Umidade: response.data.main.humidity,
                VelocidadeDoVento: response.data.wind.speed,
                Clima: clima
            };

            res.json(weatherData); // Envia os dados do clima de volta como resposta
        } else {
            res.status(response.status).send(response.statusText); // Envia o status de erro como resposta
        }
    } 
    catch (error) {
        console.error("Erro ao obter dados do clima:", error);
        res.status(500).send("Erro ao obter dados do clima"); // Envia um erro 500 em caso de falha na solicitação
    }
});

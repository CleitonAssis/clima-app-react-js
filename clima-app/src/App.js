import React, { useState } from "react";
import axios from "axios";

function ClimaApp() {

  const api = {
    key: "3ee32176fbc4070662893138e0e9dea6",
    base: "https://api.openweathermap.org/data/2.5/"
  }

  const [cidade, setCidade] = useState("");
  const [nomeCidade, setNomeCidade] = useState("");
  const [temperatura, setTemperatura] = useState(0);// Define a temperatura para 0
  const [sensacao, setSensacao] = useState(0);
  const [descricao, setDescricao] = useState("");
  const [icon, setIcon] = useState("");
  const [backgroundImg, setBackgroundImg] = useState({});
  const [error, setError] = useState(null);

  if (temperatura === "0") {
    setBackgroundImg({ backgroundImage: `url(${require("./img/paisagem.jpg")})` });
  }
  
  async function getWeather() {
    try {
      const api_url = `${api.base}weather?q=${cidade}&lang=pt_br&units=metric&appid=${api.key}`;
      const response = await axios.get(api_url);
      const weather = response.data;
      console.log(response);
      
      setNomeCidade(weather.name);
      setTemperatura(Math.round(weather.main.temp)); // Arredonda a temperatura
      setSensacao(Math.round(weather.main.feels_like)); // Arredonda a temperatura
      setDescricao(weather.weather[0].description);
      setError(null);
      
      // Seta weather ícone
      const iconCode = weather.weather[0].icon;
      setIcon(`https://openweathermap.org/img/wn/${iconCode}.png`);

      // Background baseado na temperatura
      if (weather.main.temp > 15) {
        setBackgroundImg({ backgroundImage: `url(${require("./img/quente.jpg")})` });
      } else {
        setBackgroundImg({ backgroundImage: `url(${require("./img/frio.jpg")})` });
      }
    } catch (error) { 
      const AxiosError =  error.response.data;
      console.error( AxiosError);
      setError(AxiosError);
      setTemperatura(0);
      setBackgroundImg({});
      //console.log(AxiosError);
    }
  };

  function buscar() {
    if (cidade) {
      setCidade("");
      getWeather();
    }
  };

  const dataAtual = new Date(); // Traz a data
  console.log(dataAtual);
  const anoAtual = dataAtual.getFullYear();

  return (
    <main className="conatainer bg-white h-100 clima-app" style={backgroundImg}>
      <nav className="navbar-expanded-md navbar-dark bg-dark mb-4">
        <a className="navbar-brand text-white" href="#root">
          <h1>Clima App</h1>
        </a>
      </nav>

      {error === null && (
        <div className="form-group">
          <div class="col-md-4 mx-auto">
            <input type="search" className="form-control" placeholder="Digite o nome da cidade" value={cidade} onChange={(e) => setCidade(e.target.value)} maxLength="50" autoFocus/>
          </div>
          <br />
          <button className="btn btn-outline-info" onClick={buscar}>Buscar Clima</button>
        </div>
      )}

      {error !== null && (
        <div className="container">
          <div className="alert alert-danger Error" role="alert">
            <h1>Erro ao buscar dados meteorológicos: "Cod:{error.cod} {error.message}"</h1>
          </div>
          <a class="btn btn-danger" href="index.html" role="button">Tentar novamente</a>
        </div>
      )}

      {temperatura !== 0 && (
        <div className="container w-25 text-white rounded info">
          <div className="cidade"><h1>{nomeCidade}</h1></div>
          <div className="temperatura"><h1>{temperatura}°C</h1></div>
          <div className="sensacao">Sensação Térmica {sensacao}°C</div>
          <div className="descricao">{descricao}</div>   
          <div className="icone"><img src={icon} alt="Condição meteorológica" /></div>
        </div>
      )}
      <footer className="bg-dark text-white">
        <p>Desenvolvido por Cleiton Assis&copy; {anoAtual}. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
};

export default ClimaApp;


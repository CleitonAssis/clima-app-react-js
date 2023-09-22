import React, { useState } from "react";
import axios from "axios";
import { FaMagnifyingGlass } from "react-icons/fa6"; // Ícone lupa importado do fonte awesome 6

function ClimaApp() {

  const api = {
    key: "3ee32176fbc4070662893138e0e9dea6",
    base: "https://api.openweathermap.org/data/2.5/"
  }

  const [cidade, setCidade] = useState("");
  const [nomeCidade, setNomeCidade] = useState("");
  const [temperatura, setTemperatura] = useState("");
  const [sensacao, setSensacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [icon, setIcon] = useState("");
  const [backgroundImg, setBackgroundImg] = useState({});
  const [error, setError] = useState(null);

  // Traz dados meteorológicos da API
  async function getWeather() {
    try {
      const api_url = `${api.base}weather?q=${cidade}&lang=pt_br&units=metric&appid=${api.key}`;
      const response = await axios.get(api_url);
      const weather = response.data;
      //console.log(weather);
      
      setNomeCidade(weather.name);
      setTemperatura(Math.round(weather.main.temp)); // Arredonda a temperatura para um número inteiro
      setSensacao(Math.round(weather.main.feels_like));
      setDescricao(weather.weather[0].description);
      setError(null);
      
      // Traz o ícone da API
      const iconCode = weather.weather[0].icon;
      setIcon(`https://openweathermap.org/img/wn/${iconCode}.png`);

      // Background baseado na temperatura
      if (weather.main.temp > 15) {
        setBackgroundImg({ backgroundImage: `url(${require("./img/quente.jpg")})` });
      } else {
        setBackgroundImg({ backgroundImage: `url(${require("./img/frio.jpg")})` });
      }

      setCidade("");// Limpa o input
    } catch (error) { 
      let ApiError = error.response.data.message;// Traz a msg de erro da API
      if (ApiError === "city not found") {
        ApiError = "Cidade não encontrada!";
      }
      console.error(ApiError);
      setError(ApiError);
      setTemperatura("");
      setBackgroundImg({});
      //console.log(ApiError);
    }
  };

  function buscar() {
    if (cidade) {
      getWeather();
    } else {// Passa msg de erro caso o input cidade não esteja definido ou vazio
      setError("Informe uma cidade!");
      setTemperatura("");
      setBackgroundImg({});
    }
  };

  const dataAtual = new Date(); // Traz a data
  const anoAtual = dataAtual.getFullYear();// Traz o ano

  return (
    <main className="conatainer bg-white h-100 clima-app" style={backgroundImg}>
      <nav className="navbar-expanded-md navbar-dark bg-dark mb-4">
        <a className="navbar-brand text-white" href="#root">
          <h1>Clima App</h1>
        </a>
      </nav>

      {error === null && (
        <div className="form-inline">
          <div className="input-group-append mx-auto">
            <input type="search" className="form-control" placeholder="Digite o nome da cidade" value={cidade} onChange={(event) => setCidade(event.target.value)} maxLength="50" autoFocus/>
            <button type="button" className="btn btn-outline-info" onClick={buscar}><FaMagnifyingGlass /></button>
          </div>
          <br />
        </div>
      )}

      {error !== null && (
        <div className="container">
          <div className="alert alert-danger Error" role="alert">
            <h1>Erro ao buscar dados meteorológicos: {error}</h1>
          </div>
          <a class="btn btn-danger" href="index.html" role="button">Tentar novamente</a>
        </div>
      )}

      {temperatura !== "" && (
        <div className="container w-25 mt-5 text-white rounded info">
          <div className="cidade">
            <h1>{nomeCidade}</h1>
          </div>
          <div>
            <h1>{temperatura}°C</h1>
          </div>
          <div>Sensação Térmica {sensacao}°C</div>
          <div className="descricao">{descricao}</div>   
          <div>
            <img src={icon} alt="Condição meteorológica" />
          </div>
        </div>
      )}
      <footer className="bg-dark text-white">
        <p>Desenvolvido por Cleiton Assis&copy; {anoAtual}. Todos os direitos reservados.</p>
      </footer>
    </main>
  );
};

export default ClimaApp;


import React, { useState, useEffect } from "react";
import "../styles/Texts.css"; // Archivo de estilos CSS
import Navbar from "../components/Navbar";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { GetAllArticles } from "../hooks/Article";
import { role } from "../querys/User.query";
import BackButton from "../components/BackButton";
//import OneArticle from "./OneArticle"; // Importa el componente OneArticle

const TYPE_LABELS = { 1: ["Artículo", "teal"], 2: ["Video", "indigo"], 3: ["Podcast", "pink"], 4: ["Ejercicio", "amber"] };

const Texts = () => {
  const navigate = useNavigate();
  const rol = role
  console.log(rol)
    /* Cookie */
/* import Cookies from "universal-cookie"; */
const cookie = new Cookies();
const cook = cookie.get('id')
useEffect(() => {
  if (!cook) {
    navigate('/time-out') // Hay que crear la ruta time out que es el cierre de sesioón
  }
}, [])
const {data:result, isSuccess, isLoading} = GetAllArticles(cook);
  const articles = isSuccess && result.data;
/* Cookie */
  const totalArticulos = articles.length;

  const handleNavigateToOneArticle = (index) => { // Pasa el índice del artículo como argumento
    navigate(`/oneArticle/${index + 1}`); // Añade el índice al URL
  };

  return (
    <div>
      <Navbar />
      <BackButton />
    <div className="texts-page">
      
      <h1>Artículos que te pueden interesar</h1>
      <div id="article-m" className="scrollable">
        <div id="aricle-mar">
          {
          isLoading ? <span><img className="Loading" src="https://mvalma.com/inicio/public/include/img/ImagenesTL/paginaTL/Cargando.gif" alt="Cargando" /></span>
          :
          isSuccess && articles.map((articulo, index) => {
            const [tLabel, tColor] = TYPE_LABELS[articulo.typeId] || ["Recurso", "teal"];
            return (
            <div key={index} className="cat-article">
              <div id="texts-uno">
                <button
                  id="btn-texts-uno"
                  onClick={() => handleNavigateToOneArticle(index)}
                >
                  {articulo.picture ? (
                    <img src={articulo.picture} alt="" className="art-img" loading="lazy" />
                  ) : null}
                  <span className={`art-pill ${tColor}`}>{tLabel}</span>
                  <h2 id="titulo-variosm">{articulo.articleName}</h2>
                  {articulo.resume ? <p className="art-resume">{articulo.resume}</p> : null}
                  <span className="art-date">{articulo.date || ""}</span>
                </button>
              </div>
            </div>
            );
          })}
        </div>
      </div>
      <p>Total de artículos: {totalArticulos}</p>
      {rol === 3 && (<button className="btn-add-art" onClick={() => navigate(`/Creation`)} >+ Añadir Artículo</button>)}
    </div>
    </div>
  );
};

export default Texts;

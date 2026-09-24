import React, { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom"; // °3°useNavigate para poder navegar entre pestañas
import Cookies from "universal-cookie"; // °° para validar si esta o no logeado
import Swal from "sweetalert2";
import Navbar from "../Navbar";
import "../../styles/Creation.css";
import { SetArticle } from "../../hooks/Article";
import BackButton from "../BackButton";

const Creation = () => {
  const navigate = useNavigate(); // °3°useNavigate para poder navegar entre pestañas
  const [title, setTitle] = useState("");
  const [resume, setResume] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);

  /* Vista previa local de la imagen antes de subir */
  const handleImage = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    } else {
      setImage(null);
      setPreview(null);
    }
  };

  useEffect(() => () => { if (preview) URL.revokeObjectURL(preview); }, [preview]);

  const fileRef = useRef(null);

  /* Quitar la imagen si te equivocas: limpia estado, preview e input */
  const clearImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setImage(null);
    setPreview(null);
    if (fileRef.current) fileRef.current.value = "";
  };
  const [link, setLink] = useState("");
  const [publicationDate, setPublicationDate] = useState("");

  const cookie = new Cookies(); // °° para validar si esta o no logeado

  const cook = cookie.get('id')
  useEffect(() => {
    if (!cook) {
      navigate('/time-out')
    }
  }, [])

  const mutacion = SetArticle()
  const handleSubmit = (e) => {
    e.preventDefault();

    // Verificar si algún campo está vacío
    if (!title || !image || !link || !publicationDate || !resume) {
      // Mostrar alerta si algún campo está vacío
      Swal.fire({
        title: 'Por favor completa todos los campos',
        icon: 'warning',
        confirmButtonColor: '#1B5091',
        backdrop: "linear-gradient(to right, #60C8B3, #1B5091)",
      });
      return; // Detener el envío del formulario si algún campo está vacío
    }
    const articleData = {
      title: title,
      resume: resume,
      image: image,
      link: link,
      publicationDate: publicationDate
    };
    console.log(articleData)
    mutacion.mutate(articleData)
   
    
  }

  return (
    <div >
      <Navbar />
      <BackButton />
      
      <form onSubmit={handleSubmit} className="form-create">
        <h1>Nuevo Recurso</h1>
        <div className="form-cam">
          <label htmlFor="title">Título:</label>
          <input className="form-cam-inp"
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="form-cam">
          <label htmlFor="resume">Resumen:</label>
          <input className="form-cam-inp"
            type="text"
            id="resume"
            value={resume}
            onChange={(e) => setResume(e.target.value)}
          />
        </div>
        <div className="form-cam">
          <label htmlFor="link">URL del recurso:</label>
          <input className="form-cam-inp"
            type="text"
            id="link"
            value={link}
            onChange={(e) => setLink(e.target.value)}
          />
        </div>
        <div className="form-cam">
          <label htmlFor="image">Imagen:</label>
          <input
            ref={fileRef}
            type="file"
            id="image"
            accept="image/png, image/jpeg" // Acepta archivos PNG y JPEG
            onChange={handleImage}
          />
        </div>
        {preview && (
          <div className="form-cam preview-wrap">
            <img src={preview} className="preview-img" alt="Vista previa de la imagen" />
            <button type="button" className="preview-remove" onClick={clearImage}>
              ✕ Quitar imagen
            </button>
          </div>
        )}
        <div className="form-cam">
          <label htmlFor="publicationDate">Fecha de publicación:</label>
          <input className="form-cam-inp"
            type="date"
            id="publicationDate"
            value={publicationDate}
            onChange={(e) => setPublicationDate(e.target.value)}
          />
        </div>
        <button id="form-btn" type="submit">Guardar</button>
        {
                mutacion.isPending && <span><img className="Loading" src="https://mvalma.com/inicio/public/include/img/ImagenesTL/paginaTL/Cargando.gif" alt="Cargando" /></span>
            }
            {
                mutacion.isSuccess && Swal.fire({
                  title: 'El recurso fue cargado con exito',
                  icon: 'success',
                  confirmButtonColor: '#1B5091',
                  backdrop: "linear-gradient(to right, #60C8B3, #1B5091)",
                })
                &&  navigate("/Texts")
            }
            {
                mutacion.isError && <span>Parece que algo fallo, intenta de nuevo</span>
            }
      </form>
    </div>
  );
};

export default Creation;

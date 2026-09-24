import { useEffect } from "react";
import { GiToken } from "react-icons/gi";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import api from "../querys/api";
import { URL } from "../querys/Auth.query";
import "../styles/NotFound.css";

function LogOut() {

    const navigate = useNavigate()

    const cookie = new Cookies();

    useEffect(() => {
        const cerrar = async () => {
            try {
                await api.post(`${URL}/User/LogOut`)
            } catch (e) {
                // Sesión ya inválida o sin red; continuamos igual
            }
            cookie.remove('id', { path: '/' });
            navigate('/')
        }
        const timer = setTimeout(cerrar, 1000)
        return () => clearTimeout(timer)
    }, [navigate, cookie])


    return (
        <div id="logOut">
            <h1 id="logOut-h1" >Saliendo</h1>
            <img id="gif-logOut" src="https://i.gifer.com/XOsX.gif" alt="" />
            <h1 id="logOut-h1">Regrese pronto =D</h1>
        </div>
    )
}

export default LogOut
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Reset } from "../hooks/RestPassword";
import "../styles/ResetPass.css";

const ForgotPassword = () => {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const mutacion = Reset();

    let location = useLocation();
    const result = location.search.split('=');
    const token = result[1] ? result[1].split('/')[0] : "";
    const id = result[2] || "";

    const onSubmit = handleSubmit((data) => {
        mutacion.mutate({ data, token, id });
    });

    return (
        <div className="reset-page">
            <form onSubmit={onSubmit}>
                <h1>Recuperar Contraseña</h1>
                <span>Ingresa tu nueva contraseña</span>

                {/* Ingreso de los datos */}
                <input 
                    type="password" 
                    placeholder="Contraseña nueva"
                    {...register('pass', {
                        required: {
                            value: true,
                            message: "La contraseña es requerida"
                        },
                        minLength: { 
                            value: 8,
                            message: "Mínimo 8 caracteres"
                        }
                    })} 
                />
                {errors.pass && <span className="alert">{errors.pass.message}</span>}

                <input 
                    type="password" 
                    placeholder="Verificar contraseña"
                    {...register('newPass', {
                        required: {
                            value: true,
                            message: "La verificación es requerida"
                        },
                        validate: (value) => {
                            if (value !== watch("pass")) {
                                return "Las contraseñas no coinciden";
                            }
                        }
                    })} 
                />
                {errors.newPass && <span className="alert">{errors.newPass.message}</span>}

                <button type="submit" className="button">
                    Actualizar Contraseña
                </button>

                {mutacion.isPending && (
                    <img className="Loading" src="https://mvalma.com/inicio/public/include/img/ImagenesTL/paginaTL/Cargando.gif" alt="Cargando" />
                )}
                {mutacion.isSuccess && (
                    <span className="status-msg success-text">¡Contraseña cambiada con éxito!</span>
                )}
                {mutacion.isError && (
                    <span className="status-msg error-text">Error al actualizar la contraseña. Inténtalo de nuevo.</span>
                )}

                <Link to="/" className="button btn-back">
                    Atrás
                </Link>
            </form>
        </div>
    );
};

export default ForgotPassword;
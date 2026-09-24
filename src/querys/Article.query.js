import api from "./api";
import Cookies from "universal-cookie";
import { URL } from "./Auth.query";

const cook = new Cookies()

const idUser = cook.get(`id`)
export async function GetArticles(id) {
    return await api.get(`${URL}/Article/GetArticles/${id}`)
}
export async function AddArticle(data) {
    /* multipart/form-data real: el File viaja como binario, no como JSON */
    const fd = new FormData();
    const d = new Date(data.publicationDate);
    fd.append("articleName", data.title);
    fd.append("resume", data.resume);
    fd.append("link", data.link);
    fd.append("type", "1");
    fd.append("year", String(d.getFullYear()));
    fd.append("month", String(d.getMonth() + 1));
    fd.append("day", String(d.getDate()));
    fd.append("image", data.image);
    return await api.post(`${URL}/Article/PostArticle/${idUser}`, fd)
}
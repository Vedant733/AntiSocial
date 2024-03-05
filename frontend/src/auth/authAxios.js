import axios from "axios"
import { TOKEN } from "../constants/dbConstants"

export const authAxios = () => {
    const accessToken = localStorage.getItem(TOKEN)
    const instance = axios.create({
        headers: {
            Authorization: `${accessToken}`,
        }
    })
    return instance
}
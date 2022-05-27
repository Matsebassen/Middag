import axios from 'axios';
import { Dinner } from '../models/dinner';

const API = 'https://middagsapp.azurewebsites.net/API/MiddagsApp';

export const searchDinner = (search: string): Promise<Dinner[]> => {
  return axios.post(`${API}/SearchDinner`, search, {headers: { 'Content-Type': 'application/json' }})
    .then(res => res.data);
}

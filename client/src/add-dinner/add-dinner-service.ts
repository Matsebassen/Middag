import axios from 'axios';
import { Dinner } from '../models/dinner';

const API = 'https://middagsapp.azurewebsites.net/API/MiddagsApp';

export const addDinner = (dinner: Dinner): Promise<Dinner> => {
  return axios.post(`${API}/AddNewDinner`, dinner)
    .then(res => res.data);
}

import axios from 'axios';
import { Dinner } from '../models/dinner';

const API = 'https://localhost:7267/api';

export const addDinner = (dinner: Dinner): Promise<Dinner> => {
  return axios.post(`${API}/DinnerItems`, dinner)
    .then(res => res.data);
}

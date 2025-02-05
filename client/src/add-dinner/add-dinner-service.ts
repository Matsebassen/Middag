import axios from "axios";
import { Dinner } from "../models/dinner";
import { API } from "../api";

export const addDinner = (dinner: Dinner): Promise<Dinner> => {
  return axios.post(`${API}/DinnerItems`, dinner).then((res) => res.data);
};

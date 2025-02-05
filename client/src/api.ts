export const API =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "https://localhost:7267/api"
    : "https://middagapi.azurewebsites.net/api";

export const signalrUrl =
  !process.env.NODE_ENV || process.env.NODE_ENV === "development"
    ? "wss://localhost:7267/notificationHub"
    : "wss://middagapi.azurewebsites.net/notificationHub";

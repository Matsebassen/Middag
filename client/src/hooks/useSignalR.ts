import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel,
} from "@microsoft/signalr";
import { useEffect, useState } from "react";

export const useSignalR = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const authData = localStorage.getItem("ls.authorizationData");
    let tokenObj: { token: string } | null = null;
    if (authData) {
      try {
        tokenObj = JSON.parse(authData);
      } catch {
        console.error("Failed to fetch token");
      }
    }

    const signalrUrl = "wss://localhost:7267/notificationHub";

    const connectionBuilder = new HubConnectionBuilder()
      .withUrl(signalrUrl, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets,
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
    setConnection(connectionBuilder);
  }, []);

  return { connection };
};

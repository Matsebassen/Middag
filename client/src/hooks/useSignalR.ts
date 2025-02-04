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
    const signalrUrl = "wss://middagapi.azurewebsites.net/notificationHub";

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

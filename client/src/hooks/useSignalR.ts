import {
  HttpTransportType,
  HubConnection,
  HubConnectionBuilder,
  LogLevel
} from "@microsoft/signalr";
import { useEffect, useState } from "react";
import { signalrUrl } from "../api";

export const useSignalR = () => {
  const [connection, setConnection] = useState<HubConnection | null>(null);

  useEffect(() => {
    const connectionBuilder = new HubConnectionBuilder()
      .withUrl(signalrUrl, {
        skipNegotiation: true,
        transport: HttpTransportType.WebSockets
      })
      .configureLogging(LogLevel.Information)
      .withAutomaticReconnect()
      .build();
    setConnection(connectionBuilder);
  }, []);

  return { connection };
};

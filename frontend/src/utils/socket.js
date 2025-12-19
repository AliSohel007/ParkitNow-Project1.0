import { io } from "socket.io-client";

const socket = io("https://parkitnow-project1-0-1.onrender.com", {
  transports: ["websocket"],
});

export default socket;

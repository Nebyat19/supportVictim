// socket.js
import { io } from 'socket.io-client';

const connectSocket = (namespace, token) => {
  if (!token) {
    console.error(`❌ No token provided for ${namespace} connection.`);
    return null;
  }

  const socket = io(`http://wertc.tiletsolution.com${namespace}`, {
    auth: { token },
    transports: ['websocket', 'polling'],
    reconnection: true, // Enable reconnection
    reconnectionAttempts: 10, // Retry up to 10 times
    reconnectionDelay: 1000, // Wait 1 second between retries
    timeout: 20000, // Increase timeout to 20 seconds
    forceNew: true,
  });

  socket.on('connect', () => {
    console.log(`✅ Connected to ${namespace} with socket ID:`, socket.id);
  });

  socket.on('connect_error', (err) => {
    console.error(`❌ Connection error to ${namespace}:`, err.message);
  });

  socket.on('disconnect', (reason) => {
    console.warn(`⚠️ Disconnected from ${namespace}:`, reason);
    if (reason === 'io server disconnect') {
      // The server explicitly disconnected the client
      socket.connect(); // Reconnect manually
    }
  });

  socket.on('reconnect_attempt', () => {
    console.log(`🔄 Attempting to reconnect to ${namespace}...`);
  });

  socket.on('reconnect', () => {
    console.log(`✅ Successfully reconnected to ${namespace}.`);
  });

  return socket;
};

export const getChatSocket = (token) => connectSocket('/chat', token);
export const getSignalingSocket = (token) => connectSocket('/signaling', token);

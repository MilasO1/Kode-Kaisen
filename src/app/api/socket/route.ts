
import { NextResponse } from 'next/server';
import { Server } from 'socket.io';

export async function GET() {
  const response = NextResponse.json({ success: true });
  
  if (!global.socketServer) {
    const httpServer = require('http').createServer();
    global.socketServer = new Server(httpServer);
    
    httpServer.listen(3001, () => {
      console.log('Socket.IO server running on port 3001');
    });
  }
  
  return response;
}
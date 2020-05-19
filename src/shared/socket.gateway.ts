import { SubscribeMessage, WebSocketGateway, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { Logger } from '@nestjs/common';

@WebSocketGateway(3001)
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  socket;

  @SubscribeMessage('message')
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }

  handleConnection(client) {
    Logger.log(`New Client connected`);
    client.emit('Connection', 'Connect to server successfully');
  }

  handleDisconnect(client) {
    Logger.log('Client disconnected');
    client.emit('Disconnection', 'Client disconnected');
  }
}

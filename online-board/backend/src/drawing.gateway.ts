import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class DrawingGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private clients = new Set<Socket>();
  private clearVotes = new Set<string>();

  handleConnection(client: Socket) {
    this.clients.add(client);
    this.server.emit("usersCount", this.clients.size);
  }

  handleDisconnect(client: Socket) {
    this.clients.delete(client);
    this.clearVotes.delete(client.id);
    this.server.emit("usersCount", this.clients.size);
  }

  @SubscribeMessage('draw')
  handleDraw(@MessageBody() data: { x: number; y: number; color: string; isDrawing: boolean; isNewStroke: boolean }) {
    this.server.emit('draw', data);
  }

    @SubscribeMessage('requestClear')
    handleClearRequest(client: Socket) {
      this.clearVotes.add(client.id);
      this.server.emit("clearRequest", this.clearVotes.size);   
      if (this.clearVotes.size >= this.clients.size) {
        this.server.emit("clearApproved");
        this.clearVotes.clear();
      }
    }


  @SubscribeMessage('confirmClear')
  handleConfirmClear(client: Socket) {
    this.clearVotes.add(client.id);
    this.server.emit("clearRequest", this.clearVotes.size);

    if (this.clearVotes.size >= this.clients.size) {
      this.server.emit("clearApproved");
      this.clearVotes.clear();
    }
  }

}

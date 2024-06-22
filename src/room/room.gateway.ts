import { OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { RoomService } from './room.service';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { JoinRoomDto } from './dtos/joinroom.dto';
import { UpdateUserPositionDto } from './dtos/updateposition.dto';
import { ToggleMuteDto } from './dtos/togglemute.dto';

type ActiveSocketType ={
  room: String;
  id: String;
  userId: String;
}

@WebSocketGateway({cors: true})
export class RoomGateway implements OnGatewayInit , OnGatewayDisconnect {
  
  constructor(private readonly service: RoomService){}

  private logger = new Logger(RoomGateway.name)


  @WebSocketServer() wss: Server;
  private activeSockets: ActiveSocketType[] = [];

  async handleDisconnect(client: any) {
    
    const existingOnSocket =  this.activeSockets.find(
      socket => socket.id === client.id
    )

    if(!existingOnSocket) return;

    this.activeSockets = this.activeSockets.filter(
      socket => socket !== client.id
    );

    await this.service.deleteUsersPosition(client.id);
    client.broadcast.emit(`${existingOnSocket.room}-remove-user `, {socketId: client.id})


    this.logger.debug(`Client: ${client.id} disconnected`);
  }

  afterInit(server: any) {
    this.logger.log('Gateway initialized');
  }



  @SubscribeMessage('join')
  async handleMessage(client: Socket, payload: JoinRoomDto){
    const {link, userId} = payload;

    const existingSocket = this.activeSockets.find(
      socket => socket.room === link && socket.id === client.id
    )

    if(!existingSocket){
      this.activeSockets.push({room: link, id: client.id, userId});
      const dto = { 
        link,
        userId,
        x: 2, 
        y: 2, 
        orientantion: "down"
      } as UpdateUserPositionDto;

      await this.service.updateUserPosition(client.id, dto);
      const users = await this.service.listUsersPositionByLink(link);

      this.wss.emit(`${link}-update-user-list`, {users});
      //Emitindo para todos 
      // Quando entrar na sala todo mundo precisa saber a lista de users atualizados

      client.broadcast.emit(`${link}-add-user`, {user : client.id})
      // Emitindo para todos menos eu que estou entrando na sala
      // Eu não preciso falar para mim mesmo, que eu entrei na sala, mas eu preciso falar para os outros


    }
    this.logger.debug(`Socket client: ${client.id} start to join room ${link}`)
  }

  @SubscribeMessage('move')
  async handleMove(client: Socket, payload: UpdateUserPositionDto){
    const {link, userId, x,y, orientantion} = payload;
    const dto = { 
      link,
      userId,
      x,
      y,
      orientantion
    } as UpdateUserPositionDto;
    await this.service.updateUserPosition(client.id, dto);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, {users});
  }

  @SubscribeMessage('toggle-user-mute')
  async handleToggleMute(_: Socket, payload: ToggleMuteDto){
    const {link} = payload;
    await this.service.updateUserMute(payload);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, {users});
  }
}

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

// interface da posição dos usuários
type Positions = {
  x: number;
  y:number;
}


// função para gerar todas as posições do usuarios
function generationAllPositions(allX: number, allY: number): Positions[]{
  const positions: Positions[] =[];
  for(let x = 1; x <=allX; x++){
    for(let y = 1; y <=allY; y++){
      positions.push({x,y})
    }
  } 
  return positions;
}//vai me devolver algo como [{1,1},{1,2},{1,3}....{8,7},{8,8}]


// Coloca uma posição aleatória para cada usuário
function randomPosition(openPosition: Positions[]) : Positions{ 
// Positions[] -> devolve uma array de posições; Positions -> Devolve uma única posição
const random = Math.floor(Math.random() * openPosition.length);
return openPosition.splice(random, 1)[0];
}


@WebSocketGateway({cors: true})
export class RoomGateway implements OnGatewayInit , OnGatewayDisconnect {
  
  constructor(private readonly service: RoomService){}

  private logger = new Logger(RoomGateway.name)


  @WebSocketServer() wss: Server;
  private activeSockets: ActiveSocketType[] = [];
  private allPositions: Positions[] = generationAllPositions(8,8);//Gerar posiçoes
  private userPositions: { [key: string]: Positions } = {};//{idDoUsuario : {x,y}}

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


      let position: Positions;
      if(this.userPositions[userId]){
        position = this.userPositions[userId];
      }else{
        position = randomPosition(this.allPositions);
        this.userPositions[userId] = position;
      }


      const dto = { 
        link,
        userId,
        x: position.x, 
        y: position.y, 
        orientation: 'down'
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
    const {link, userId, x,y, orientation} = payload;
    const dto = { 
      link,
      userId,
      x,
      y,
      orientation
    } as UpdateUserPositionDto;
    await this.service.updateUserPosition(client.id, dto);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, {users});
  }

  @SubscribeMessage('toggl-mute-user')
  async handleToggleMute(_: Socket, payload: ToggleMuteDto){
    const {link} = payload;
    await this.service.updateUserMute(payload);
    const users = await this.service.listUsersPositionByLink(link);
    this.wss.emit(`${link}-update-user-list`, {users});
  }
  
  @SubscribeMessage('call-user')
  async callUser(client: Socket, data: any){
    this.logger.debug(`callUser: ${client.id} to: ${data.to}`)
    client.to(data.to).emit('call-made',{
      offer: data.offer,
      socket: client.id
    });
  }
  @SubscribeMessage('make-answer')
  async makeAnswer(client: Socket, data: any){
    this.logger.debug(`makeAnswer: ${client.id} to: ${data.to}`)
    client.to(data.to).emit('answer-made',{
      answer: data.answer,
      socket: client.id
    })
  }
  
  
}

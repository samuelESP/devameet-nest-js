
# logger

Quando iniciamos o nosso projeto em nestJS, ele vai me criar dentro do meu main esse pedaço de código:

```ts
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();

```

Esse trecho cria uma instância do aplicativo/nestJS, e o AppModule é uma referência ao módulo principal do seu aplicativo Nest.js.

Porém esse create tem uma outro parâmentro, onde esse segundo parâmentro é as configurações onde ele vai trabalhar, um desse parâmetros é o logger:

```ts
const app = await NestFactory.create(AppModule,{
    logger: ['debug', 'error', 'log', 'warn']
  });
```

O logger é responsável por registrar mensagens de diferentes níveis de gravidade, como debug, error, log e warn.

Se eu retirar o ``log``, pro exemplo, e resetar o meu aplicativo, notaremos que não irá aparecer nenhuma menssagem no meu console.

# enableCors()

- Cors: Ele vai configurar os dóminios, caminhos que a minha aplicação da permissão para ser acessada.

Ao chamar **app.enableCors();**, você está permitindo que seu servidor Nest.js responda a solicitações de recursos de origens diferentes, o que pode ser útil ao desenvolver APIs que serão consumidas por clientes em diferentes domínios. 

Como eu posso liberar para todos dóminios, eu também posso deixar particular para um único dóminio, exemplo:

```ts
app.enableCors({origin: "devameet.com"});
```

# Pipe

Essa linha de código está configurando um "pipe" global para o aplicativo Nest.js usando app.useGlobalPipes(). 
Pipes (tubos, em tradução livre) são um recurso fundamental no Nest.js que permite processar dados de entrada e saída de forma modular e reutilizável.

```ts
app.useGlobalPipes(...)
```
dentro dessa opção ele espera uma classe;

## ValidationPipe

- **transform: true**:Este parâmetro habilita a transformação dos dados de entrada para o tipo especificado pela classe decorada. Isso significa que, se os dados de entrada não estiverem no formato esperado, o Nest.js tentará convertê-los para o tipo correto antes de passá-los para os manipuladores de rota.
- **whitelist: true**: Quando definido como true, esse parâmetro remove quaisquer propriedades dos objetos de entrada que não estejam explicitamente definidas nas classes DTO (Data Transfer Object). Isso ajuda a garantir que apenas os dados esperados sejam processados.
- **forbidNonWhitelisted: false**:Esse parâmetro determina o comportamento em relação a propriedades não autorizadas nos objetos de entrada. Quando definido como false, o Nest.js simplesmente ignora propriedades não autorizadas. Se definido como true, o Nest.js irá lançar uma exceção se detectar propriedades não autorizadas.


```ts
app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: false
    }));
```
Em resumo, essa linha de código configura um pipe global de validação para o aplicativo Nest.js, que transforma os dados de entrada, filtra as propriedades não autorizadas e permite propriedades adicionais não autorizadas sem lançar uma exceção.

# setGlobalPrefix

Ele vai setar como global todos os meus serviços por um prefixo específico.

```ts
app.setGlobalPrefix('api');
```

Eu já tenho o meu **http://localhost:3000/** como  a raiz do meu projeto, porém ao usar o setGlobalPrefix os servições agora vão estar em **http://localhost:3000/api**

# SOLID
SOLID são cinco princípios da programação orientada a objetos que facilitam no desenvolvimento de softwares, tornando-os fáceis de manter e estender. Esses princípios podem ser aplicados a qualquer linguagem de POO.

## SRP — Single Responsibility Principle:
Princípio da Responsabilidade Única — Uma classe deve ter um, e somente um, motivo para mudar.

Esse princípio declara que uma classe deve ser especializada em um único assunto e possuir apenas uma responsabilidade dentro do software, ou seja, a classe deve ter uma única tarefa ou ação para executar.

## OCP — Open-Closed Principle:
Princípio Aberto-Fechado — Objetos ou entidades devem estar abertos para extensão, mas fechados para modificação, ou seja, quando novos comportamentos e recursos precisam ser adicionados no software, devemos estender e não alterar o código fonte original.

## LSP— Liskov Substitution Principle:
Princípio da substituição de Liskov — Uma classe derivada deve ser substituível por sua classe base.

O princípio da substituição de Liskov foi introduzido por Barbara Liskov em sua conferência “Data abstraction” em 1987. A definição formal de Liskov diz que:

*Se para cada objeto o1 do tipo S há um objeto o2 do tipo T de forma que, para todos os programas P definidos em termos de T, o comportamento de P é inalterado quando o1 é substituído por o2 então S é um subtipo de T*

Um exemplo mais simples e de fácil compreensão dessa definição. Seria:

*se S é um subtipo de T, então os objetos do tipo T, em um programa, podem ser substituídos pelos objetos de tipo S sem que seja necessário alterar as propriedades deste programa.*

##  ISP — Interface Segregation Principle:
Princípio da Segregação da Interface — Uma classe não deve ser forçada a implementar interfaces e métodos que não irão utilizar.

Esse princípio basicamente diz que é melhor criar interfaces mais específicas ao invés de termos uma única interface genérica.


## DIP — Dependency Inversion Principle:
Princípio da Inversão de Dependência — Dependa de abstrações e não de implementações.

De acordo com Uncle Bob, esse princípio pode ser definido da seguinte forma:

1. Módulos de alto nível não devem depender de módulos de baixo nível. Ambos devem depender da abstração.

2. Abstrações não devem depender de detalhes. Detalhes devem depender de abstrações.

No contexto da programação orientada a objetos, é comum que as pessoas confundam a Inversão de Dependência com a Injeção de Dependência, porém são coisas distintas, mas que relacionam entre si com um proposito em comum, deixar o código desacoplado.

Importante: Inversão de Dependência não é igual a Injeção de Dependência, fique ciente disso! A Inversão de Dependência é um princípio (Conceito) e a Injeção de Dependência é um padrão de projeto (Design Pattern).

# DTO

```ts
import { IsEmail, IsNotEmpty } from "class-validator";
import { MessagesHelper } from "../helpers/messages.helper";

export class LoginDto {
    @IsEmail({},{message: MessagesHelper.AUTH_lOGIN_NOT_FOUND})
    login: string;

    @IsNotEmpty({message: MessagesHelper.AUTH_PASSWORD_NOT_FOUND})
    password: string;
}
```

Este é um exemplo de um DTO (Data Transfer Object) em TypeScript usado para validar os dados recebidos em uma solicitação de login em um aplicativo Nest.js. 

# @IsEmail

```ts
@IsEmail({},{message: MessagesHelper.AUTH_lOGIN_NOT_FOUND})
login: string;
```

**@IsEmail({},{message: MessagesHelper.AUTH_lOGIN_NOT_FOUND})**: 
Este decorador ***@IsEmail()*** é aplicado à propriedade ***login***, indicando que ela deve ser uma string válida de e-mail. 
O segundo argumento passado para o decorador é um objeto vazio ***{}*** que pode ser usado para fornecer opções de validação adicionais. 
Além disso, a mensagem de erro personalizada definida em ***MessagesHelper.AUTH_lOGIN_NOT_FOUND*** será usada se a validação falhar.

# @IsNotEmpty

```ts
@IsNotEmpty({message: MessagesHelper.AUTH_PASSWORD_NOT_FOUND})
    password: string;
```

**@IsNotEmpty({message: MessagesHelper.AUTH_PASSWORD_NOT_FOUND})**: 
Este decorador ***@IsNotEmpty()*** é aplicado à propriedade ***password***, indicando que ela não pode estar vazia. 
Assim como no caso anterior, a mensagem de erro personalizada definida em ***MessagesHelper.AUTH_PASSWORD_NOT_FOUND*** será usada se a validação falhar.


# @Injectable()

Este decorador é tipicamente usado no Angular ou no NestJS para indicar que uma classe é injetável, o que significa que pode ser fornecida e injetada com dependências por meio do construtor.


# BadRequestException

```ts
hrow new BadRequestException(MessagesHelper.AUTH_PASSWORD_0R_LOGIN_NOT_FOUND)
```

Esta linha de código está lançando uma exceção do tipo BadRequestException com uma mensagem recuperada de um MessagesHelper.


# @Controller("auth"): 
Este decorador indica que esta classe é um controlador e que as rotas devem ser prefixadas com "/auth"

# constructor(private readonly authService: AuthService):

O construtor injeta uma instância do serviço AuthService para que ele possa ser usado dentro do controlador.

# @Post('login'):
 Este decorador especifica que o método login() deve ser associado à rota "POST /auth/login".

# @HttpCode(HttpStatus.OK):
 Este decorador define o código de status HTTP da resposta como 200 (OK). Embora isso não seja necessário, já que 200 é o código de status padrão para uma resposta bem-sucedida de um POST

# login(@Body() dto: LoginDto): 
Este método manipula as solicitações de login. Ele espera receber um objeto LoginDto no corpo da solicitação e então repassa esse objeto para o método login() do serviço AuthService.

# ConfigModule.forRoot():

## ConfigModule: 
Este módulo é geralmente usado para carregar e gerenciar variáveis de configuração da aplicação, como as que estão definidas em arquivos .env.
## forRoot(): 
Este método é chamado para configurar o módulo de configuração com as opções padrão. Ele normalmente carrega as variáveis de ambiente definidas em um arquivo .env na raiz do projeto.

# MongooseModule.forRoot(process.env.DATABASE_URL):

## MongooseModule: 
Este módulo é usado para integrar o Mongoose, uma biblioteca de modelagem de dados para MongoDB, com o NestJS.
## forRoot(process.env.DATABASE_URL): 
Este método é chamado para configurar a conexão com o banco de dados MongoDB. O URL do banco de dados é obtido a partir da variável de ambiente DATABASE_URL. process.env.DATABASE_URL acessa essa variável, permitindo que a aplicação se conecte ao MongoDB usando a URL especificada.


Carrega as variáveis de configuração de um arquivo .env usando o ConfigModule.
Configura a conexão com um banco de dados MongoDB usando o MongooseModule e a URL especificada na variável de ambiente DATABASE_URL.

# Schema

```ts

@Schema()
export class User{

    @Prop({required: true})
    name:string;
    @Prop({required: true})
    email:string;
    @Prop({required: true})
    password:string;
    @Prop()
    avatar:string;
}
```

# @Prop

Podemos chamar o @Prop de @Propriedades, ele literalmente via ser responsável para adicionar **Propriedades** ao meu Schema.
Se você não usar o decorador @Prop no seu esquema ao definir uma classe de documento no NestJS com Mongoose, o SchemaFactory.createForClass não terá as informações necessárias para mapear as propriedades da classe para o esquema Mongoose corretamente.


# SchemaFactory.createForClass()

 é um método utilizado para criar um esquema Mongoose a partir de uma classe TypeScript. Isso é parte da integração do NestJS com Mongoose para fornecer uma forma mais estruturada e tipada de definir modelos de dados.


# HydratedDocument&lt;User&gt;

É um tipo genérico fornecido por Mongoose que representa um documento que foi "hidratado".
Hidratar um documento significa que ele foi convertido de um objeto simples (plain object) para uma instância de um documento Mongoose completo, com todos os métodos e propriedades do Mongoose.
Em Mongoose, "hidratação" refere-se ao processo de preencher um documento Mongoose com métodos e propriedades adicionais que Mongoose adiciona, como métodos de instância (save, remove, etc.).


```ts
export type UserDocument = HydratedDocument<User>;

```
O tipo genérico ***User*** é passado para HydratedDocument, indicando que estamos lidando com documentos baseados na classe ***User***.
Quando você trabalha com documentos Mongoose, você frequentemente precisa de acesso não apenas aos dados brutos armazenados no documento, mas também aos métodos e propriedades que Mongoose adiciona. 
Ao definir UserDocument como um HydratedDocument&lt;User&gt;, você está dizendo ao TypeScript que este documento inclui todas as propriedades e métodos da classe User, bem como as funcionalidades adicionais do Mongoose.

Quando você utiliza o tipo HydratedDocument do Mongoose, está dizendo ao TypeScript que o documento retornado não é apenas um simples objeto com as propriedades definidas em sua classe, mas também um objeto enriquecido com as funcionalidades adicionais do Mongoose.

"Hidratar" um documento no contexto do Mongoose significa transformar um documento cru, que é basicamente um simples objeto JavaScript, em um objeto Mongoose completo. 
Isso envolve adicionar métodos e propriedades adicionais fornecidos pelo Mongoose. 
Esses métodos e propriedades adicionais permitem que você interaja com o documento de forma mais rica, como salvar, atualizar, remover, e validar dados, além de muitas outras funcionalidades específicas do Mongoose.

# @InjectModel()

é usado para injetar um modelo Mongoose em um serviço. Quando você define uma injeção de modelo dessa maneira, está configurando seu serviço para interagir com a coleção MongoDB correspondente.


# MongooseModule.forFeature()

O método MongooseModule.forFeature() no NestJS é utilizado para registrar modelos Mongoose que estarão disponíveis para injeção de dependências dentro de um módulo específico. Isso permite que você defina quais esquemas de dados (modelos) estarão disponíveis e possam ser injetados nos serviços e controladores do módulo em questão.

# PassportStrategy

uma classe base fornecida pela biblioteca @nestjs/passport, que integra o Passport.js ao NestJS. PassportStrategy é um generic class que aceita um parâmetro, neste caso, Strategy, que especifica o tipo de estratégia de autenticação que está sendo implementada.
Aqui, Strategy refere-se à estratégia JWT do Passport.js, fornecida pelo pacote passport-jwt.

## Passport.js: 
É uma biblioteca de middleware de autenticação para Node.js. Suporta várias estratégias de autenticação, incluindo JWT.

Ao herdar de PassportStrategy, a nova classe ganha a infraestrutura necessária para implementar uma estratégia de autenticação usando JWT.

# jwtFromRequest: 

É uma propriedade de configuração que especifica como o JWT (JSON Web Token) será extraído da solicitação HTTP. 
Esta configuração é necessária para que a estratégia JWT saiba onde encontrar o token no pedido HTTP.


# ExtractJwt.

É um objeto importado do pacote passport-jwt. Ele fornece métodos auxiliares para extrair o token JWT de diferentes partes da solicitação HTTP.

# fromAuthHeaderAsBearerToken()

É um método do objeto ExtractJwt. Este método especifica que o token JWT deve ser extraído do cabeçalho de autorização da solicitação HTTP, onde o token é enviado como um "Bearer token".

Este método analisa o cabeçalho de autorização, procura um valor que comece com a palavra "Bearer" seguida de um espaço e, em seguida, extrai e retorna o token que segue.


# ignoreExpiration: true

uma propriedade de configuração usada na estratégia JWT que indica se a expiração do token JWT deve ser ignorada durante o processo de validação.

# secretOrKey: process.env.USER_JWT_SECRET_KEY,

 é uma propriedade de configuração que define a chave secreta ou chave pública usada para verificar a assinatura do token JWT.

# validate(payload:any)
## validate
O nome do método. Em estratégias de autenticação do Passport.js, o método validate é invocado automaticamente após o token JWT ser decodificado e verificado.

## payload: any 
O parâmetro payload representa os dados decodificados do token JWT. Geralmente, o payload contém informações sobre o usuário e outros dados adicionais que foram codificados no token.

# return { userId: payload.sub, email: payload.email }

O método retorna um objeto que contém o userId e o email extraídos do payload do token JWT.
payload.sub: sub é uma abreviação de "subject" e normalmente contém o identificador principal do usuário (como o ID do usuário) no token JWT.
payload.email: O campo email do payload contém o endereço de e-mail do usuário.

# JwtModule.register({})

Este é o módulo fornecido pelo pacote @nestjs/jwt. Ele facilita a configuração e o uso de JWT (JSON Web Tokens) em uma aplicação NestJS.

Register método estático é usado para configurar o JwtModule com as opções fornecidas. Ele retorna um módulo configurado que pode ser importado em outros módulos da aplicação NestJS.
O objeto passado para register contém as opções de configuração para o módulo JWT.
# secret: process.env.USER_JWT_SECRET_KEY

 Esta é uma das opções de configuração mais importantes. Ela define a chave secreta usada para assinar e verificar os tokens JWT.

# Guards

Os Guards são como se fossem chaves que permitem travarmos uma função, endpoint, etc para que so sejam requeridos no momento que queremos.
No nosso caso, os Guards vão travar tudo, e so as coisas publicas serão as exceções.


# SetMetadata

É uma função fornecida pelo NestJS que permite definir metadados personalizados para rotas, controladores, ou métodos.
Metadados são informações adicionais que não afetam diretamente a lógica do programa, mas que podem ser usadas por outros componentes ou middlewares para modificar o comportamento.

***SetMetadata(IS_PUBLIC_KEY, true)***: Define um metadado com a chave ***IS_PUBLIC_KEY*** e o valor ***true***.

***IsPublic*** é um decorator que a gente criou para armazenar essas metadados.

Um metadado criado com SetMetadata necessita de uma key onde o metadado é armazenado(`IS_PUBLIC_KEY = 'is_Public'`), e de um dado que se associa a essa key(no caso `true`);

Esse metadado pode ser usado com a função ***Reflector***

# AuthGuard


AuthGuard vem do Passport.JS, configurada para usar a estratégia 'jwt'.

Utilizada para proteger rotas e controlar o acesso baseado em tokens JWT.

Quando usamos ***AuthGuard*** em ***NestJS***, ele trabalha em conjunto com o Passport para proteger rotas, controladores ou mesmo toda a aplicação.


# Reflector

Utilizado para acessar os metadados definidos pelos decorators, como IsPublic.
super() chama o construtor da classe base AuthGuard('jwt')

# canActivate

Esse método é usado geralmente com um ***GUARD*** para determinar quando uma requisição deverá ser permitada baseada em certos critérios. 

# context: ExecutionContext

Proporciona detalhes sobre o contexto da execução atual (como o manipulador da rota e a classe do controlador).


# getAllAndOverride

O método getAllAndOverride procura o metadado IS_PUBLIC_KEY no manipulador da rota e na classe do controlador.


# [context.getHandler(), context.getClass()]

Uma lista de alvos onde o Reflector vai procurar o metadado. Primeiro, ele busca no manipulador da rota (context.getHandler()), e se não encontrar, busca na classe do controlador (context.getClass()).

context.getHandler(): Refere-se ao método específico que lida com a rota.
context.getClass(): Refere-se à classe do controlador onde o método está definido.

# @Prop({type: mongoose.Schema.Types.ObjectId, ref: 'User'})user: User;

Define uma propriedade chamada user, que se referência a um documento ***User*** em outra coleção.

A propriedade `user` é um `ObjectId`. **ObjectId** é um tipo do especial usado pelo MongoDB com indentidade única de um documento.

# @Type()

É usado para especificar o tipo de uma propriedade. Isso é especialmente útil quando estamos lidando com propriedades aninhadas ou arrays de objetos.
O @Type, espera um callback.

# @ValidateNested

É usado para validar objetos aninhados.

O parâmetro ****{ each: true }**** indica que a validação deve ser aplicada a cada item do array, se a propriedade em questão for um array de objetos.

Quando eu receber um array ele vai receber cada um dos elementos e executar a validação de cada um dos objetos para ter certeza que eles estão certos.

# Websocket

WebSocket é uma tecnologia que fornece um canal de comunicação bidirecional full-duplex sobre uma única conexão TCP. Essa tecnologia é utilizada principalmente para permitir uma comunicação interativa entre um navegador e um servidor web, em tempo real. 

Imagine o cenário:

    Dentro de um jogo, multiplayer, existe 2 jogadores em uma mesma sala.
    Um dos jogadores decide mexer seu personagem, fazendo assim uma requisição para o servidor.
    Porém, se tem 2 jogadores, o outro jogador também tem que ver o primeiro jogador mexendo.
    Logo, o servidor tem que passar essa informação para o computador do segundo jogador.

O websocket veio para facilitar esse processo, ele cria um caminho entre o servidor e o cliente.
Então ao inves de fazer uma requisição direta para o servidor, o cliente vai requerir para o websocket, para assim o sevidor receber a informação.


# gateway

Um gateway, no contexto de desenvolvimento de software e redes, é um ponto de acesso que serve como entrada e saída para comunicação entre diferentes redes ou sistemas. 
Em termos simples, um gateway atua como um intermediário que permite que dados fluam entre diferentes ambientes, seja entre redes locais, 
entre uma rede local e a Internet, ou entre diferentes partes de uma aplicação.

# WebSocket

WebSocket é uma tecnologia que fornece um canal de comunicação bidirecional full-duplex sobre uma única conexão TCP. 
Essa tecnologia é utilizada principalmente para permitir uma comunicação interativa entre um navegador e um servidor web, em tempo real. 

# @WebSocketGateway

é um decorator utilizado no framework NestJS para definir uma gateway WebSocket.
ste decorator é aplicado a uma classe para configurar um servidor WebSocket que pode escutar eventos e enviar mensagens em tempo real. 


# @WebSocketServer()wss: Server;

é uma linha de código em NestJS que injeta a instância do servidor WebSocket (Server do socket.io) em uma propriedade da classe. 
Isso permite que você interaja diretamente com o servidor WebSocket para emitir eventos e gerenciar conexões. 
@WebSocketServer(): Este é um decorator fornecido pelo módulo @nestjs/websockets. Ele marca a propriedade wss para ser injetada com a instância do servidor WebSocket.
wss: Server;: Define uma propriedade chamada wss do tipo Server (a classe Server é importada do socket.io). Isso é onde a instância do servidor WebSocket será armazenada.




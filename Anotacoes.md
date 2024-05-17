
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
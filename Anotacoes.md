
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
# Sorteio Pelada

Aplicação full-stack para organizar peladas de futebol, com autenticação de usuários, gestão de jogadores e sorteio inteligente de times equilibrados. O projeto é composto por uma API NestJS conectada ao MongoDB e um front-end Angular com PrimeNG para oferecer uma experiência moderna e responsiva.

## Sumário
- [Arquitetura](#arquitetura)
- [Principais funcionalidades](#principais-funcionalidades)
  - [API (api-sorteio)](#api-api-sorteio)
  - [Front-end (sorteio_pelada)](#front-end-sorteio_pelada)
- [Estrutura do repositório](#estrutura-do-repositório)
- [Pré-requisitos](#pré-requisitos)
- [Configuração e execução](#configuração-e-execução)
  - [API](#api)
  - [Front-end](#front-end)
- [Variáveis de ambiente](#variáveis-de-ambiente)
- [Scripts disponíveis](#scripts-disponíveis)
- [Documentação da API](#documentação-da-api)
- [Fluxo de uso recomendado](#fluxo-de-uso-recomendado)
- [Testes](#testes)
- [Deploy](#deploy)
- [Tecnologias](#tecnologias)

## Arquitetura
| Camada      | Descrição |
|-------------|-----------|
| **API**     | NestJS 10 com módulos de autenticação JWT, usuários, jogadores e sorteio; expõe endpoints REST protegidos por `JwtAuthGuard` e documentados via Swagger. |
| **Banco**   | MongoDB, com coleções particionadas por usuário para os jogadores cadastrados. |
| **Front-end** | Angular 19 com PrimeNG e Angular Standalone Components, rotas protegidas, interceptador HTTP e compartilhamento nativo via `navigator.share`. |

## Principais funcionalidades
### API (`api-sorteio`)
- **Autenticação e perfil**: cadastro com validação de credenciais fortes, login com estratégia local e emissão de JWT, além de endpoint `/auth/profile` para obter o usuário autenticado.
- **Gestão de jogadores**: CRUD protegido por token, salvando os atributos técnicos de cada jogador em coleções isoladas por usuário (`Jogadores_<userId>`).
- **Sorteio balanceado de times**: algoritmo com até 500 tentativas aleatórias, normalização de atributos e métrica de equilíbrio por média ponderada para gerar times equilibrados respeitando limites por time.
- **Configuração flexível**: carregamento de variáveis `.env` globais, conexão com MongoDB e geração automática da documentação Swagger em `/docs` com suporte a Bearer Token.

### Front-end (`sorteio_pelada`)
- **Fluxo de autenticação**: telas de login e cadastro com feedback visual, validações detalhadas e armazenamento seguro de token/perfil em `localStorage` via utilitários centralizados.
- **Proteção de rotas e interceptador**: guarda que redireciona visitantes não autenticados e interceptor que adiciona o JWT automaticamente nas chamadas HTTP.
- **Gestão visual de jogadores**: tabela com filtros, seleção múltipla, diálogos dinâmicos para criação/edição, confirmação de exclusão e feedback via toasts usando PrimeNG.
- **Sorteio e compartilhamento**: modal para configurar o sorteio e página de resultados com opção de compartilhar imagem gerada com `html2canvas` ou reiniciar o processo.
- **Configuração de hosts**: resolver centralizado que monta URLs a partir do arquivo de ambiente, facilitando a troca de back-end por ambiente.

## Estrutura do repositório
```
Sorteio_Pelada/
├── api-sorteio/        # API NestJS (autenticação, jogadores e sorteio)
├── sorteio_pelada/     # Front-end Angular + PrimeNG
├── README.md           # Este arquivo
└── angular-deploy/     # Build estático da aplicação Angular pronto para deploy (ex.: Fly.io)
```

## Pré-requisitos
- Node.js 20+ e npm 10+.
- MongoDB 6+ (local ou remoto).
- Conta com permissões para criar bancos e coleções no MongoDB.

## Configuração e execução
### API
1. Entre na pasta e instale as dependências:
   ```bash
   cd api-sorteio
   npm install
   ```
2. Crie um arquivo `.env` na raiz da API com as variáveis listadas em [Variáveis de ambiente](#variáveis-de-ambiente).
3. Inicie em modo desenvolvimento:
   ```bash
   npm run start:dev
   ```
4. A API ficará disponível em `http://localhost:3000` (configurável via `PORT`).

### Front-end
1. Em outra aba do terminal:
   ```bash
   cd sorteio_pelada
   npm install
   ```
2. Ajuste `src/environments/environment.ts` se o back-end estiver em outro host/porta.
3. Rode o servidor de desenvolvimento:
   ```bash
   npm start
   ```
4. A aplicação web abrirá em `http://localhost:4200` consumindo a API rodando em `localhost:3000`.

## Variáveis de ambiente
| Variável        | Descrição | Exemplo |
|-----------------|-----------|---------|
| `MONGODB_URI`   | URI de conexão com MongoDB. | `mongodb://localhost:27017/sorteio-pelada` |
| `JWT_SECRET`    | Segredo usado para assinar o JWT. | `super-secret-key` |
| `JWT_EXPIRES_IN`| Tempo de expiração do token JWT (qualquer valor aceito pelo JWT). | `1d` |
| `PORT` (opcional) | Porta HTTP da API NestJS. | `3000` |

## Scripts disponíveis
### API (`api-sorteio`)
- `npm run start`: inicia a aplicação em modo produção.
- `npm run start:dev`: inicia com watch (Nest CLI).
- `npm run lint`: executa ESLint com correção automática.
- `npm run test`: executa a suíte de testes com Jest (unitários).
- `npm run test:e2e`: executa testes end-to-end (configuráveis em `test/jest-e2e.json`).
- `npm run build`: compila os arquivos TypeScript para `dist/`.

### Front-end (`sorteio_pelada`)
- `npm start`: inicia o servidor de desenvolvimento (`ng serve`).
- `npm run build`: gera build de produção em `dist/`.
- `npm run lint`: executa Angular ESLint.
- `npm test`: roda os testes unitários do Angular (Karma + Jasmine).

## Documentação da API
- Swagger disponível em `http://localhost:3000/docs` com descrição dos endpoints e suporte a autenticação Bearer.
- Endpoints principais:
  - `POST /auth/register`, `POST /auth/login`, `GET /auth/profile`, `GET /auth/me`.
  - `GET/POST/PUT/DELETE /players` (CRUD completo por usuário autenticado).
  - `POST /draw` para gerar times balanceados.

## Fluxo de uso recomendado
1. **Cadastro/Login**: crie uma conta ou entre com usuário existente.
2. **Cadastro de jogadores**: utilize o botão "Criar Jogador" para registrar os atletas e suas habilidades.
3. **Seleção**: marque os jogadores desejados na tabela (filtro disponível).
4. **Sorteio**: abra o modal "Sortear Times", defina o tamanho dos times e confirme.
5. **Resultado**: visualize os times, compartilhe a imagem ou refaça o sorteio.

## Testes
- API: `cd api-sorteio && npm test`
- Front-end: `cd sorteio_pelada && npm test`

## Deploy
- **API**: execute `npm run build` e depois `npm run start:prod` em ambiente com Node.js. Configure as variáveis de ambiente antes de subir.
- **Front-end**: utilize `npm run build` para gerar os arquivos estáticos. O diretório `angular-deploy/` contém um exemplo de build e configuração para Fly.io, incluindo `Dockerfile` e `fly.toml`.

## Tecnologias
- NestJS, Passport, JWT, Mongoose, Class-validator.
- Angular 19, PrimeNG, PrimeFlex, RxJS, html2canvas.
- TypeScript em toda a stack.

# 🚀 AstroMachine

**App mobile para contratação de serviços de montagem e personalização de PCs com temática espacial.**

Projeto acadêmico — PI IV (Projeto Integrador IV) — Desenvolvimento para Dispositivos Móveis

---

## 📋 Índice

- [Sobre o Projeto](#sobre-o-projeto)
- [Stack Tecnológica](#stack-tecnológica)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação e Execução](#instalação-e-execução)
- [Contas de demonstração locais](#contas-de-demonstração-locais)
- [API — Endpoints](#api--endpoints)
- [Documentação da Fase 2](#documentação-da-fase-2)
- [Funcionalidades](#funcionalidades)
- [Acessibilidade](#acessibilidade)

---

## Sobre o Projeto

O AstroMachine é um aplicativo voltado para entusiastas de hardware, gamers e admiradores de astronomia. Permite navegar por um catálogo de builds/PCs personalizados com temática espacial, adicionar ao carrinho, simular pagamento e, para administradores, gerenciar o catálogo via CRUD.

---

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Mobile | React Native + Expo + TypeScript |
| Navegação | Stack customizada (state-based) |
| Estado global | Zustand |
| Formulários | React Hook Form + Zod |
| Banco local | SQLite (expo-sqlite) |
| Persistência sessão | AsyncStorage |
| Backend | Node.js + Express + TypeScript |
| Autenticação | JWT (jsonwebtoken + bcryptjs) |

---

## Estrutura do Projeto

```
astromachine/
├── mobile/                      # App React Native (Expo)
│   ├── App.tsx                  # Entry point
│   ├── app.json                 # Configuração Expo
│   ├── package.json
│   └── src/
│       ├── components/          # Componentes reutilizáveis
│       ├── db/                  # SQLite e dados seed
│       │   ├── database.ts      # Schema e inicialização
│       │   └── seedData.ts      # Dados de demonstração
│       ├── navigation/          # Navegação
│       │   └── AppNavigator.tsx
│       ├── screens/             # Telas do app
│       │   ├── LoginScreen.tsx
│       │   ├── RegisterScreen.tsx
│       │   ├── CatalogScreen.tsx
│       │   ├── ProductDetailScreen.tsx
│       │   ├── CartScreen.tsx
│       │   ├── CheckoutScreen.tsx
│       │   ├── AdminDashboard.tsx
│       │   ├── AdminFormScreen.tsx
│       │   └── AccessibilityScreen.tsx
│       ├── services/            # Comunicação com API
│       │   └── api.ts           # Fetch com fallback local
│       ├── store/               # Estado global (Zustand)
│       │   ├── authStore.ts
│       │   └── cartStore.ts
│       ├── theme/               # Design tokens
│       │   └── index.ts
│       ├── types/               # Tipos TypeScript
│       │   └── index.ts
│       └── utils/               # Utilitários
│           ├── format.ts
│           └── validation.ts
├── server/                      # API Backend
│   ├── package.json
│   ├── tsconfig.json
│   └── src/
│       ├── index.ts             # Entry point Express
│       ├── middlewares/
│       │   └── auth.ts          # JWT middleware
│       ├── models/
│       │   └── types.ts         # Tipos do domínio
│       ├── routes/
│       │   ├── auth.ts          # Login e cadastro
│       │   ├── products.ts      # CRUD produtos
│       │   ├── services.ts      # CRUD serviços
│       │   ├── appointments.ts  # Agendamentos
│       │   └── checkout.ts      # Simulação de pagamento
│       └── services/
│           └── database.ts      # SQLite local + seed de demonstração opt-in
├── docs/                        # Documentação Fase 2
│   ├── fase2-der.md             # DER em Mermaid
│   ├── fase2-status-report.md   # Sprint Review
│   ├── fase2-risk-plan.md       # Riscos e mitigação
│   └── fase2-traceability.md    # Rastreabilidade
├── .vscode/                     # Configuração VS Code
│   ├── settings.json
│   └── extensions.json
├── .env.example                 # Variáveis de ambiente
├── .gitignore
└── README.md                    # Este arquivo
```

---

## Pré-requisitos

- **Node.js 22.x** para o backend (validação local com 22.18.0)
- **npm** >= 9.x
- **Expo CLI**: `npm install -g expo-cli` (opcional, pode usar `npx expo`)
- **Expo Go** instalado no celular (Android/iOS) para testar

---

## Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/GuilhermeSerafim/astromachine.git
cd astromachine
```

### 2. Configurar variáveis de ambiente

O backend lê `process.env`; seus scripts não carregam `.env` automaticamente.
Copiar o exemplo da raiz não injeta variáveis no servidor. Para desenvolvimento
sem dados de demonstração, não é necessário fornecer as variáveis `DEMO_*`:
o seed fica desligado por padrão.

Defina as variáveis necessárias no processo que inicia o backend. Por exemplo,
no PowerShell, antes de `npm run dev`:

```powershell
$env:NODE_ENV = "development"
$env:ENABLE_DEMO_SEED = "false"
```

`SERVER_PORT` é opcional (padrão 3001). `ASTROMACHINE_DB_PATH` permite escolher
o arquivo SQLite; sem ela, o caminho é `data/astromachine.db` relativo ao diretório
de execução. Nunca aponte testes ou demonstrações descartáveis para uma base real.

### 3. Instalar dependências e rodar o Backend

```bash
cd server
npm ci
npm run dev
```

O servidor iniciará em `http://localhost:3001`.
Health check: `http://localhost:3001/health`

### 4. Instalar dependências e rodar o Mobile

Em outro terminal, a partir da raiz do repositório:

```bash
cd mobile
npm install
npx expo start
```

Escaneie o QR code com o Expo Go no celular ou pressione:
- `a` para Android emulator
- `i` para iOS simulator
- `w` para web

### 5. Testar a API diretamente (opcional)

```bash
# Health check
curl http://localhost:3001/health

# Login
curl -X POST http://localhost:3001/auth/login \
  -H "Content-Type: application/json" \
  -d "$LOGIN_JSON"

# Listar produtos
curl http://localhost:3001/products
```

---

## Contas de demonstração locais

O seed de demonstração fica desabilitado por padrão. Para uma base local nova e
descartável, o responsável pode habilitar `ENABLE_DEMO_SEED=true` apenas com
`NODE_ENV=development` e fornecer `DEMO_ADMIN_EMAIL`, `DEMO_ADMIN_PASSWORD`,
`DEMO_CLIENT_EMAIL` e `DEMO_CLIENT_PASSWORD` ao processo do servidor. Não há
credenciais padrão nem fallback. O template `server/.env.demo.example` contém
somente nomes e campos vazios; ele não é carregado implicitamente.

Se preferir um arquivo privado para a demonstração local, no diretório `server`
copie `.env.demo.example` para `.env`, preencha os quatro campos com valores
próprios e acrescente `NODE_ENV=development` e `ASTROMACHINE_DB_PATH` apontando
para uma base descartável nova. Altere `ENABLE_DEMO_SEED` para `true` somente
quando quiser esse conjunto. O `.env` é ignorado pelo Git. Após `npm run build`,
o carregamento explícito pelo Node 22 é:

```bash
node --env-file=.env dist/index.js
```

Esse comando inicia o servidor; não é o comando usado pela suíte de testes.
Não preencha nem versione `.env.demo.example` com dados de acesso.

Em uma base nova, o padrão deixa ausentes os dados de demonstração do backend:
dois usuários, seis produtos, cinco serviços e dois agendamentos. Esse seed
não cria pedidos. A ausência do catálogo e dos agendamentos de exemplo é um
efeito deliberado do opt-in, que o responsável precisa aceitar. O seed mobile
não foi revisado neste pacote.

Os emails são aparados nas extremidades e precisam ser distintos; o seed rejeita
também variantes que diferem apenas por maiúsculas/minúsculas, por precaução.
Essa restrição não redefine a normalização do login nem altera o email armazenado
além do trim. A gravação do conjunto usa uma transação síncrona única; falhas
abortam o conjunto. A suíte de integração abaixo usa o driver instalado e bancos
SQLite descartáveis, incluindo falhas nas escritas internas dos agendamentos.

Os valores são exclusivos do servidor: não usar prefixos EXPO_PUBLIC nem incluí-los
no aplicativo mobile, repositório, logs ou documentação. Para o exemplo de login,
`LOGIN_JSON` deve ser definido privadamente com uma conta local própria; o exemplo
não contém acesso pronto e não deve ser executado contra serviço de produção.

Desabilitar ou alterar o seed não modifica contas já persistidas. O administrador
deve tratar separadamente contas, sessões e eventual reutilização das credenciais
anteriormente publicadas. Remover exemplos não equivale a revogação.

### Verificação do seed com SQLite descartável

No diretório `server`, após instalar as dependências:

```bash
npm run build
node --test --test-concurrency=1 tests/demo-seed.integration.cjs
```

A suíte não inicia HTTP nem usa contas publicadas. Cada caso roda em processo
separado e cria arquivos SQLite temporários com dados sintéticos. Ela cobre seed
desligado, configuração inválida, sucesso, preservação de usuários existentes e
falhas em 18 INSERTs: duas contas, seis produtos, cinco serviços, dois agendamentos
e três vínculos em `appointment_services`. Os casos de falha verificam rollback
completo e uma nova tentativa bem-sucedida após retirar o gatilho sintético.
Os arquivos temporários ficam disponíveis para inspeção; `ASTRO_TEST_ROOT`
permite definir a pasta de testes. Isso não verifica contas, instalações ou bases
já utilizadas fora desses cenários locais.

## API — Endpoints

| Método | Rota | Descrição | Auth |
|--------|------|-----------|:----:|
| GET | `/health` | Health check | ❌ |
| POST | `/auth/register` | Cadastro de usuário | ❌ |
| POST | `/auth/login` | Login | ❌ |
| GET | `/products` | Listar produtos | ❌ |
| GET | `/products/:id` | Detalhe do produto | ❌ |
| POST | `/products` | Criar produto | ✅ Admin |
| PUT | `/products/:id` | Atualizar produto | ✅ Admin |
| DELETE | `/products/:id` | Excluir produto | ✅ Admin |
| GET | `/services` | Listar serviços | ❌ |
| GET | `/services/:id` | Detalhe do serviço | ❌ |
| POST | `/services` | Criar serviço | ✅ Admin |
| PUT | `/services/:id` | Atualizar serviço | ✅ Admin |
| DELETE | `/services/:id` | Excluir serviço | ✅ Admin |
| GET | `/appointments` | Listar agendamentos | ✅ |
| POST | `/appointments` | Criar agendamento | ✅ |
| POST | `/checkout/simulate` | Simular checkout | ✅ |

---

## Documentação da Fase 2

| Documento | Caminho | Conteúdo |
|-----------|---------|----------|
| DER | `docs/fase2-der.md` | Diagrama Mermaid + explicação das entidades |
| Sprint Review | `docs/fase2-status-report.md` | Entregas, métricas, feedback, backlog |
| Riscos | `docs/fase2-risk-plan.md` | 8 riscos com matriz, mitigação e Plano B |
| Rastreabilidade | `docs/fase2-traceability.md` | Mapeamento requisito → arquivo |

---

## Funcionalidades

### Cliente
- ✅ Login e cadastro com validação
- ✅ Catálogo de builds com tema espacial
- ✅ Detalhes do produto com especificações
- ✅ Carrinho de compras (adicionar, remover, alterar quantidade)
- ✅ Checkout com simulação de pagamento
- ✅ Navegação inferior (Home + Carrinho)
- ✅ Modo offline com dados locais

### Admin
- ✅ Dashboard com listagem de produtos
- ✅ Criar novo produto
- ✅ Editar produto existente
- ✅ Excluir produto com confirmação
- ✅ Estatísticas básicas (total de produtos, em estoque)

### Acessibilidade
- ✅ Contraste adequado (fundo escuro + texto claro)
- ✅ Labels para leitores de tela em todos os elementos interativos
- ✅ Anúncios de ações via AccessibilityInfo
- ✅ Toggle de fonte grande
- ✅ Toggle de alto contraste
- ✅ Tamanho de toque mínimo de 44px
- ✅ Mensagens de erro legíveis e com role="alert"

---

## Documentacao da Fase 3

| Documento / Artefato | Caminho | Conteudo |
|----------------------|---------|----------|
| Relatorio de Status | `docs/fase3-status-report.md` | Sprint Review, impedimentos e percentual de conclusao |
| Schema SQLite | `docs/fase3-database-schema.md` | Tabelas, relacionamentos, seed e estrategia de persistencia |
| Dados JSON | `docs/fase3-dashboard-data.json` | Dados para dashboard de Analise de Dados e Estatistica |
| Banco SQLite | `server/data/astromachine.db` | Persistencia central do backend |

### Scripts uteis da Fase 3

```bash
cd server
npm test
npm run build
npm run export:dashboard
```

```bash
cd mobile
npm run test:unit
npx tsc --noEmit
```

---

## Equipe

- **Guilherme** — Desenvolvimento Mobile e Backend
- **Gustavo** — Modelagem, Documentação e QA

---

*Projeto acadêmico — PI IV — 2026*

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
- [Credenciais de Demonstração](#credenciais-de-demonstração)
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
│           └── database.ts      # Banco em memória + seed
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

- **Node.js** >= 18.x
- **npm** >= 9.x
- **Expo CLI**: `npm install -g expo-cli` (opcional, pode usar `npx expo`)
- **Expo Go** instalado no celular (Android/iOS) para testar

---

## Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/astromachine.git
cd astromachine
```

### 2. Configurar variáveis de ambiente

```bash
copy .env.example .env
```

### 3. Instalar dependências e rodar o Backend

```bash
cd server
npm install
npm run dev
```

O servidor iniciará em `http://localhost:3001`.
Health check: `http://localhost:3001/health`

### 4. Instalar dependências e rodar o Mobile

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
  -d '{"email":"admin@astromachine.com","password":"admin123"}'

# Listar produtos
curl http://localhost:3001/products
```

---

## Credenciais de Demonstração

| Tipo | Email | Senha |
|------|-------|-------|
| Admin | `admin@astromachine.com` | `admin123` |
| Cliente | `guilherme@email.com` | `cliente123` |

> **Nota**: Mesmo sem o servidor rodando, o app funciona com dados locais (fallback).

---

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

## Equipe

- **Guilherme** — Desenvolvimento Mobile e Backend
- **Gustavo** — Modelagem, Documentação e QA

---

*Projeto acadêmico — PI IV — 2026*

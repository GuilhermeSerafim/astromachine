# AstroMachine — Rastreabilidade — Fase 2

**Data**: Abril 2026  
**Projeto**: AstroMachine  

---

## Objetivo

Este documento mapeia cada item obrigatório da Fase 2 aos arquivos e artefatos correspondentes no workspace, garantindo rastreabilidade completa da entrega.

---

## Item 2.1 — Configuração do Ambiente e Interface Inicial

| Requisito | Arquivo(s) | Status |
|-----------|-----------|--------|
| Projeto configurado para VS Code | `.vscode/settings.json`, `.vscode/extensions.json` | ✅ |
| Projeto base React Native/Expo | `mobile/package.json`, `mobile/app.json`, `mobile/tsconfig.json`, `mobile/babel.config.js` | ✅ |
| Projeto base Node.js/Express | `server/package.json`, `server/tsconfig.json` | ✅ |
| Arquitetura limpa e organizada | Estrutura `mobile/src/{screens,navigation,store,services,db,theme,types,utils}` + `server/src/{routes,services,middlewares,models}` | ✅ |
| Tela de Login | `mobile/src/screens/LoginScreen.tsx` | ✅ |
| Tela de Cadastro | `mobile/src/screens/RegisterScreen.tsx` | ✅ |
| Tela de Catálogo/Vitrine | `mobile/src/screens/CatalogScreen.tsx` | ✅ |
| Tela de Detalhes do Produto | `mobile/src/screens/ProductDetailScreen.tsx` | ✅ |
| Tela de Carrinho | `mobile/src/screens/CartScreen.tsx` | ✅ |
| Tela de Checkout | `mobile/src/screens/CheckoutScreen.tsx` | ✅ |
| Dashboard Admin | `mobile/src/screens/AdminDashboard.tsx` | ✅ |
| Formulário Admin | `mobile/src/screens/AdminFormScreen.tsx` | ✅ |
| Tela de Acessibilidade | `mobile/src/screens/AccessibilityScreen.tsx` | ✅ |
| Navegação com tab bar | `mobile/src/navigation/AppNavigator.tsx` | ✅ |
| Tema espacial | `mobile/src/theme/index.ts` | ✅ |
| App compila/inicia | `mobile/App.tsx` (entry point) | ✅ |

---

## Item 2.2 — Modelagem e Estrutura do Banco de Dados

| Requisito | Arquivo(s) | Status |
|-----------|-----------|--------|
| DER das entidades principais | `docs/fase2-der.md` (Mermaid) | ✅ |
| SQLite configurado no mobile | `mobile/src/db/database.ts` | ✅ |
| Schema SQLite completo | `mobile/src/db/database.ts` (9 tabelas) | ✅ |
| API backend Node.js | `server/src/index.ts` | ✅ |
| Rota POST /auth/login | `server/src/routes/auth.ts` | ✅ |
| Rota POST /auth/register | `server/src/routes/auth.ts` | ✅ |
| Rota GET /products | `server/src/routes/products.ts` | ✅ |
| Rota GET /products/:id | `server/src/routes/products.ts` | ✅ |
| Rota POST /products | `server/src/routes/products.ts` | ✅ |
| Rota PUT /products/:id | `server/src/routes/products.ts` | ✅ |
| Rota DELETE /products/:id | `server/src/routes/products.ts` | ✅ |
| Rota GET /services | `server/src/routes/services.ts` | ✅ |
| Rota POST /services | `server/src/routes/services.ts` | ✅ |
| Rota PUT /services/:id | `server/src/routes/services.ts` | ✅ |
| Rota DELETE /services/:id | `server/src/routes/services.ts` | ✅ |
| Rota GET /appointments | `server/src/routes/appointments.ts` | ✅ |
| Rota POST /appointments | `server/src/routes/appointments.ts` | ✅ |
| Rota POST /checkout/simulate | `server/src/routes/checkout.ts` | ✅ |
| Camada de dados organizada | `server/src/services/database.ts`, `server/src/models/types.ts` | ✅ |
| Dados seed | `server/src/services/database.ts`, `mobile/src/db/seedData.ts`, `mobile/src/db/database.ts` | ✅ |
| Middleware de autenticação | `server/src/middlewares/auth.ts` | ✅ |

---

## Item 2.3 — Monitoramento e Sprint Review

| Requisito | Arquivo(s) | Status |
|-----------|-----------|--------|
| Documento de Sprint Review / Status | `docs/fase2-status-report.md` | ✅ |
| Registro do que foi entregue | `docs/fase2-status-report.md` (Seção 2) | ✅ |
| Pendências documentadas | `docs/fase2-status-report.md` (Seção 5) | ✅ |
| Feedback simulado dos stakeholders | `docs/fase2-status-report.md` (Seção 4) | ✅ |
| Ajustes sugeridos no backlog | `docs/fase2-status-report.md` (Seção 6) | ✅ |

---

## Item 2.4 — Análise e Mitigação de Riscos

| Requisito | Arquivo(s) | Status |
|-----------|-----------|--------|
| Identificação de riscos reais | `docs/fase2-risk-plan.md` (8 riscos) | ✅ |
| Classificação impacto/probabilidade | `docs/fase2-risk-plan.md` (Seção 1 — Matriz) | ✅ |
| Plano de mitigação e contingência | `docs/fase2-risk-plan.md` (Seção 2 — Detalhamento) | ✅ |
| Plano B para API/autenticação | `docs/fase2-risk-plan.md` (R1 e R2) + `mobile/src/services/api.ts` | ✅ |
| Mapa de calor | `docs/fase2-risk-plan.md` (Seção 3) | ✅ |

---

## Requisitos Transversais

| Requisito | Arquivo(s) | Status |
|-----------|-----------|--------|
| Acessibilidade — Contraste adequado | `mobile/src/theme/index.ts` (cores escuras com texto claro) | ✅ |
| Acessibilidade — Leitores de tela | Todas as telas (accessibilityLabel, accessibilityRole) | ✅ |
| Acessibilidade — Fontes escaláveis | `mobile/src/store/authStore.ts` (toggleLargeFont), todas as telas | ✅ |
| Acessibilidade — Tamanho de toque | Botões com minHeight 44-56px | ✅ |
| Acessibilidade — Toggle de contraste | `mobile/src/screens/AccessibilityScreen.tsx` | ✅ |
| Fallback API | `mobile/src/services/api.ts` | ✅ |
| Validação de formulários | `mobile/src/utils/validation.ts` (Zod schemas) | ✅ |
| Estado global | `mobile/src/store/authStore.ts`, `mobile/src/store/cartStore.ts` (Zustand) | ✅ |
| Variáveis de ambiente | `.env.example` | ✅ |
| README com instruções | `README.md` | ✅ |
| Textos em português-BR | Todas as telas e documentos | ✅ |

---

## Entidades Obrigatórias

| Entidade | No DER | No SQLite | Na API | No Seed |
|----------|:------:|:---------:|:------:|:-------:|
| Usuários | ✅ | ✅ | ✅ | ✅ (2) |
| Produtos | ✅ | ✅ | ✅ | ✅ (6) |
| Serviços | ✅ | ✅ | ✅ | ✅ (5) |
| Agendamentos | ✅ | ✅ | ✅ | ✅ (2) |

---

*Documento gerado como parte da entrega da Fase 2 do projeto AstroMachine.*

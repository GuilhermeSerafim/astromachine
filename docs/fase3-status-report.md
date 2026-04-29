# AstroMachine - Sprint Review / Relatorio de Status - Fase 3

**Data:** 27/04/2026  
**Sprint:** Fase 3 - Funcionalidade Principal e Gerenciamento de Riscos  
**Equipe:** Guilherme da Silva Serafim e Gustavo Magalhaes Prada de Castro  
**Projeto:** AstroMachine - App mobile para montagem e personalizacao de PCs com tematica espacial

---

## 1. Objetivo da Sprint

Desenvolver a funcionalidade central do aplicativo, consolidando o CRUD, a integracao com API RESTful, a persistencia em banco SQLite e a geracao de dados JSON para apoio a disciplina de Analise de Dados e Estatistica.

Esta fase tambem da continuidade ao planejamento da Fase 2, que definiu a arquitetura com backend Node.js + SQLite como fonte central dos dados e uso de SQLite local no mobile como suporte a cache/offline parcial.

---

## 2. Itens do Roteiro da Fase 3

| Item | Entrega | Status | Evidencia |
|------|---------|--------|-----------|
| 3.1 Implementacao do CRUD | CRUD de produtos no painel admin e na API | Concluido | `server/src/routes/products.ts`, `mobile/src/screens/AdminDashboard.tsx`, `mobile/src/screens/AdminFormScreen.tsx` |
| 3.2 Integracao com API / Sincronizacao | Consumo RESTful pelo app mobile com fallback local | Concluido | `mobile/src/services/api.ts`, `mobile/src/services/apiConfig.ts` |
| 3.3 Gerar dados em formato JSON | Arquivo para dashboard estatistico | Concluido | `docs/fase3-dashboard-data.json` |
| 3.4 Plano de Comunicacao e Relatorio de Status | Sprint Review e status da fase | Concluido | Este documento |

---

## 3. O que foi Implementado

### 3.1 CRUD e Banco de Dados

O backend deixou de depender de arrays em memoria e passou a persistir os dados em SQLite no arquivo `server/data/astromachine.db`. As rotas REST continuam com o mesmo contrato usado pelo app mobile:

- `GET /products`
- `GET /products/:id`
- `POST /products`
- `PUT /products/:id`
- `DELETE /products/:id`

O CRUD administrativo do app mobile continua permitindo inserir, consultar, alterar e excluir produtos do catalogo.

### 3.2 Integracao Mobile com API

O app consome a API via `fetch` e agora calcula automaticamente candidatos de URL para facilitar testes em Expo Go, emulador Android e ambiente local. A estrategia de fallback local permanece como plano de contingencia para demonstracao caso a API esteja indisponivel.

### 3.3 Dados JSON para Dashboard

Foi gerado o arquivo `docs/fase3-dashboard-data.json`, contendo:

- indicadores gerais de produtos, servicos, usuarios, pedidos e receita;
- agrupamento de produtos por categoria;
- faixa de precos e preco medio;
- agrupamento de servicos por categoria;
- registros-base de produtos, servicos, agendamentos e pedidos.

Esse arquivo pode ser usado pela disciplina de Analise de Dados e Estatistica para montagem de dashboards e graficos.

### 3.4 Comunicacao e Status

A Sprint Review da Fase 3 validou a evolucao da arquitetura definida na Fase 2 e confirmou que gateway real de pagamento permanece fora do escopo. O checkout continua como simulacao, conforme o escopo do projeto.

---

## 4. Relatorio de Status

| Metrica | Planejado | Realizado | Status |
|---------|-----------|-----------|--------|
| Itens do roteiro Fase 3 | 4 | 4 | 100% |
| CRUD de produtos | Criar, ler, atualizar e excluir | Implementado no backend e no mobile admin | Concluido |
| API RESTful | Consumo pelo mobile | Implementado com fallback local | Concluido |
| Persistencia | SQLite central no backend | `server/data/astromachine.db` | Concluido |
| JSON para dashboard | 1 arquivo JSON | `docs/fase3-dashboard-data.json` | Concluido |
| Documentacao de status | 1 relatorio | Este documento | Concluido |

**Percentual de conclusao do backlog da Fase 3:** 100% dos itens obrigatorios do roteiro.

---

## 5. Impedimentos e Riscos

| Risco / Impedimento | Impacto | Acao de Mitigacao |
|---------------------|---------|-------------------|
| API indisponivel durante demonstracao | Alto | Manter fallback local no mobile com dados seed |
| Dados em memoria nao persistirem apos reinicio | Alto | Migracao para SQLite persistente no backend |
| Dificuldade de conexao entre Expo Go e localhost | Medio | Criacao de candidatos de URL por host do Expo, emulador Android e localhost |
| Excesso de escopo com pagamento real | Medio | Manter gateway de pagamento fora do escopo e usar checkout simulado |
| Necessidade de dados para dashboard | Medio | Geracao de JSON consolidado da base do AstroMachine |

---

## 6. Sprint Review

**Participantes:** Guilherme Serafim, Gustavo Magalhaes e orientador da disciplina.  
**Objetivo:** Demonstrar a evolucao do CRUD, a integracao app/API, o banco SQLite persistente e o JSON de dados para dashboard.

### Entregas demonstraveis

- Login e cadastro com API.
- Catalogo de builds espaciais.
- Painel administrativo com CRUD de produtos.
- Carrinho e checkout simulado.
- Banco SQLite persistente no backend.
- Arquivo JSON para Analise de Dados e Estatistica.

### Feedback aplicado da Fase 2

- CRUD concluido e persistente.
- Fluxo do cliente mantido com catalogo, carrinho e checkout.
- API com fallback para reduzir risco de demonstracao.
- Gateway de pagamento real mantido fora do escopo, conforme definido no documento da Fase 2.

---

## 7. Proximos Passos

- Gravar video demonstrando fluxo completo: login, catalogo, carrinho, checkout e CRUD admin.
- Revisar acessibilidade em todas as telas antes da entrega final.
- Compactar PDF, projeto e video em arquivo unico para envio no Blackboard.

---

*Documento gerado como parte da entrega da Fase 3 do projeto AstroMachine.*

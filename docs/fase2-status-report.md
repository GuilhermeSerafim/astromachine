# AstroMachine — Sprint Review / Relatório de Status — Fase 2

**Data**: Abril 2026  
**Sprint**: Fase 2 — Configuração, Modelagem, Monitoramento e Riscos  
**Equipe**: Guilherme, Gustavo  
**Projeto**: AstroMachine — App de montagem e personalização de PCs com temática espacial

---

## 1. Objetivo da Sprint

Entregar a infraestrutura completa do projeto, incluindo:
- Ambiente de desenvolvimento configurado
- Telas iniciais do app mobile funcional
- Modelagem e estrutura do banco de dados
- API backend operacional
- Documentação de status, riscos e rastreabilidade

---

## 2. O que foi Entregue

### 2.1 Configuração do Ambiente e Interface Inicial ✅

| Item | Status |
|------|--------|
| Projeto Expo (React Native + TypeScript) | ✅ Concluído |
| Projeto Node.js/Express/TypeScript (backend) | ✅ Concluído |
| VS Code settings e extensions | ✅ Concluído |
| Estrutura monorepo (mobile/server/docs) | ✅ Concluído |
| Tela de Login | ✅ Concluída |
| Tela de Cadastro | ✅ Concluída |
| Tela de Catálogo/Vitrine | ✅ Concluída |
| Tela de Detalhes do Produto | ✅ Concluída |
| Tela de Carrinho | ✅ Concluída |
| Tela de Checkout (simulação) | ✅ Concluída |
| Dashboard Admin (CRUD) | ✅ Concluído |
| Formulário Admin (criar/editar) | ✅ Concluído |
| Tela de Acessibilidade | ✅ Concluída |
| Navegação com tab bar | ✅ Concluída |
| Tema espacial escuro | ✅ Concluído |

### 2.2 Modelagem e Estrutura do Banco de Dados ✅

| Item | Status |
|------|--------|
| DER em Mermaid | ✅ Concluído |
| Schema SQLite completo | ✅ Concluído |
| Seed data com tema espacial | ✅ Concluído |
| API REST com rotas de auth, products, services, appointments, checkout | ✅ Concluído |
| Camada de dados organizada | ✅ Concluído |

### 2.3 Monitoramento e Sprint Review ✅

| Item | Status |
|------|--------|
| Documento de Sprint Review | ✅ Este documento |
| Registro de entregas | ✅ Concluído |
| Feedback simulado | ✅ Seção abaixo |

### 2.4 Análise e Mitigação de Riscos ✅

| Item | Status |
|------|--------|
| Identificação de riscos | ✅ Concluído |
| Classificação impacto/probabilidade | ✅ Concluído |
| Plano de mitigação e contingência | ✅ Concluído |
| Plano B para API/autenticação | ✅ Implementado no código |

---

## 3. Métricas da Sprint

| Métrica | Valor |
|---------|-------|
| Telas implementadas | 9 (Login, Cadastro, Catálogo, Detalhe, Carrinho, Checkout, Admin Dashboard, Admin Form, Acessibilidade) |
| Rotas API implementadas | 13 endpoints |
| Entidades modeladas | 9 tabelas |
| Dados seed gerados | 6 produtos, 5 serviços, 2 usuários, 2 agendamentos |
| Documentos da Fase 2 | 4 (DER, Status Report, Risk Plan, Rastreabilidade) |

---

## 4. Feedback Simulado dos Stakeholders

### Product Owner
> "As telas seguem bem o wireframe proposto. O tema espacial está presente e o fluxo de compra está coerente. Sugiro incluir mais indicadores visuais de carregamento e refinar as animações para a próxima fase."

### Stakeholder Acadêmico (Professor)
> "A modelagem está adequada com as 4 entidades obrigatórias (Usuários, Produtos, Serviços, Agendamentos). O DER em Mermaid facilita a apresentação. A estratégia de fallback demonstra maturidade na abordagem de riscos."

### QA Simulado
> "Testar: fluxo de login com credenciais inválidas, adicionar/remover itens do carrinho, CRUD completo no admin, comportamento offline. Recomendo testes automatizados na Fase 3."

---

## 5. Pendências e Itens para o Backlog

| Item | Prioridade | Fase Sugerida |
|------|-----------|---------------|
| Testes automatizados (Jest + Testing Library) | Alta | Fase 3 |
| Animações e micro-interações | Média | Fase 3 |
| Upload de imagens reais para produtos | Média | Fase 3 |
| Relatórios administrativos | Baixa | Fase 4+ |
| Integração com gateway de pagamento real | Fora de escopo | N/A |
| Push notifications | Baixa | Fase 4+ |
| Filtros e busca no catálogo | Média | Fase 3 |
| Histórico de pedidos do cliente | Média | Fase 3 |

---

## 6. Ajustes Sugeridos no Backlog

1. **Priorizar testes**: Adicionar cobertura de testes unitários e de integração na Fase 3
2. **Melhorar UX**: Implementar skeleton loading, toast notifications e transições animadas
3. **Persistência real**: Migrar o backend de in-memory para SQLite/PostgreSQL real
4. **Autenticação robusta**: Considerar refresh tokens e expiração adequada do JWT
5. **CI/CD**: Configurar pipeline básico de build e lint

---

## 7. Retrospectiva

### O que funcionou bem
- Estrutura monorepo clara e organizada
- Escolha de stack consistente (Expo + Express + TypeScript)
- Fallback local garante demo funcional sem dependência de servidor

### O que pode melhorar
- Incluir testes desde o início nas próximas fases
- Documentar APIs com Swagger/OpenAPI
- Melhorar tratamento de erros no frontend

---

*Documento gerado como parte da entrega da Fase 2 do projeto AstroMachine.*

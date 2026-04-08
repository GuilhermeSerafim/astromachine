# AstroMachine — Análise e Mitigação de Riscos — Fase 2

**Data**: Abril 2026  
**Projeto**: AstroMachine  
**Fase**: 2 — Configuração, Modelagem, Monitoramento e Riscos

---

## 1. Matriz de Riscos

| # | Risco | Probabilidade | Impacto | Nível | Categoria |
|---|-------|:---:|:---:|:---:|---------|
| R1 | API backend indisponível durante demonstração | Alta | Alto | 🔴 Crítico | Técnico |
| R2 | Falha na autenticação JWT (token expirado/inválido) | Média | Alto | 🟠 Alto | Técnico |
| R3 | Incompatibilidade de dependências (React Native/Expo) | Média | Médio | 🟡 Médio | Técnico |
| R4 | Perda de dados do banco em memória (reinício do servidor) | Alta | Médio | 🟠 Alto | Técnico |
| R5 | Dificuldade de configuração do ambiente em máquinas diferentes | Média | Médio | 🟡 Médio | Ambiente |
| R6 | Atraso na entrega de funcionalidades por complexidade subestimada | Média | Alto | 🟠 Alto | Gestão |
| R7 | Problemas de acessibilidade não detectados | Baixa | Médio | 🟢 Baixo | UX |
| R8 | Vazamento de credenciais hardcoded | Baixa | Alto | 🟡 Médio | Segurança |

---

## 2. Detalhamento e Planos de Mitigação

### R1 — API Backend Indisponível 🔴

**Descrição**: O servidor Node.js pode não estar acessível durante a apresentação (rede, configuração, ou erro no código).

**Mitigação**:
- ✅ **Implementado**: Fallback automático para dados locais em todas as chamadas de API
- ✅ **Implementado**: Dados seed embarcados no app mobile (`src/db/seedData.ts`)
- ✅ **Implementado**: Indicador visual de "modo offline" no catálogo
- O app funciona 100% sem servidor, usando dados mockados localmente

**Contingência (Plano B)**:
- Se a API estiver fora, o app continua funcional com dados locais
- Login aceita credenciais pré-definidas sem validação no servidor
- CRUD admin opera sobre o array local em memória
- Checkout simula o pedido localmente

**Status**: ✅ Plano B totalmente implementado no código

---

### R2 — Falha na Autenticação JWT 🟠

**Descrição**: Token pode expirar durante uso ou ser rejeitado pelo servidor.

**Mitigação**:
- Token configurado com 24h de validade (suficiente para demonstração)
- Middleware de auth retorna erro claro ao frontend
- Frontend captura erro 401 e pode redirecionar para login

**Contingência**:
- ✅ Fallback de login local aceita credenciais demo sem JWT
- ✅ AsyncStorage persiste sessão para evitar re-login frequente

---

### R3 — Incompatibilidade de Dependências 🟡

**Descrição**: Versões de React Native, Expo SDK ou pacotes podem conflitar.

**Mitigação**:
- Versões fixadas no `package.json` (sem ranges amplos)
- Uso de Expo managed workflow para minimizar problemas nativos
- `tsconfig.json` configurado com opções seguras

**Contingência**:
- Documentar versão exata de Node.js necessária no README
- Manter backup do `node_modules` compilado/funcional

---

### R4 — Perda de Dados do Banco em Memória 🟠

**Descrição**: O servidor usa armazenamento em memória — dados se perdem ao reiniciar.

**Mitigação**:
- Dados seed são recarregados automaticamente ao iniciar o servidor
- SQLite no mobile persiste dados localmente entre sessões

**Contingência**:
- Para Fase 3+, migrar para banco persistente (SQLite no servidor ou PostgreSQL)
- Adicionar script de seed dedicado (`npm run seed`)

---

### R5 — Dificuldade de Configuração do Ambiente 🟡

**Descrição**: Outro membro da equipe ou avaliador pode ter dificuldade para rodar o projeto.

**Mitigação**:
- README com instruções passo a passo
- `.env.example` com variáveis documentadas
- VS Code settings e extensões recomendadas
- Scripts npm padronizados

**Contingência**:
- Gravar vídeo de demonstração como backup
- Disponibilizar APK de demonstração se possível

---

### R6 — Atraso por Complexidade Subestimada 🟠

**Descrição**: Funcionalidades podem levar mais tempo que o planejado.

**Mitigação**:
- Escopo da Fase 2 bem definido com critérios de aceite claros
- Priorização de funcionalidades core sobre polimento visual
- Uso de bibliotecas maduras (React Hook Form, Zustand, Zod) para acelerar desenvolvimento

**Contingência**:
- Reduzir escopo visual em favor de funcionalidade
- Documentar features parciais como "em progresso" no status report

---

### R7 — Problemas de Acessibilidade 🟢

**Descrição**: O app pode não atender requisitos mínimos de acessibilidade.

**Mitigação**:
- ✅ AccessibilityLabel em todos os elementos interativos
- ✅ AccessibilityRole definido (button, link, header, etc.)
- ✅ Contraste adequado (texto claro sobre fundo escuro)
- ✅ Tamanho de toque mínimo de 44px
- ✅ Tela dedicada de acessibilidade com toggle de fonte grande e alto contraste
- ✅ Anúncios para leitores de tela via AccessibilityInfo.announceForAccessibility

**Contingência**:
- Testar com VoiceOver (iOS) ou TalkBack (Android) antes da apresentação

---

### R8 — Vazamento de Credenciais 🟡

**Descrição**: JWT secret ou credenciais demo hardcoded podem ser expostas.

**Mitigação**:
- JWT secret configurável via variável de ambiente
- `.env.example` não contém secrets reais
- Credenciais demo são apenas para fins acadêmicos

**Contingência**:
- Para produção, usar variáveis de ambiente reais e rotacionar secrets
- Implementar HTTPS em ambiente não-local

---

## 3. Mapa de Calor dos Riscos

```
          ┌─────────────────────────────────────────┐
          │           IMPACTO                        │
          │     Baixo    Médio     Alto              │
  P  Alta │            R4        R1                  │
  R       │                                         │
  O  Média│            R3,R5     R2,R6              │
  B       │                                         │
  .  Baixa│            R7        R8                  │
          └─────────────────────────────────────────┘
```

---

## 4. Resumo Executivo

- **Risco mais crítico**: R1 (API indisponível) — **já mitigado** com fallback implementado
- **Riscos controlados**: Todos os riscos identificados possuem plano de mitigação e contingência
- **Plano B**: O app funciona de forma autônoma sem o servidor backend, garantindo que a demonstração não será comprometida

---

*Documento gerado como parte da entrega da Fase 2 do projeto AstroMachine.*

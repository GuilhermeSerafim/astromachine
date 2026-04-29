# AstroMachine - Schema do Banco de Dados - Fase 3

Este documento complementa a modelagem apresentada na Fase 2 e descreve a implementacao persistente adotada na Fase 3.

## Arquitetura de Dados

O AstroMachine utiliza dois niveis de persistencia:

| Camada | Tecnologia | Responsabilidade |
|--------|------------|------------------|
| Backend | Node.js + Express + SQLite | Fonte central dos dados de usuarios, produtos, servicos, agendamentos e pedidos |
| Mobile | React Native + Expo + fallback local | Consumo da API e continuidade da demonstracao em caso de indisponibilidade do backend |

O arquivo principal do banco fica em:

```text
server/data/astromachine.db
```

## Tabelas

### users

| Campo | Tipo | Regra |
|-------|------|-------|
| id | TEXT | Chave primaria |
| name | TEXT | Obrigatorio |
| email | TEXT | Unico e obrigatorio |
| password | TEXT | Hash da senha |
| role | TEXT | `admin` ou `client` |
| createdAt | TEXT | Data ISO |

### products

| Campo | Tipo | Regra |
|-------|------|-------|
| id | TEXT | Chave primaria |
| name | TEXT | Obrigatorio |
| description | TEXT | Obrigatorio |
| price | REAL | Obrigatorio |
| imageUrl | TEXT | Opcional |
| category | TEXT | Categoria do produto |
| specs | TEXT | Especificacoes tecnicas |
| inStock | INTEGER | 1 para disponivel, 0 para indisponivel |
| createdAt | TEXT | Data ISO |

### services

| Campo | Tipo | Regra |
|-------|------|-------|
| id | TEXT | Chave primaria |
| name | TEXT | Obrigatorio |
| description | TEXT | Obrigatorio |
| price | REAL | Obrigatorio |
| estimatedHours | INTEGER | Estimativa de execucao |
| category | TEXT | Categoria do servico |
| createdAt | TEXT | Data ISO |

### appointments

| Campo | Tipo | Regra |
|-------|------|-------|
| id | TEXT | Chave primaria |
| userId | TEXT | FK para `users.id` |
| productId | TEXT | FK opcional para `products.id` |
| date | TEXT | Data do agendamento |
| status | TEXT | `pending`, `confirmed`, `completed` ou `cancelled` |
| notes | TEXT | Observacoes |
| createdAt | TEXT | Data ISO |

### appointment_services

| Campo | Tipo | Regra |
|-------|------|-------|
| appointmentId | TEXT | FK para `appointments.id` |
| serviceId | TEXT | FK para `services.id` |

Chave primaria composta: `appointmentId + serviceId`.

### orders

| Campo | Tipo | Regra |
|-------|------|-------|
| id | TEXT | Chave primaria |
| userId | TEXT | FK para `users.id` |
| totalAmount | REAL | Valor total |
| status | TEXT | `pending`, `confirmed` ou `delivered` |
| paymentMethod | TEXT | Metodo usado na simulacao |
| createdAt | TEXT | Data ISO |

### order_items

| Campo | Tipo | Regra |
|-------|------|-------|
| id | TEXT | Chave primaria |
| orderId | TEXT | FK para `orders.id` |
| productId | TEXT | FK para `products.id` |
| productName | TEXT | Snapshot do nome no momento do pedido |
| quantity | INTEGER | Quantidade |
| unitPrice | REAL | Snapshot do preco unitario |

## Relacionamentos

- Um usuario pode ter varios agendamentos.
- Um usuario pode ter varios pedidos.
- Um pedido possui varios itens.
- Um item de pedido referencia um produto.
- Um agendamento pode envolver um produto e varios servicos.

## Seed de Demonstracao

Ao iniciar pela primeira vez, o backend cria:

- 1 usuario administrador: `admin@astromachine.com` / `admin123`;
- 1 usuario cliente: `guilherme@email.com` / `cliente123`;
- 6 produtos com tematica espacial;
- 5 servicos de personalizacao;
- 2 agendamentos de exemplo.

## JSON para Dashboard

O comando abaixo gera o arquivo utilizado pela disciplina de Analise de Dados e Estatistica:

```powershell
cd server
npm run export:dashboard
```

Saida:

```text
docs/fase3-dashboard-data.json
```

O JSON contem indicadores agregados e registros-base para construcao de graficos de produtos, servicos, pedidos e agendamentos.

## Escopo de Pagamento

Conforme definido na Fase 2, integracao com gateway de pagamento real esta fora do escopo. Portanto, o pedido e registrado a partir de uma simulacao de checkout, suficiente para validar o fluxo mobile e gerar dados para a entrega.

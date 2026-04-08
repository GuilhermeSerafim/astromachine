# AstroMachine — Diagrama Entidade-Relacionamento (DER) — Fase 2

## Diagrama Mermaid

```mermaid
erDiagram
    USERS {
        TEXT id PK "UUID"
        TEXT name "NOT NULL"
        TEXT email "UNIQUE NOT NULL"
        TEXT password_hash "NOT NULL"
        TEXT role "admin | client"
        TEXT created_at "datetime"
    }

    PRODUCTS {
        TEXT id PK "UUID"
        TEXT name "NOT NULL"
        TEXT description ""
        REAL price "NOT NULL"
        TEXT image_url ""
        TEXT category ""
        TEXT specs ""
        INTEGER in_stock "0 ou 1"
        TEXT created_at "datetime"
    }

    SERVICES {
        TEXT id PK "UUID"
        TEXT name "NOT NULL"
        TEXT description ""
        REAL price "NOT NULL"
        INTEGER estimated_hours ""
        TEXT category ""
        TEXT created_at "datetime"
    }

    APPOINTMENTS {
        TEXT id PK "UUID"
        TEXT user_id FK "REFERENCES users"
        TEXT product_id FK "REFERENCES products"
        TEXT date "NOT NULL"
        TEXT status "pending|confirmed|completed|cancelled"
        TEXT notes ""
        TEXT created_at "datetime"
    }

    APPOINTMENT_SERVICES {
        TEXT appointment_id FK "PK composta"
        TEXT service_id FK "PK composta"
    }

    CART_ITEMS {
        TEXT id PK "UUID"
        TEXT user_id FK "REFERENCES users"
        TEXT product_id FK "REFERENCES products"
        INTEGER quantity "DEFAULT 1"
        TEXT created_at "datetime"
    }

    ORDERS {
        TEXT id PK "UUID"
        TEXT user_id FK "REFERENCES users"
        REAL total_amount "NOT NULL"
        TEXT status "pending|confirmed|delivered"
        TEXT payment_method ""
        TEXT created_at "datetime"
    }

    ORDER_ITEMS {
        TEXT id PK "UUID"
        TEXT order_id FK "REFERENCES orders"
        TEXT product_id FK "REFERENCES products"
        TEXT product_name "NOT NULL"
        INTEGER quantity "NOT NULL"
        REAL unit_price "NOT NULL"
    }

    FAVORITES {
        TEXT user_id FK "PK composta"
        TEXT product_id FK "PK composta"
        TEXT created_at "datetime"
    }

    USERS ||--o{ APPOINTMENTS : "agenda"
    USERS ||--o{ CART_ITEMS : "adiciona ao carrinho"
    USERS ||--o{ ORDERS : "realiza pedido"
    USERS ||--o{ FAVORITES : "favorita"

    PRODUCTS ||--o{ CART_ITEMS : "presente em"
    PRODUCTS ||--o{ ORDER_ITEMS : "incluído em"
    PRODUCTS ||--o{ APPOINTMENTS : "associado a"
    PRODUCTS ||--o{ FAVORITES : "favoritado"

    SERVICES ||--o{ APPOINTMENT_SERVICES : "vinculado a"

    APPOINTMENTS ||--o{ APPOINTMENT_SERVICES : "inclui serviços"

    ORDERS ||--o{ ORDER_ITEMS : "contém"
```

## Explicação das Relações

| Relação | Descrição |
|---------|-----------|
| `USERS → APPOINTMENTS` | Um usuário (cliente) pode ter vários agendamentos de montagem/customização |
| `USERS → CART_ITEMS` | Um usuário pode ter vários itens no carrinho |
| `USERS → ORDERS` | Um usuário pode realizar vários pedidos |
| `USERS → FAVORITES` | Um usuário pode favoritar vários produtos |
| `PRODUCTS → CART_ITEMS` | Um produto pode estar no carrinho de vários usuários |
| `PRODUCTS → ORDER_ITEMS` | Um produto pode aparecer em vários pedidos |
| `PRODUCTS → APPOINTMENTS` | Um agendamento pode estar associado a um produto (build) específico |
| `SERVICES → APPOINTMENT_SERVICES` | Relação N:N — um agendamento pode incluir vários serviços |
| `ORDERS → ORDER_ITEMS` | Um pedido contém vários itens |

## Entidades Obrigatórias da Fase 2

1. **Usuários (USERS)**: Cadastro de administradores e clientes
2. **Produtos (PRODUCTS)**: Builds e PCs personalizados com temática espacial
3. **Serviços (SERVICES)**: Customizações como pintura, iluminação RGB, gravação
4. **Agendamentos (APPOINTMENTS)**: Solicitações de montagem/customização de PCs

## Tabelas Auxiliares

- **CART_ITEMS**: Itens adicionados ao carrinho antes da compra
- **ORDERS / ORDER_ITEMS**: Pedidos finalizados via checkout
- **APPOINTMENT_SERVICES**: Tabela associativa N:N entre agendamentos e serviços
- **FAVORITES**: Produtos favoritos do usuário

## Schema SQLite

O schema completo está implementado em:
- `mobile/src/db/database.ts` — inicialização do banco com CREATE TABLE e seed data
- O banco é criado automaticamente na primeira execução do app

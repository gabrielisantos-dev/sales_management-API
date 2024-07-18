# Sistema de Gestão de Clientes, Produtos e Vendas

## Descrição do Projeto

Este projeto é um sistema de gestão desenvolvido utilizando o framework Adonis.js. O sistema permite o cadastro e gerenciamento de clientes, produtos, e vendas, proporcionando uma interface simplificada para o controle e acompanhamento das operações comerciais.

## Tecnologias Utilizadas

- **Node.js**: Ambiente de execução JavaScript.
- **Adonis.js**: Framework MVC para Node.js.
- **MySQL**: Sistema de gerenciamento de banco de dados relacional.
- **Joi**: Biblioteca para validação de dados.
- **JWT**: Para autenticação.
- **Insomnia**: Ferramenta para teste de APIs.

## Instruções de Instalação e Execução

### Pré-requisitos

- Node.js (v14 ou superior)
- Adonis CLI

### Passos de Instalação

1. Clone o repositório:
    ```sh
    git clone git@github.com:gabrielisantos-dev/Sales_Management_Api.git
    cd Sales_Management_Api
    ```

2. Instale as dependências:
    ```sh
    npm install
    ```

3. Crie e configure o arquivo `.env`:
    ```sh
    HOST=127.0.0.1
    PORT=3306
    DB_CONNECTION=mysql
    DB_USER=seu-usuario-do-banco
    DB_PASSWORD=sua-senha-do-banco
    DB_DATABASE=nome-do-banco
    HASH_DRIVER=bcrypt
    ```

4. Execute as migrations para configurar o banco de dados:
    ```sh
    adonis migration:run
    ```

5. Inicie o servidor:
    ```sh
    adonis serve --dev
    ```

## Endpoints da API

### Autenticação

#### `POST /signup`

- **Descrição**: Cria um novo usuário.
- **Corpo da Requisição**:
    ```json
    {
      "email": "exemplo@dominio.com",
      "password": "Senha123!"
    }
    ```
- **Resposta**:
    ```json
    {
      "user": {
        "email": "exemplo@dominio.com",
        "password": "$2a$10$fTGqfMT/7Xe.4CmplnfId.ZN2QzkRasrFETXLzWAE8Qj/zSSiQyjO",
        "created_at": "2024-07-17 18:47:14",
        "updated_at": "2024-07-17 18:47:14",
        "id": 3
      },
      "token": {
        "type": "bearer",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMsImlhdCI6MTcyMTI1MjgzNH0._Pmi0HnpBj9hYJKY3pHxwD5ZGQKQ4DDRySPbnqxRyks",
        "refreshToken": null
      }
    }
    ```

#### `POST /login`

- **Descrição**: Autentica um usuário e retorna um token JWT.
- **Corpo da Requisição**:
    ```json
    {
      "email": "exemplo@dominio.com",
      "password": "Senha123!"
    }
    ```
- **Resposta**:
    ```json
    {
      "token": {
        "type": "bearer",
        "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjMsImlhdCI6MTcyMTI1MzA0OH0.yVCrey2iJF0Q0f-HUZRNvWodlakzQ6VB6WOGp40h5YA",
        "refreshToken": null
      }
    }
    ```

### Clientes

#### `GET /clients`

- **Descrição**: Retorna a lista de clientes.
- **Resposta**:
    ```json
    [
      {
        "id": 4,
        "name": "Cliente Exemplo",
        "cpf": "123.456.789-10"
      }
    ]
    ```

#### `GET /clients/:id`

- **Descrição**: Retorna os detalhes de um cliente.
- **Resposta**:
    ```json
    {
      "client": {
        "id": 4,
        "name": "Cliente Exemplo",
        "cpf": "123.456.789-10",
        "created_at": "2024-07-17 14:51:17",
        "updated_at": "2024-07-17 14:51:17",
        "addresses": [
          {
            "id": 4,
            "client_id": 4,
            "street": "Rua Exemplo",
            "number": "123",
            "city": "Cidade Exemplo",
            "state": "UF",
            "zip_code": "12345-678",
            "created_at": "2024-07-17 14:51:17",
            "updated_at": "2024-07-17 14:51:17"
          }
        ],
        "phones": [
          {
            "id": 4,
            "client_id": 4,
            "number": "(12) 34567-8901",
            "area_code": "12",
            "created_at": "2024-07-17 14:51:17",
            "updated_at": "2024-07-17 14:51:17"
          }
        ]
      },
      "sales": [
        {
          "id": 5,
          "client_id": 4,
          "product_id": 5,
          "quantity": 2,
          "unit_price": 49.99,
          "total_price": 99.98,
          "sale_date": "2024-07-17T17:54:09.000Z",
          "created_at": "2024-07-17 14:54:09",
          "updated_at": "2024-07-17 14:54:09"
        }
      ]
    }
    ```

#### `POST /clients`

- **Descrição**: Cria um novo cliente.
- **Corpo da Requisição**:
    ```json
    {
      "name": "João Silva",
      "cpf": "123.456.789-00",
      "address": {
        "street": "Rua Exemplo",
        "number": "123",
        "city": "Cidade Exemplo",
        "state": "EX",
        "zip_code": "12345-678"
      },
      "phone": {
        "number": "987654321",
        "area_code": "11"
      }
    }
    ```
- **Resposta**:
    ```json
    {
      "name": "João Silva",
      "cpf": "123.456.789-00",
      "created_at": "2024-07-17 19:02:53",
      "updated_at": "2024-07-17 19:02:53",
      "id": 5
    }
    ```

#### `PUT /clients/:id`

- **Descrição**: Atualiza os dados de um cliente existente.
- **Corpo da Requisição**:
    ```json
    {
      "name": "João Silva",
      "cpf": "123.456.789-00",
      "address": {
        "street": "Rua Exemplo",
        "number": "123",
        "city": "Cidade Exemplo",
        "state": "EX",
        "zip_code": "12345-678"
      },
      "phone": {
        "number": "987654321",
        "area_code": "11"
      }
    }
    ```
- **Resposta**:
    ```json
    {
      "client": {
        "id": 5,
        "name": "João Silva",
        "cpf": "123.456.789-00",
        "created_at": "2024-07-17 19:02:53",
        "updated_at": "2024-07-17 20:13:37",
        "addresses": [
          {
            "id": 5,
            "client_id": 5,
            "street": "Rua Exemplo",
            "number": "123",
            "city": "Cidade Exemplo",
            "state": "EX",
            "zip_code": "12345-678",
            "created_at": "2024-07-17 19:02:53",
            "updated_at": "2024-07-17 20:13:37"
          }
        ],
        "phones": [
          {
            "id": 5,
            "client_id": 5,
            "number": "987654321",
            "area_code": "11",
            "created_at": "2024-07-17 19:02:53",
            "updated_at": "2024-07-17 20:13:37"
          }
        ]
      }
    }
    ```

#### `DELETE /clients/:id`

- **Descrição**: Remove um cliente.
- **Resposta**:
    ```json
    {
      "message": "Cliente excluído com sucesso."
    }
    ```

### Produtos

#### `GET /products`

- **Descrição**: Retorna a lista de produtos.
- **Resposta**:
    ```json
    [
      {
        "id": 1,
        "name": "Produto Exemplo",
        "price": 100.00
      }
    ]
    ```

#### `GET /products/:id`

- **Descrição**: Retorna os detalhes de um produto.
- **Resposta**:
    ```json
    {
      "product": {
        "id": 1,
        "name": "Produto Exemplo",
        "sku": "88cfe071-ef17-4ffb-ac2e-239c6a0a9568",
        "description": "Descrição do produto",
        "price": 100.00,
        "quantity_in_stock": 50,
        "category": null,
	      "image_file": null,
	      "is_deleted": 0,
        "created_at": "2024-07-17 18:00:00",
        "updated_at": "2024-07-17 18:00:00"
      }
    }
    ```

#### `POST /products`

- **Descrição**: Cria um novo produto.
- **Corpo da Requisição**:
    ```json
    {
      "name": "Novo Produto",
      "description": "Descrição do novo produto",
      "price": 49.99
    }
    ```
- **Resposta**:
    ```json
    {
      "product": {
        "name": "Novo Produto",
        "sku": "bed4d09a-409f-48e7-98e7-0e84c4c378f7",
        "description": "Descrição do novo produto",
        "price": 49.99,
        "quantity_in_stock": 0,
        "created_at": "2024-07-17 19:10:00",
        "updated_at": "2024-07-17 19:10:00"
        "id": 2,
      }
    }
    ```

#### `PUT /products/:id`

- **Descrição**: Atualiza os dados de um produto existente.
- **Corpo da Requisição**:
    ```json
    {
      "name": "Produto Atualizado",
      "description": "Descrição atualizada do produto",
      "price": 59.99
    }
    ```
- **Resposta**:
    ```json
    {
      "product": {
        "id": 2,
        "name": "Produto Atualizado",
        "sku": "bed4d09a-409f-48e7-98e7-0e84c4c378f7",
        "description": "Descrição atualizada do produto",
        "price": 59.99,
        "quantity_in_stock": 0,
	      "category": null,
	      "image_file": null,
	      "is_deleted": 0,
        "created_at": "2024-07-17 19:10:00",
        "updated_at": "2024-07-17 19:15:00"
      }
    }
    ```

#### `DELETE /products/:id`

- **Descrição**: Marca um produto como excluído ("soft delete").
- **Resposta**:
    ```json
    {
      "message": "Produto marcado como excluído."
    }
    ```

### Vendas

#### `POST /sales`

- **Descrição**: Registra uma venda.
- **Corpo da Requisição**:
    ```json
    {
      "client_id": 1,
      "product_id": 1,
      "quantity": 2,
    }
    ```
- **Resposta**:
    ```json
    {
      "sale": {
        "client_id": 1,
        "product_id": 1,
        "quantity": 2,
        "unit_price": 49.99,
        "total_price": 99.98,
        "sale_date": "2024-07-17T19:20:00.000Z",
        "created_at": "2024-07-17 19:20:00",
        "updated_at": "2024-07-17 19:20:00"
        "id": 1,
      }
    }
    ```


## Estrutura do Repositório

Inicialmente, a branch principal estava configurada como `development`. Após revisão, criei a branch `main` e a defini como principal para seguir as práticas recomendadas de versionamento.

**Nota:** A branch `development` foi removida após consolidar todas as alterações na `main`.


Fico à disposição para feedbacks e sugestões, visando sempre a melhoria contínua.

# 💰 FinanceControl

> **FinanceControl** é uma aplicação Full Stack moderna de controle financeiro pessoal, inspirada na simplicidade e praticidade de uma planilha do Excel, combinada com a elegância de dashboards como Notion, Linear, Stripe e Vercel.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Frontend Vercel](https://img.shields.io/badge/Frontend-Vercel%20%7C%20Live-brightgreen)
![Backend Render](https://img.shields.io/badge/Backend-Render%20%7C%20Spring%20Boot%203-blue)
![Database Neon](https://img.shields.io/badge/Database-Neon.tech%20%7C%20PostgreSQL-darkblue)

---

## 🌐 Links de Produção

- 🔗 **Aplicação Web (Frontend)**: [finance-control-eight-pi.vercel.app](https://finance-control-eight-pi.vercel.app/login)
- ⚙️ **API RESTful (Backend)**: [finance-control-backend-jhdf.onrender.com](https://finance-control-backend-jhdf.onrender.com)
- 📜 **Documentação Swagger UI**: [finance-control-backend-jhdf.onrender.com/swagger-ui.html](https://finance-control-backend-jhdf.onrender.com/swagger-ui.html)

---


## 📌 Visão Geral

O **FinanceControl** foi concebido como um MVP elegante, escalável e extremamente intuitivo. Em vez de navegar por dezenas de telas complexas, todo o fluxo financeiro está concentrado em uma **planilha online moderna e responsiva**, acompanhada de cartões de resumo em tempo real e gráficos analíticos.

### 💡 Funcionalidade de Destaque: "Saldo Projetado"
Diferente dos sistemas tradicionais que mostram apenas o saldo atual, o FinanceControl calcula automaticamente o **Saldo Projetado até o final do mês**:
$$\text{Saldo Projetado} = \text{Saldo Atual} + \text{Receitas Pendentes do Mês} - \text{Despesas Pendentes do Mês}$$
Essa funcionalidade permite prever se o caixa fechará no positivo, auxiliando na tomada de decisões financeiras realistas.

---

## ⚡ Principais Funcionalidades

- 🔐 **Autenticação & Segurança**: Login e cadastro com Spring Security e tokens JWT.
- 📊 **Dashboard Integrado**:
  - **Saldo Atual** (Receitas confirmadas - Despesas confirmadas)
  - **Entradas do Mês** (Receitas pagas no período)
  - **Saídas do Mês** (Despesas pagas no período)
  - **Saldo Projetado** (Previsão realista até o fim do mês)
- 📋 **Tabela Estilo Planilha (TanStack Table)**:
  - Lançamentos com Data, Descrição, Categoria, Tipo (Receita/Despesa), Valor, Status (Confirmado/Pendente) e Observação.
  - Ordenação dinâmica por colunas.
  - Paginação rápida e pesquisa global em tempo real.
  - Filtros avançados por período, tipo, status e categoria.
- 🏷️ **Categorias Personalizadas**: Suporte a categorias ilimitadas para receitas e despesas com cores e ícones customizáveis.
- 📈 **Relatórios Visuais (Recharts)**:
  - **Gráfico Pizza**: Distribuição percentual das despesas por categoria.
  - **Gráfico de Barras**: Comparativo Entradas x Saídas dos últimos 6 meses.
  - **Gráfico de Área**: Evolução patrimonial e fluxo de caixa acumulado.
- 📥 **Exportação**: Exportação de lançamentos diretamente para **CSV/Excel** com formatação UTF-8 BOM.
- 🌙 **Dark Mode & Light Mode**: Interface moderna baseada em tokens CSS HSL com alternância suave.

---

## 🛠️ Tecnologias Utilizadas

### Backend
- **Java 17**
- **Spring Boot 3.3**
- **Spring Security + JWT**
- **Spring Data JPA / Hibernate**
- **PostgreSQL**
- **Flyway Database Migrations**
- **Lombok**

### Frontend
- **React 18**
- **TypeScript**
- **Vite**
- **Tailwind CSS**
- **TanStack Table v8**
- **React Hook Form + Zod**
- **Recharts**
- **Axios**
- **Lucide Icons**

---

## 📁 Estrutura do Projeto

```
finance-control/
├── backend/
│   ├── src/main/java/com/finance/control/
│   │   ├── config/           # Security, JWT Filter e CORS
│   │   ├── controller/       # AuthController, TransactionController, DashboardController, CategoryController
│   │   ├── dto/              # AuthResponse, TransactionRequest, DashboardResponse, etc.
│   │   ├── model/            # Entities: User, Category, Transaction (Enum Status/Type)
│   │   ├── repository/       # TransactionRepository (queries customizadas), UserRepository, CategoryRepository
│   │   ├── security/         # JwtService e UserDetailsServiceImpl
│   │   └── service/          # TransactionService, DashboardService, CategoryService, AuthService
│   └── src/main/resources/
│       ├── db/migration/     # Migrações SQL (V1__init_schema.sql)
│       └── application.properties
│
└── frontend/
    ├── src/
    │   ├── components/       # Componentes UI (DataTable, TransactionForm, CategoryManager, ui/*)
    │   ├── context/          # AuthContext e ThemeContext
    │   ├── hooks/            # useTransactions, useDashboard, useCategories
    │   ├── layouts/          # Layout principal com Sidebar e Header
    │   ├── pages/            # Dashboard (Workspace Principal), Login e Register
    │   ├── services/         # Cliente Axios com interceptors JWT
    │   ├── types/            # Definições TypeScript
    │   └── utils/            # Formatadores de moeda, data e mesclador Tailwind
    ├── package.json
    ├── tailwind.config.js
    └── vite.config.ts
```

---

## ⚡ Documentação Interativa da API (Swagger / OpenAPI 3)

Com o backend em execução, acesse a documentação interativa e faça testes de endpoints protegidos (via JWT Bearer Token) diretamente pelo navegador:

📌 **Swagger UI**: [http://localhost:8081/swagger-ui.html](http://localhost:8081/swagger-ui.html)  
📌 **OpenAPI JSON Spec**: `http://localhost:8081/v3/api-docs`

---

## 🚀 Como Executar o Projeto

### 🐳 Opção 1: Execução Rápida em 1-Clique via Docker Compose (Recomendado)

Requer apenas o **Docker** e **Docker Compose** instalados:

```bash
# Na raiz do projeto finance-control
docker compose up -d --build
```

Isso inicializará automaticamente:
- 🐘 **PostgreSQL 15** em `localhost:5432`
- ☕ **Backend Spring Boot 3** em `http://localhost:8081`
- ⚛️ **Frontend React + Nginx** em `http://localhost` (ou `http://localhost:5173`)

Para parar a aplicação:
```bash
docker compose down
```

---

### 🛠️ Opção 2: Execução Manual para Desenvolvimento

#### Pré-requisitos
- **Java 17+** e **Maven**
- **Node.js 18+** e **npm**

#### 1. Executar o Backend
```bash
cd backend
./mvnw spring-boot:run
```
O backend iniciará na porta `8081` usando banco de dados H2 local em `./data/finance_db`.

#### 2. Executar o Frontend
```bash
cd frontend
npm install
npm run dev
```
Acesse a aplicação em: `http://localhost:5173`

---

## 🗺️ Roadmap Futuro (Versões Posteriores)

- [ ] Controle avançado de Cartões de Crédito (faturas e limite disponível)
- [ ] Gestão de Financiamentos e Empréstimos
- [ ] Definição de Metas Financeiras de Economia
- [ ] Calendário de vencimentos interativo
- [ ] Notificações por e-mail para contas a vencer
- [ ] Exportação de relatórios resumidos em PDF

---

## 📄 Licença

Este projeto está sob a licença [MIT](./LICENSE).

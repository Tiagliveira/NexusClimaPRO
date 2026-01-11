# 🌍 Nexus Clima PRO

> **Plataforma de monitoramento climático em tempo real com arquitetura distribuída de alta performance.**

![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![RabbitMQ](https://img.shields.io/badge/RabbitMQ-FF6600?style=for-the-badge&logo=rabbitmq&logoColor=white)
![Go](https://img.shields.io/badge/Go-00ADD8?style=for-the-badge&logo=go&logoColor=white)
![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
<br>
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Shadcn/UI](https://img.shields.io/badge/shadcn%2Fui-000000?style=for-the-badge&logo=shadcnui&logoColor=white)
![Lucide Icons](https://img.shields.io/badge/Lucide-F78248?style=for-the-badge&logo=lucide&logoColor=white)

O **Nexus Clima** nasceu como um desafio técnico de backend, mas evoluiu para um **SaaS (Software as a Service)** completo. O objetivo foi transformar uma arquitetura complexa de microsserviços em uma experiência fluida para o usuário final, integrando **Desktop e Mobile** em tempo real.

O projeto demonstra a maturidade de sair da teoria para a prática, unindo a velocidade do Go, a robustez do NestJS e a interatividade do React/PWA.

---

## A Experiência Nexus

A interface foi desenhada com foco total em UX/UI, utilizando **Glassmorphism** e transições fluídas.

<div align="center">
  <img src="https://raw.githubusercontent.com/Tiagliveira/nexusClimaPRO/main/frontend/public/ReadmeNexusClimaPRO.PNG" alt="Nexus Clima" width="100%" />
</div>

---

## Arquitetura de Microsserviços

O sistema opera em um fluxo de dados desacoplado, garantindo resiliência e escalabilidade:


```mermaid
flowchart LR
  %% Definição de Cores (Classes)
  classDef python fill:#3776AB,stroke:#fff,stroke-width:2px,color:#fff;
  classDef rabbit fill:#FF6600,stroke:#fff,stroke-width:2px,color:#fff;
  classDef go fill:#00ADD8,stroke:#fff,stroke-width:2px,color:#fff;
  classDef nest fill:#E0234E,stroke:#fff,stroke-width:2px,color:#fff;
  classDef mongo fill:#47A248,stroke:#fff,stroke-width:2px,color:#fff;
  classDef react fill:#20232A,stroke:#61DAFB,stroke-width:2px,color:#61DAFB;

  subgraph Coleta ["📡 Coleta e Processamento"]
    direction LR
    A[Coletor Python]:::python -->|JSON| B(RabbitMQ):::rabbit
    B -->|Consumo| C[Go Worker]:::go
  end

  subgraph Core ["Backend e Dados"]
    direction LR
    C -->|HTTP POST| D[API NestJS]:::nest
    D -->|Persistência| E[(MongoDB)]:::mongo
  end

  subgraph UX ["User Experience"]
    F[React Frontend]:::react -->|HTTP GET| D
  end
```
---

| Serviço | Responsabilidade | Stack Tecnológica |
| :--- | :--- | :--- |
| ** Worker Python** | Coleta dados meteorológicos da Open-Meteo a cada 30 min. | `Python 3.12`, `Requests` |
| ** Message Broker** | Gerencia filas e garante a entrega das mensagens. | `RabbitMQ` (AMQP) |
| ** Processor Go** | Consome a fila com alta concorrência e envia ao backend. | `Go` (Golang) 1.23 |
| ** Core API** | Regras de negócio, Insights de IA e Gestão de Dados. | `NestJS`, `TypeScript` |
| ** Database** | Armazenamento escalável de histórico e usuários. | `MongoDB` |
| ** Frontend** | Dashboard reativo, Temas Dinâmicos e Avatar 3D. | `React`, `Shadcn/UI`,`Tailwind` |

---

## Funcionalidades "PRO"

O Nexus vai além do básico, oferecendo recursos premium:

* **🤖 Avatar Climático Inteligente:** Um personagem 3D que reage ao clima e horário (usa óculos de sol, casaco ou pijama), criando conexão emocional com o usuário.
* **🎨 Temas Dinâmicos:** O sistema detecta o contexto (Tempestade, Calor, Noite) e adapta toda a paleta de cores da interface automaticamente.
* **🌍 Pesquisa Global Híbrida:** Consulte o clima de qualquer lugar do mundo sem poluir o banco de dados local (estratégia de Cache vs Persistência).
* **🧠 Insights com Personalidade:** Esqueça a previsão do tempo chata. O sistema analisa os dados e gera frases inteligentes (e as vezes engraçadas) para tornar o monitoramento mais leve, unindo dicas úteis com uma pitada de humor.
* **⚡ Pontualidade & Performance:** Relógio "Vivo" que se sincroniza matematicamente com o fuso horário (Timezone) de qualquer cidade pesquisada, garantindo que o usuário saiba exatamente a hora local do outro lado do mundo.
* **📱 Integração Mobile (Scan & Go):** Recurso de Handoff que permite transferir a sessão do PC para o celular instantaneamente via QR Code, com interface 100% otimizada para toque.

## Como Rodar (Docker)

O projeto é **100% Dockerizado**. Para rodar, você só precisa ter o Docker instalado.

### 1. Clone o Repositório
```bash
git clone [https://github.com/Tiagliveira/nexus-clima.git](https://github.com/Tiagliveira/nexus-clima.git)
cd nexus-clima

docker-compose up --build -d
```
---

### Autor
Tiago Oliveira
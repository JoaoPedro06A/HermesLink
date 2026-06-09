# Hermeslink: Sistema de Controle de Missão para Marte

[Hermeslink Logo](https://via.placeholder.com/800x400/0A0E14/00E5FF?text=HERMESLINK+-+MARS+MISSION+CONTROL)
_Uma interface futurista para gerenciar e operar missões espaciais em Marte._

## 🚀 Visão Geral do Projeto

O Hermeslink é um sistema de interface de usuário (UI) projetado para simular o controle de uma missão espacial em Marte. Ele oferece duas interfaces principais: uma para o **Comando da Terra (Houston)** e outra para a **Tripulação em Marte**. O objetivo é criar uma experiência imersiva e funcional, onde dados vitais, tarefas e comunicações são gerenciados de forma dinâmica.

## ✨ Funcionalidades Atuais

### 1. Tela de Seleção de Tripulante (`crew-selection.tsx`)
-   Permite escolher entre 4 astronautas pré-definidos (Anderson, Martins, Oliveira, Souza).
-   Exibe informações básicas e vitais de cada tripulante (BPM, O2, Status) antes da seleção.
-   Design otimizado para mobile.

### 2. Interface da Tripulação (Marte - `crew.tsx`)
-   **Boas-vindas Personalizadas**: Exibe o nome e ID do astronauta selecionado.
-   **Monitoramento de Recursos da Base**:
    -   Oxigênio e Energia com porcentagens dinâmicas e barras de progresso.
    -   Valores editáveis pelo usuário para simulação.
-   **Sinais Vitais do Tripulante**:
    -   Frequência Cardíaca (BPM) e Situação (Status) dinâmicos.
    -   Valores editáveis para simulação de condições.
-   **Tarefas do Dia**:
    -   Checklist interativo para marcar/desmarcar tarefas.
    -   Funcionalidade para adicionar novas tarefas operacionais.
-   **Comunicação DSN (Deep Space Network)**:
    -   Chat em tempo real com o Comando da Terra.
    -   Histórico de mensagens e campo para envio.
-   **Design Aprimorado**: Layout com cards bem definidos e espaçamento otimizado para melhor legibilidade e estética futurista.

### 3. Interface do Comando da Terra (Houston - `earthcomand.tsx`)
-   **Monitoramento da Tripulação**:
    -   Exibe o status vital (BPM, O2, Status) dos 4 astronautas em tempo real.
-   **Monitoramento de Recursos da Base**:
    -   Visão geral dos níveis de Oxigênio e Energia da base em Marte.
-   **Gestão de Missão**:
    -   Tabela dinâmica de tarefas com prioridade e status.
    -   Modal para adicionar novas instruções de missão com descrição, prioridade e status.
-   **Log de Decisões**: Área para registrar eventos importantes da missão.
-   **Comunicação DSN**:
    -   Chat em tempo real com a Tripulação em Marte.
    -   Histórico de mensagens e campo para envio.

### 4. Comunicação em Tempo Real (Backend com Socket.io)
-   Implementação inicial de um servidor Node.js com Socket.io para permitir a troca de mensagens entre as interfaces da Terra e da Tripulação.
-   Mensagens enviadas de uma tela são retransmitidas para a outra instantaneamente.

## 🛠️ Tecnologias Utilizadas

-   **Frontend**: React Native (com Expo)
-   **Backend**: Node.js, Express, Socket.io
-   **Linguagem**: TypeScript
-   **Estilização**: StyleSheet (React Native)

## ⚙️ Como Configurar e Rodar o Projeto

Siga os passos abaixo para ter o Hermeslink funcionando em sua máquina:

### Pré-requisitos
-   Node.js (versão 18 ou superior recomendada)
-   npm ou Yarn
-   Expo CLI (`npm install -g expo-cli`)

### 1. Clonar o Repositório

```bash
git clone <https://github.com/JoaoPedro06A/HermesLink.git>
cd HermesLink/hermeslink01/Hermeslink01
```

### 2. Configurar e Rodar o Backend

O backend deve ser executado em um terminal separado.

```bash
cd backend
npm install # ou yarn install
node server.js
```

Você deverá ver a mensagem: `SERVIDOR HERMESLINK OPERANTE NA PORTA 3001`.

### 3. Configurar e Rodar o Frontend

Em um **novo terminal**, navegue até a pasta raiz do frontend:

```bash
cd .. # Volta para a pasta Hermeslink01
npm install # ou yarn install
npx expo start
```

O Expo CLI abrirá uma nova aba no seu navegador. Você pode:
-   Escanear o QR code com o aplicativo Expo Go no seu celular.
-   Pressionar `w` para abrir no navegador web.
-   Pressionar `a` para abrir no emulador Android ou `i` para o iOS.

**Importante**: Se estiver testando em um celular físico, substitua `http://localhost:3001` pelo endereço IP da sua máquina (ex: `http://192.168.1.5:3001`) nos arquivos `app/crew.tsx` e `app/earthcomand.tsx`.

## 💡 Próximos Passos (Backend)

As próximas etapas para o backend incluem:
-   **Persistência de Dados**: Salvar mensagens, tarefas e status em um banco de dados (ex: Supabase, PostgreSQL) para que não se percam ao reiniciar o servidor.
-   **Simulação de Latência**: Adicionar um atraso programável na entrega de mensagens para simular a latência real da comunicação Terra-Marte.
-   **Eventos Aleatórios**: Implementar um sistema para gerar eventos e "crises" na missão, testando a capacidade de resposta da tripulação e do controle.
-   **Sincronização de Telemetria**: Fazer com que os dados de O2, Energia e BPM sejam gerenciados e distribuídos pelo backend.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.


# 🃏 DeckMind (PROJETO EM ANDAMENTO)

Uma aplicação mobile feita em React Native e Expo que integra a Inteligência Artificial do Google Gemini para escanear cartas de Magic: The Gathering e analisar decks completos, fornecendo insights estratégicos instantâneos.

![Demonstração do App]

## 📌 Visão Geral

O objetivo deste projeto é otimizar a experiência de jogadores de Magic: The Gathering (tanto iniciantes quanto veteranos). O aplicativo resolve duas dores principais: a necessidade de entender rapidamente mecânicas complexas de cartas físicas e a busca por evolução estratégica na construção de decks.

## 🚀 Funcionalidades Principais

*   **📷 Scanner de Cartas via IA:** O usuário tira uma foto de qualquer carta física de Magic. O Gemini analisa a imagem, reconhece o card e retorna detalhadamente suas regras, efeitos, interações e texto traduzido.
*   **🧠 Construção Inteligente de Deck:** Permite criar uma lista de decks de forma híbrida e flexível:
    *   Digitando manualmente o nome da carta.
    *   Tirando uma foto para que a IA identifique a carta e a adicione automaticamente à lista.
*   **📊 Análise de Deck Avançada:** O usuário envia a lista acumulada de cartas do seu deck para o Gemini. A IA processa a composição estrutural do deck e gera um relatório contendo:
    *   **Pontos Fortes:** Principais sinergias e condições de vitória.
    *   **Pontos Fracos:** Vulnerabilidades na curva de mana ou contra arquétipos específicos do meta.
    *   **Sugestões de Melhorias:** Substituições de cartas para aumentar a consistência do deck.

## 🛠️ Tecnologias Utilizadas

*   **Mobile:** [React Native](https://reactnative.dev) + [Expo](https://expo.dev)
*   **Linguagem:** TypeScript / JavaScript
*   **Inteligência Artificial:** [Google Gemini API](https://google.dev) (Utilizando modelos de texto e visão computacional multimodal)
*   **Manipulação de Imagem:** [Expo Camera](https://expo.dev)
*   **Conversão de Imagem para base64:** [Expo FileSystem](https://docs.expo.dev/versions/latest/sdk/filesystem/)

## 📋 Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina:
*   [Node.js](https://nodejs.org) (versão LTS recomendada)
*   [Expo Go](https://expo.devgo) instalado no seu celular (para testar em dispositivo físico) ou um emulador configurado.
*   Uma chave de API do Google AI Studio ([Obtenha sua chave aqui](https://google.com)).

## 🔧 Instalação e Execução

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/Mcfl-ly/Consultor-magic
   ```

2. **Entre na pasta do projeto:**
   ```bash
   cd seu-repositorio
   ```

3. **Instale as dependências:**
   ```bash
   npm install
   # ou
   yarn install
   ```

4. **Configuração das Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto seguindo o modelo do `.env.example` e adicione a sua chave do Gemini:
   ```env
   GEMINI_API_KEY=sua_chave_do_google_ai_studio_aqui
   ```

5. **Inicie o servidor de desenvolvimento do Expo:**
   ```bash
   npx expo start
   ```

Agora, basta escanear o QR Code gerado no terminal usando o aplicativo **Expo Go** no seu celular ou pressionar `a` (Android) ou `i` (iOS) para rodar no emulador.

## 📝 Licença

Este projeto está sob a licença [MIT](./LICENSE).

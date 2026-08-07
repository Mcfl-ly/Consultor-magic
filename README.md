![React Native](https://img.shields.io/badge/React%20Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75FF?style=for-the-badge&logo=googlegemini&logoColor=white)
![OCR](https://img.shields.io/badge/OCR-4285F4?style=for-the-badge&logo=googlelens&logoColor=white)
# 🃏 DeckMind

DeckMind é um aplicativo mobile desenvolvido para jogadores de **Magic: The Gathering**, especialmente para quem está começando no jogo.

O aplicativo utiliza **Inteligência Artificial** para simplificar o entendimento das cartas e permite que o usuário mantenha seus decks organizados diretamente no celular.

---
<p align="center">
  <a href="https://github.com/SEU-USUARIO/DeckMind/releases/latest">
    <img src="https://img.shields.io/badge/⬇️_Download_APK-success?style=for-the-badge">
  </a>

  <a href="https://www.linkedin.com/in/SEU-LINKEDIN">
    <img src="https://img.shields.io/badge/LinkedIn-Perfil-0A66C2?style=for-the-badge&logo=linkedin">
  </a>
</p>

## 📱 Funcionalidades

### 🤖 Resumo inteligente de cartas

Entender o texto de uma carta de Magic pode ser desafiador para novos jogadores. Pensando nisso, o DeckMind permite pesquisar qualquer carta e receber um resumo simples e objetivo gerado por IA.

O usuário pode realizar a pesquisa de duas formas:

* 📷 Tirando uma foto da carta
* ⌨️ Digitando o nome da carta

Quando uma imagem é utilizada, o aplicativo emprega **OCR (Reconhecimento Óptico de Caracteres)** para identificar o nome da carta. Em seguida, esse nome é enviado para a **Gemini AI**, juntamente com um prompt cuidadosamente elaborado para retornar uma explicação breve e fácil de entender.

### 🎥 Demonstração

> **![Demonstração do DeckMind](assets/pesquisa.gif)**

---

### 📚 Gerenciamento de Decks

O DeckMind também permite que o usuário mantenha seus decks organizados no próprio dispositivo.

Com essa funcionalidade é possível:

* Criar novos decks
* Definir um nome para cada deck
* Adicionar cartas utilizando a câmera
* Definir a quantidade de cada carta
* Remover cartas do deck
* Visualizar todas as cartas cadastradas

Assim, o jogador pode consultar a composição completa de seus decks a qualquer momento.

### 🎥 Demonstração

> **![Demonstração do DeckMind](assets/salva.gif)**

---

## 🚀 Tecnologias Utilizadas

* React Native
* Expo
* TypeScript
* SQLite
* Gemini AI
* OCR (Reconhecimento Óptico de Caracteres)

---

## 🛠️ Como Executar o Projeto

### Pré-requisitos

* Node.js
* npm ou yarn
* Expo CLI
* Android Studio ou dispositivo físico

### Clone o repositório

```bash
git clone https://github.com/SEU-USUARIO/DeckMind.git

cd DeckMind
```

### Instale as dependências

```bash
npm install
```

ou

```bash
yarn
```

### Configure as variáveis de ambiente

Crie um arquivo chamado `.env` na raiz do projeto:

```env
EXPO_PUBLIC_GEMINI_API_KEY=SUA_CHAVE_DA_API
```

Substitua `SUA_CHAVE_DA_API` pela chave obtida no Google AI Studio.

### Execute o projeto

```bash
npx expo start
```

---

## 📦 Instalação do Aplicativo

Caso você queira apenas utilizar o aplicativo, basta baixar o APK disponível abaixo:

> **🔗 (Adicionar link para download do APK aqui)**

---

## 🧠 Como Funciona

### Pesquisa de Cartas

1. O usuário tira uma foto da carta ou digita seu nome.
2. Caso seja utilizada uma imagem, o OCR identifica o nome da carta.
3. O nome é enviado para a Gemini AI.
4. A IA retorna um resumo simples explicando a função da carta.

### Gerenciamento de Decks

1. O usuário cria um novo deck.
2. Define um nome.
3. Adiciona cartas utilizando a câmera.
4. Informa a quantidade de cada carta.
5. O aplicativo salva todas as informações localmente utilizando SQLite.
6. O deck pode ser consultado posteriormente sempre que necessário.

---

## 💾 Armazenamento

Todas as informações dos decks são armazenadas localmente utilizando **SQLite**, permitindo que o usuário acesse sua coleção mesmo sem conexão com a internet.

A única funcionalidade que necessita de acesso à internet é a consulta de cartas utilizando a **Gemini AI**.

---

## 🔮 Próximas Funcionalidades

O projeto ainda está em desenvolvimento. Algumas melhorias planejadas incluem:

* Análise completa do deck utilizando Inteligência Artificial.
* Sugestões para melhorar a construção do deck.
* Interface mais moderna e intuitiva.
* Melhorias na experiência do usuário.
* Otimizações de desempenho.

---

## 🤝 Contribuições

Sugestões, melhorias e contribuições são sempre bem-vindas.

Caso encontre algum problema ou tenha alguma ideia para o projeto, fique à vontade para abrir uma **Issue** ou enviar um **Pull Request**.

---

## 📄 Licença

Este projeto está licenciado sob a licença MIT.

---

## 👨‍💻 Autor

**Paulo Gabriel Lima Santos**

Desenvolvedor de Software Júnior apaixonado por desenvolvimento mobile, backend e Inteligência Artificial.

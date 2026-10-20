
"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const hero = $("hero");
  const gameSection = $("game-section");
  const startButton = $("start-game");
  const ctaButton = $("cta-start");
  const restartButton = $("restart-game");

  const energyText = $("energy-text");
  const energyBar = $("energy-bar");
  const xpText = $("xp-text");
  const xpBar = $("xp-bar");
  const inventoryList = $("inventory-list");

  const chapterLabel = $("chapter-label");
  const progressLabel = $("progress-label");
  const progressFill = $("story-progress-fill");
  const storyArt = $("story-art");
  const storyIllustration = $("story-illustration");
  const storyKicker = $("story-kicker");
  const storyTitle = $("story-title");
  const storyDescription = $("story-description");
  const choicesHeading = $("choices-heading");
  const choicesList = $("choices-list");
  const storyMessage = $("story-message");

  const challengeBox = $("challenge-box");
  const challengeQuestion = $("challenge-question");
  const challengeAnswers = $("challenge-answers");
  const challengeFeedback = $("challenge-feedback");

  let state;
  let toastTimeout;

  const initialState = () => ({
    energy: 100,
    xp: 0,
    inventory: [],
    visited: [],
    completedChallenges: [],
    currentNode: "portal",
    ended: false
  });

  // Cada escolha aponta para outro ponto da história.
  // As consequências são aplicadas pelo sistema de escolhas.
  const story = {
    portal: {
      chapter: 1,
      kicker: "SINAL RECEBIDO",
      title: "O portal desconhecido",
      icon: "⌘",
      description:
        "Você desperta diante de um portal digital. Símbolos luminosos flutuam no ar e uma mensagem aparece na tela:\n\n\"O Núcleo dos Algoritmos perdeu sua energia. Somente alguém capaz de pensar logicamente poderá restaurá-lo.\"\n\nDois caminhos se abrem diante de você.",
      choices: [
        {
          title: "Explorar a floresta de dados",
          detail: "Investigar pistas antes de avançar.",
          target: "forest",
          xp: 10,
          item: "Mapa de dados"
        },
        {
          title: "Seguir a trilha de circuitos",
          detail: "Confiar na tecnologia e avançar rapidamente.",
          target: "circuits",
          energy: -10,
          xp: 5
        }
      ]
    },

    forest: {
      chapter: 1,
      kicker: "ÁREA DE EXPLORAÇÃO",
      title: "A floresta de dados",
      icon: "♧",
      description:
        "Árvores cristalinas armazenam informações em suas folhas. No centro da floresta, você encontra um terminal com uma sequência incompleta: 2, 4, 6, 8...\n\nUma pequena criatura digital pede sua ajuda para descobrir o próximo número.",
      choices: [
        {
          title: "Analisar o padrão",
          detail: "Observar como a sequência evolui.",
          target: "logic",
          xp: 10
        },
        {
          title: "Pedir uma pista ao guardião",
          detail: "Ganhar orientação antes de resolver.",
          target: "guardian",
          energy: -5,
          item: "Pista do guardião"
        }
      ]
    },

    circuits: {
      chapter: 1,
      kicker: "ZONA TECNOLÓGICA",
      title: "A trilha de circuitos",
      icon: "⌁",
      description:
        "Linhas de energia atravessam uma ponte suspensa. Um painel mostra três comandos: observar, calcular e agir. O sistema avisa que executar uma ação sem analisar os dados pode consumir energia desnecessária.",
      choices: [
        {
          title: "Examinar o painel",
          detail: "Usar as informações antes de agir.",
          target: "logic",
          xp: 10,
          item: "Chip de análise"
        },
        {
          title: "Avançar sem verificar",
          detail: "Testar o caminho diretamente.",
          target: "guardian",
          energy: -15
        }
      ]
    },

    guardian: {
      chapter: 1,
      kicker: "ENCONTRO ESPECIAL",
      title: "O guardião dos comandos",
      icon: "◇",
      description:
        "Um guardião holográfico surge diante de você. Ele explica que um bom algoritmo precisa de instruções claras, organizadas e executadas na ordem correta.\n\nAntes de liberar a passagem, ele oferece um desafio de lógica.",
      challenge: {
        id: "sequence",
        question: "Qual número completa a sequência: 2, 4, 6, 8, ...?",
        answers: ["9", "10", "12", "16"],
        correct: 1,
        success:
          "Resposta correta! A sequência aumenta de 2 em 2. Você ganhou experiência.",
        failure:
          "A resposta correta é 10: cada número aumenta em 2. Errar também faz parte do aprendizado."
      },
      afterChoices: [
        {
          title: "Continuar para o laboratório",
          detail: "Investigar a origem do problema.",
          target: "laboratory",
          xp: 10,
          energy: 5,
          item: "Chave holográfica"
        }
      ]
    },

    logic: {
      chapter: 2,
      kicker: "DESAFIO DE LÓGICA",
      title: "O terminal inteligente",
      icon: "{ }",
      description:
        "Você encontra um terminal que só aceita comandos lógicos. A tela mostra uma pergunta: se uma porta abre apenas quando a chave está presente, o que precisa ser verificado antes de entrar?\n\nPense nas condições antes de escolher.",
      challenge: {
        id: "condition",
        question: "Qual ideia representa melhor uma condição em um algoritmo?",
        answers: [
          "Repetir uma frase sem parar.",
          "Tomar uma decisão com base em uma verificação.",
          "Mudar a cor da tela sem motivo.",
          "Apagar todos os dados automaticamente."
        ],
        correct: 1,
        success:
          "Correto! Uma condição permite executar ações diferentes dependendo de uma verificação.",
        failure:
          "Uma condição verifica algo e determina qual caminho seguir, como em uma estrutura if/else."
      },
      afterChoices: [
        {
          title: "Entrar no laboratório",
          detail: "Levar suas descobertas para a próxima etapa.",
          target: "laboratory",
          xp: 15,
          item: "Fragmento lógico"
        }
      ]
    },

    laboratory: {
      chapter: 2,
      kicker: "LABORATÓRIO CENTRAL",
      title: "O algoritmo perdido",
      icon: "⌘",
      description:
        "Dentro do laboratório, você encontra o código que controla o Núcleo. Algumas instruções estão fora de ordem. Um painel explica que algoritmos são sequências de passos organizados para resolver um problema.\n\nVocê precisa decidir como restaurar o sistema.",
      choices: [
        {
          title: "Organizar os passos antes de executar",
          detail: "Planejar a solução e verificar cada etapa.",
          target: "vault",
          xp: 15,
          energy: 5,
          item: "Código organizado"
        },
        {
          title: "Executar tudo de uma vez",
          detail: "Tentar resolver rapidamente sem revisar.",
          target: "glitch",
          energy: -20,
          xp: 5
        }
      ]
    },

    glitch: {
      chapter: 2,
      kicker: "ALERTA DO SISTEMA",
      title: "Uma falha inesperada",
      icon: "⚠",
      description:
        "O terminal pisca e alguns comandos são executados fora da ordem esperada. Você percebe que não basta escrever instruções: é preciso organizar os passos e verificar as condições.\n\nVocê ainda pode recuperar o sistema.",
      choices: [
        {
          title: "Depurar o código",
          detail: "Encontrar e corrigir a sequência incorreta.",
          target: "vault",
          xp: 15,
          energy: -5,
          item: "Registro de depuração"
        },
        {
          title: "Usar a pista do inventário",
          detail: "Revisar as informações coletadas.",
          target: "vault",
          xp: 10,
          item: "Plano de recuperação"
        }
      ]
    },

    vault: {
      chapter: 3,
      kicker: "CÂMARA DO NÚCLEO",
      title: "A última sequência",
      icon: "✦",
      description:
        "Você chega à câmara central. O Núcleo está diante de você, mas precisa receber uma sequência correta de instruções.\n\nUma última verificação separa você da conclusão da missão.",
      challenge: {
        id: "algorithm",
        question: "Qual é a melhor ordem para resolver um problema com um algoritmo?",
        answers: [
          "Executar ações aleatórias e esperar.",
          "Definir o problema, planejar passos e executar.",
          "Pular as etapas e verificar apenas no final.",
          "Escrever instruções sem uma ordem definida."
        ],
        correct: 1,
        success:
          "Excelente! Planejamento e execução organizada são partes essenciais de um algoritmo.",
        failure:
          "A melhor opção é definir o problema, planejar os passos e depois executar a solução."
      },
      afterChoices: [
        {
          title: "Ativar o Núcleo dos Algoritmos",
          detail: "Finalizar a missão e descobrir seu resultado.",
          target: "ending",
          xp: 25,
          item: "Núcleo restaurado"
        }
      ]
    }
  };

  function startGame() {
    state = initialState();
    hero.hidden = true;
    gameSection.hidden = false;
    updateStats();
    renderNode("portal");
    gameSection.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function updateStats() {
    energyText.textContent = `${state.energy} / 100`;
    energyBar.style.width = `${state.energy}%`;

    xpText.textContent = `${state.xp} XP`;
    xpBar.style.width = `${Math.min(100, state.xp / 100 * 100)}%`;

    inventoryList.replaceChildren();

    if (state.inventory.length === 0) {
      const empty = document.createElement("p");
      empty.className = "inventory-empty";
      empty.textContent = "Seus itens aparecerão aqui.";
      inventoryList.appendChild(empty);
    } else {
      state.inventory.forEach((item) => {
        const chip = document.createElement("span");
        chip.className = "inventory-item";
        chip.textContent = `◇ ${item}`;
        inventoryList.appendChild(chip);
      });
    }
  }

  function addItem(item) {
    if (item && !state.inventory.includes(item)) {
      state.inventory.push(item);
    }
  }

  function applyEffects(choice) {
    if (Number.isFinite(choice.energy)) {
      state.energy = Math.max(0, Math.min(100, state.energy + choice.energy));
    }

    if (Number.isFinite(choice.xp)) {
      state.xp += choice.xp;
    }

    addItem(choice.item);
    updateStats();
  }

  function renderNode(nodeId) {
    const node = story[nodeId];
    if (!node) return;

    state.currentNode = nodeId;
    state.ended = false;

    if (!state.visited.includes(nodeId)) {
      state.visited.push(nodeId);
    }

    chapterLabel.textContent = `CAPÍTULO ${String(node.chapter).padStart(2, "0")}`;
    storyKicker.textContent = node.kicker;
    storyTitle.textContent = node.title;
    storyDescription.textContent = node.description;
    storyIllustration.textContent = node.icon;

    const percentage = Math.min(95, Math.round(state.visited.length / 9 * 100));
    progressLabel.textContent = `PROGRESSO ${percentage}%`;
    progressFill.style.width = `${percentage}%`;

    storyArt.dataset.chapter = String(node.chapter);
    storyMessage.textContent = "";

    challengeBox.hidden = true;
    challengeAnswers.replaceChildren();
    challengeFeedback.textContent = "";
    challengeFeedback.className = "challenge-feedback";

    if (node.challenge && !state.completedChallenges.includes(node.challenge.id)) {
      renderChallenge(node);
    } else {
      renderChoices(node.choices || []);
    }

    updateStats();
  }

  function renderChoices(choices) {
    challengeBox.hidden = true;
    choicesHeading.textContent = "O QUE VOCÊ VAI FAZER?";
    choicesList.replaceChildren();

    choices.forEach((choice, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "choice-button";

      const number = document.createElement("span");
      number.className = "choice-number";
      number.textContent = String(index + 1).padStart(2, "0");

      const copy = document.createElement("span");
      copy.className = "choice-copy";

      const title = document.createElement("strong");
      title.textContent = choice.title;

      const detail = document.createElement("small");
      detail.textContent = choice.detail;

      copy.append(title, detail);

      const arrow = document.createElement("span");
      arrow.className = "choice-arrow";
      arrow.textContent = "→";
      arrow.setAttribute("aria-hidden", "true");

      button.append(number, copy, arrow);
      button.addEventListener("click", () => choosePath(choice));
      choicesList.appendChild(button);
    });
  }

  function choosePath(choice) {
    if (state.ended) return;

    applyEffects(choice);

    if (state.energy <= 0) {
      showEnergyEnding();
      return;
    }

    if (choice.target === "ending") {
      renderEnding();
      return;
    }

    renderNode(choice.target);
  }

  function renderChallenge(node) {
    const challenge = node.challenge;
    challengeBox.hidden = false;
    challengeQuestion.textContent = challenge.question;
    challengeAnswers.replaceChildren();

    choicesHeading.textContent = "RESOLVA O DESAFIO PARA CONTINUAR";
    choicesList.replaceChildren();

    challenge.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "challenge-answer";
      button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
      button.addEventListener("click", () => answerChallenge(node, index));
      challengeAnswers.appendChild(button);
    });
  }

  function answerChallenge(node, selectedIndex) {
    const challenge = node.challenge;

    if (state.completedChallenges.includes(challenge.id)) return;

    state.completedChallenges.push(challenge.id);

    const buttons = challengeAnswers.querySelectorAll("button");
    const correct = selectedIndex === challenge.correct;

    buttons.forEach((button, index) => {
      button.disabled = true;
      if (index === challenge.correct) button.classList.add("correct");
      if (index === selectedIndex && !correct) {
        button.classList.add("incorrect");
      }
    });

    if (correct) {
      state.xp += 20;
      state.energy = Math.min(100, state.energy + 5);
      challengeFeedback.textContent = `✓ ${challenge.success}`;
      challengeFeedback.classList.add("success");
    } else {
      state.energy = Math.max(0, state.energy - 10);
      challengeFeedback.textContent = challenge.failure;
      challengeFeedback.classList.add("error");
    }

    updateStats();

    choicesHeading.textContent = "PRÓXIMA ETAPA";
    renderChoices(node.afterChoices || []);
  }

  function renderEnding() {
    state.ended = true;
    progressLabel.textContent = "PROGRESSO 100%";
    progressFill.style.width = "100%";

    chapterLabel.textContent = "MISSÃO CONCLUÍDA";
    storyKicker.textContent = "SISTEMA RESTAURADO";
    storyTitle.textContent = "O Núcleo voltou à vida!";
    storyDescription.textContent =
      "Uma onda de luz percorre o mundo digital. Os circuitos voltam a brilhar, os dados se reorganizam e o portal se estabiliza.\n\nVocê provou que observar, planejar e tomar decisões faz toda a diferença. A aventura termina, mas sua jornada na programação está apenas começando.";

    storyIllustration.textContent = "✦";
    storyMessage.textContent = "✓ Missão finalizada com sucesso!";
    challengeBox.hidden = true;
    choicesHeading.textContent = "RESULTADO DA SUA AVENTURA";
    choicesList.replaceChildren();

    const ending = document.createElement("div");
    ending.className = "ending-card";

    const icon = document.createElement("div");
    icon.className = "ending-icon";
    icon.textContent = "✦";

    const title = document.createElement("h3");
    title.textContent = getEndingTitle();

    const description = document.createElement("p");
    description.textContent =
      `Você concluiu a aventura com ${state.energy} pontos de energia, ${state.xp} XP e ${state.inventory.length} item(ns) coletado(s). Cada decisão ajudou a construir sua jornada.`;

    const score = document.createElement("div");
    score.className = "ending-score";

    const points = document.createElement("strong");
    points.textContent = `${state.xp} XP`;

    const label = document.createElement("span");
    label.textContent = "EXPERIÊNCIA CONQUISTADA";

    score.append(points, label);

    const replay = document.createElement("button");
    replay.type = "button";
    replay.className = "button button-primary";
    replay.textContent = "Jogar novamente ↻";
    replay.addEventListener("click", startGame);

    ending.append(icon, title, description, score, replay);
    choicesList.appendChild(ending);
    updateStats();
  }

  function getEndingTitle() {
    if (state.xp >= 80) return "Mestre dos Algoritmos!";
    if (state.inventory.length >= 3) return "Explorador de Elite!";
    return "Missão cumprida, explorador!";
  }

  function showEnergyEnding() {
    state.ended = true;

    chapterLabel.textContent = "PAUSA NA MISSÃO";
    storyKicker.textContent = "ENERGIA ESGOTADA";
    storyTitle.textContent = "É hora de replanejar";
    storyIllustration.textContent = "↻";
    storyDescription.textContent =
      "Sua energia chegou a zero. No desenvolvimento de algoritmos, rever as decisões e planejar melhor faz parte do aprendizado.\n\nVocê pode reiniciar a aventura e experimentar outro caminho.";

    progressLabel.textContent = "MISSÃO INTERROMPIDA";
    storyMessage.textContent = "Sua jornada ainda pode continuar.";
    challengeBox.hidden = true;
    choicesHeading.textContent = "TENTE NOVAMENTE";
    choicesList.replaceChildren();

    const replay = document.createElement("button");
    replay.type = "button";
    replay.className = "button button-primary";
    replay.textContent = "Recomeçar aventura ↻";
    replay.addEventListener("click", startGame);
    choicesList.appendChild(replay);
  }

  function restartGame() {
    state = initialState();
    hero.hidden = false;
    gameSection.hidden = true;
    $("inicio").scrollIntoView({ behavior: "smooth", block: "start" });
    showToast("Aventura reiniciada. Quando quiser, comece novamente!");
  }

  function showToast(message) {
    const toast = $("toast");
    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 2600);
  }

  startButton.addEventListener("click", startGame);
  ctaButton.addEventListener("click", startGame);
  restartButton.addEventListener("click", restartGame);

  state = initialState();
  updateStats();
});


"use strict";

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const ui = {
    heroXp: $("hero-xp"),
    energyText: $("energy-text"),
    energyBar: $("energy-bar"),
    xpText: $("xp-text"),
    xpBar: $("xp-bar"),
    inventory: $("inventory-list"),
    chapter: $("chapter-label"),
    progressLabel: $("progress-label"),
    progressFill: $("story-progress-fill"),
    art: $("story-art"),
    illustration: $("story-illustration"),
    kicker: $("story-kicker"),
    title: $("story-title"),
    description: $("story-description"),
    choicesHeading: $("choices-heading"),
    choices: $("choices-list"),
    message: $("story-message"),
    challengeBox: $("challenge-box"),
    challengeQuestion: $("challenge-question"),
    challengeAnswers: $("challenge-answers"),
    challengeFeedback: $("challenge-feedback"),
    restart: $("restart-game")
  };

  const initialState = () => ({
    node: "portal",
    energy: 100,
    xp: 0,
    inventory: [],
    visited: [],
    completedChallenges: [],
    finished: false
  });

  let state = initialState();

  const story = {
    portal: {
      chapter: 1,
      progress: 8,
      kicker: "UM NOVO UNIVERSO",
      title: "O portal desconhecido",
      icon: "⌘",
      description: "Você encontra um portal brilhante em um laboratório abandonado. Do outro lado, um universo digital espera por alguém capaz de resolver seus enigmas. Sua missão começa agora.",
      choices: [
        { title: "Entrar no portal", detail: "Descobrir o que existe do outro lado", next: "forest", xp: 10, message: "Você atravessou o portal e ganhou 10 XP." },
        { title: "Observar os símbolos", detail: "Procurar pistas antes de avançar", next: "circuits", xp: 15, item: "Mapa de dados", message: "Você analisou os símbolos e encontrou um mapa. +15 XP." }
      ]
    },
    forest: {
      chapter: 2,
      progress: 22,
      kicker: "CAPÍTULO 02 · EXPLORAÇÃO",
      title: "A floresta de dados",
      icon: "⌁",
      description: "Árvores luminosas formam um labirinto de caminhos. Um painel informa que cada rota segue regras específicas. Para avançar, você precisa pensar como um algoritmo: observar, decidir e agir.",
      choices: [
        { title: "Seguir as luzes azuis", detail: "Confiar nas pistas do caminho", next: "guardian", xp: 10, item: "Cristal lógico", message: "As luzes levaram você até um guardião. +10 XP." },
        { title: "Explorar o caminho lateral", detail: "Investigar uma rota alternativa", next: "circuits", energy: -5, xp: 15, message: "Você encontrou um atalho e ganhou 15 XP, mas gastou um pouco de energia." }
      ]
    },
    circuits: {
      chapter: 2,
      progress: 28,
      kicker: "CAPÍTULO 02 · INVESTIGAÇÃO",
      title: "A sala dos circuitos",
      icon: "⌘",
      description: "Uma sala cheia de circuitos apresenta uma sequência incompleta. Você percebe que, antes de resolver um problema, precisa identificar os dados disponíveis e entender a ordem das instruções.",
      choices: [
        { title: "Organizar as instruções", detail: "Colocar as etapas em uma sequência lógica", next: "logic", xp: 15, item: "Chave de sequência", message: "A sequência ficou organizada. Você ganhou 15 XP." },
        { title: "Procurar outro caminho", detail: "Continuar a exploração", next: "guardian", xp: 5, message: "Você encontrou uma passagem para o guardião. +5 XP." }
      ]
    },
    guardian: {
      chapter: 3,
      progress: 40,
      kicker: "CAPÍTULO 03 · DESAFIO",
      title: "O guardião da lógica",
      icon: "◇",
      description: "Uma inteligência artificial bloqueia a passagem. Ela só libera o caminho para quem demonstra compreender como um algoritmo funciona. Responda ao desafio para continuar.",
      challenge: {
        question: "O que é um algoritmo?",
        answers: [
          "Uma sequência ordenada de passos para resolver um problema",
          "Uma imagem usada para decorar um programa",
          "Um computador que funciona sem instruções"
        ],
        correct: 0,
        success: "Correto! Um algoritmo organiza passos para alcançar um resultado. +25 XP.",
        failure: "Ainda não! Pense em uma receita: ela também tem uma sequência de instruções. Tente novamente."
      },
      after: "logic"
    },
    logic: {
      chapter: 4,
      progress: 55,
      kicker: "CAPÍTULO 04 · DECISÕES",
      title: "A ponte condicional",
      icon: "⇄",
      description: "Uma ponte digital muda de direção de acordo com uma condição. O painel diz: “Se a energia for maior que zero, abra a passagem; caso contrário, mantenha-a fechada”. Você precisa identificar a lógica da regra.",
      challenge: {
        question: "Se energia > 0, qual ação a regra determina?",
        answers: [
          "Fechar a passagem",
          "Abrir a passagem",
          "Apagar todos os dados"
        ],
        correct: 1,
        success: "Muito bem! A condição é verdadeira quando a energia é maior que zero. +25 XP.",
        failure: "Leia a condição novamente. Quando a energia é maior que zero, a passagem deve ser aberta."
      },
      after: "laboratory"
    },
    laboratory: {
      chapter: 5,
      progress: 70,
      kicker: "CAPÍTULO 05 · DESCOBERTA",
      title: "O laboratório de soluções",
      icon: "⌬",
      description: "Você chega a um laboratório com uma máquina desativada. Para ligá-la, precisa escolher uma estratégia: executar as etapas na ordem correta ou agir sem verificar as instruções.",
      choices: [
        { title: "Seguir as etapas em ordem", detail: "Planejar antes de executar", next: "glitch", xp: 20, item: "Núcleo de energia", message: "Sua organização ativou a máquina. +20 XP." },
        { title: "Agir sem planejamento", detail: "Tentar resolver tudo de uma vez", next: "glitch", energy: -15, xp: 5, message: "A máquina ligou, mas a tentativa custou energia. +5 XP." }
      ]
    },
    glitch: {
      chapter: 6,
      progress: 82,
      kicker: "CAPÍTULO 06 · O ÚLTIMO ENIGMA",
      title: "O código corrompido",
      icon: "</>",
      description: "Um erro bloqueia o caminho para a saída. Você encontra três instruções embaralhadas. Para seguir em frente, escolha a sequência que faz sentido: primeiro compreender o problema, depois planejar e, por fim, executar.",
      choices: [
        { title: "Analisar → Planejar → Executar", detail: "Resolver o problema por etapas", next: "vault", xp: 20, item: "Fragmento de código", message: "A sequência correta restaurou o sistema. +20 XP." },
        { title: "Executar → Ignorar → Recomeçar", detail: "Agir sem entender o problema", next: "vault", energy: -10, xp: 5, message: "Você avançou, mas perdeu energia tentando uma sequência inadequada. +5 XP." }
      ]
    },
    vault: {
      chapter: 7,
      progress: 92,
      kicker: "CAPÍTULO 07 · PROVA FINAL",
      title: "O cofre dos algoritmos",
      icon: "⬡",
      description: "O cofre final contém a chave para restaurar o universo digital. Para abri-lo, você precisa identificar qual característica torna um algoritmo mais fácil de compreender e executar.",
      challenge: {
        question: "Qual é uma boa característica de um algoritmo?",
        answers: [
          "Ter passos claros, organizados e bem definidos",
          "Usar instruções aleatórias sem uma ordem",
          "Esconder o objetivo de cada etapa"
        ],
        correct: 0,
        success: "Desafio concluído! Instruções claras facilitam a solução de problemas. +30 XP.",
        failure: "Tente novamente. Um bom algoritmo precisa de passos organizados e compreensíveis."
      },
      after: "ending"
    },
    ending: {
      chapter: 8,
      progress: 100,
      kicker: "MISSÃO CONCLUÍDA",
      title: "Você restaurou o universo!",
      icon: "✦",
      description: "O sistema voltou a funcionar. Ao longo da aventura, você explorou caminhos, organizou instruções, analisou condições e resolveu desafios. Você descobriu que programar não é apenas escrever código: é aprender a pensar em etapas.",
      ending: true
    }
  };

  function updateStats() {
    ui.energyText.textContent = state.energy + "%";
    ui.energyBar.style.width = state.energy + "%";
    ui.xpText.textContent = state.xp + " XP";
    ui.xpBar.style.width = Math.min(state.xp / 125 * 100, 100) + "%";
    ui.heroXp.textContent = state.xp + " XP";

    ui.inventory.replaceChildren();

    if (state.inventory.length === 0) {
      const empty = document.createElement("span");
      empty.className = "inventory-empty";
      empty.textContent = "Seus itens aparecerão aqui.";
      ui.inventory.appendChild(empty);
    } else {
      state.inventory.forEach((item) => {
        const tag = document.createElement("span");
        tag.className = "inventory-item";
        tag.textContent = "✦ " + item;
        ui.inventory.appendChild(tag);
      });
    }
  }

  function addReward(choice) {
    if (typeof choice.xp === "number") {
      state.xp += choice.xp;
    }

    if (typeof choice.energy === "number") {
      state.energy = Math.max(0, Math.min(100, state.energy + choice.energy));
    }

    if (choice.item && !state.inventory.includes(choice.item)) {
      state.inventory.push(choice.item);
    }

    updateStats();
  }

  function renderNode(nodeId, message = "") {
    const node = story[nodeId];
    if (!node) return;

    state.node = nodeId;
    if (!state.visited.includes(nodeId)) state.visited.push(nodeId);

    ui.chapter.textContent = "CAPÍTULO " + String(node.chapter).padStart(2, "0");
    ui.progressLabel.textContent = node.ending ? "MISSÃO CONCLUÍDA" : "JORNADA EM ANDAMENTO";
    ui.progressFill.style.width = node.progress + "%";
    ui.kicker.textContent = node.kicker;
    ui.title.textContent = node.title;
    ui.description.textContent = node.description;
    ui.illustration.textContent = node.icon;
    ui.message.textContent = message;

    ui.art.classList.toggle("ending-art", Boolean(node.ending));
    ui.choices.replaceChildren();
    ui.challengeBox.hidden = true;
    ui.challengeAnswers.replaceChildren();
    ui.challengeFeedback.textContent = "";

    if (node.challenge) {
      renderChallenge(nodeId, node.challenge);
    } else if (node.ending) {
      state.finished = true;
      ui.choicesHeading.textContent = "SUA JORNADA";
      addChoice({
        title: "Jogar novamente",
        detail: "Recomeçar a aventura desde o início",
        action: restart
      });
      addChoice({
        title: "Rever o que aprendeu",
        detail: "Ir até os conceitos de programação",
        action: () => {
          document.getElementById("aprendizado").scrollIntoView({ behavior: "smooth" });
        }
      });
      ui.message.textContent = "Resultado: " + state.xp + " XP conquistados e " + state.inventory.length + " item(ns) coletado(s).";
    } else {
      ui.choicesHeading.textContent = "O QUE VOCÊ VAI FAZER?";
      node.choices.forEach((choice, index) => {
        addChoice({
          title: choice.title,
          detail: choice.detail,
          number: String(index + 1).padStart(2, "0"),
          action: () => selectChoice(choice)
        });
      });
    }

    updateStats();
  }

  function addChoice({ title, detail, number = "→", action }) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice-button";

    const numberSpan = document.createElement("span");
    numberSpan.className = "choice-number";
    numberSpan.textContent = number;

    const textSpan = document.createElement("span");
    textSpan.className = "choice-text";

    const strong = document.createElement("strong");
    strong.textContent = title;

    const small = document.createElement("small");
    small.textContent = detail;

    const arrow = document.createElement("span");
    arrow.className = "choice-arrow";
    arrow.textContent = "→";

    textSpan.append(strong, small);
    button.append(numberSpan, textSpan, arrow);
    button.addEventListener("click", action);
    ui.choices.appendChild(button);
  }

  function selectChoice(choice) {
    addReward(choice);
    renderNode(choice.next, choice.message || "");
  }

  function renderChallenge(nodeId, challenge) {
    ui.choicesHeading.textContent = "DESAFIO DE LÓGICA";
    ui.challengeBox.hidden = false;
    ui.challengeQuestion.textContent = challenge.question;

    const alreadyCompleted = state.completedChallenges.includes(nodeId);
    if (alreadyCompleted) {
      ui.challengeFeedback.textContent = "Este desafio já foi concluído.";
      addChoice({
        title: "Continuar aventura",
        detail: "Seguir para a próxima etapa",
        action: () => renderNode(story[nodeId].after)
      });
      return;
    }

    challenge.answers.forEach((answer, index) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "challenge-answer";
      button.textContent = String.fromCharCode(65 + index) + ". " + answer;
      button.addEventListener("click", () => answerChallenge(nodeId, challenge, index));
      ui.challengeAnswers.appendChild(button);
    });
  }

  function answerChallenge(nodeId, challenge, answerIndex) {
    if (state.completedChallenges.includes(nodeId)) return;

    if (answerIndex !== challenge.correct) {
      ui.challengeFeedback.textContent = challenge.failure;
      return;
    }

    state.completedChallenges.push(nodeId);
    const reward = nodeId === "vault" ? 30 : 25;
    state.xp += reward;
    updateStats();

    ui.challengeAnswers.replaceChildren();
    ui.challengeFeedback.textContent = challenge.success;

    const continueButton = document.createElement("button");
    continueButton.type = "button";
    continueButton.className = "choice-button";
    continueButton.style.marginTop = "12px";

    const numberSpan = document.createElement("span");
    numberSpan.className = "choice-number";
    numberSpan.textContent = "✓";

    const textSpan = document.createElement("span");
    textSpan.className = "choice-text";
    const strong = document.createElement("strong");
    strong.textContent = "Continuar aventura";
    const small = document.createElement("small");
    small.textContent = "Avançar para a próxima etapa";
    textSpan.append(strong, small);

    const arrow = document.createElement("span");
    arrow.className = "choice-arrow";
    arrow.textContent = "→";

    continueButton.append(numberSpan, textSpan, arrow);
    continueButton.addEventListener("click", () => renderNode(story[nodeId].after));
    ui.choices.appendChild(continueButton);
  }

  function restart() {
    state = initialState();
    renderNode("portal", "A aventura recomeçou. Boa sorte, explorador!");
    document.getElementById("aventura").scrollIntoView({ behavior: "smooth" });
  }

  ui.restart.addEventListener("click", restart);

  // Mostra a primeira etapa assim que o JavaScript é carregado.
  renderNode("portal");
});

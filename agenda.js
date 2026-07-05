const catalogo = {
  "Tranças": {
    icone: "👑",
    opcoes: ["Box Braids", "Nagô", "Twist", "Fulani"]
  },
  "Brow Lamination": {
    icone: "✨",
    opcoes: ["Brow Lamination"]
  },
  "Lash Lifting": {
    icone: "🌸",
    opcoes: ["Lash Lifting"]
  },
  "Design de Sobrancelhas": {
    icone: "💜",
    opcoes: ["Design simples", "Design com henna"]
  }
};

const botoes = document.querySelectorAll(".servico-card button");

const modal = document.getElementById("modalAgendamento");
const fecharModal = document.getElementById("fecharModal");
const modalIcone = document.getElementById("modalIcone");
const modalTitulo = document.getElementById("modalTitulo");
const modalOpcoes = document.getElementById("modalOpcoes");
const modalContinuar = document.getElementById("modalContinuar");

let servicoSelecionado = "";
let opcaoSelecionada = "";

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    const card = botao.closest(".servico-card");
    servicoSelecionado = card.querySelector("h2").innerText;

    abrirModal(servicoSelecionado);
  });
});

function abrirModal(servico) {
  const dados = catalogo[servico];

  modalIcone.textContent = dados.icone;
  modalTitulo.textContent = servico;
  modalOpcoes.innerHTML = "";
  opcaoSelecionada = "";

  dados.opcoes.forEach((opcao) => {
    const item = document.createElement("button");
    item.className = "modal-opcao";
    item.textContent = opcao;

    item.addEventListener("click", () => {
      document.querySelectorAll(".modal-opcao").forEach((btn) => {
        btn.classList.remove("ativo");
      });

      item.classList.add("ativo");
      opcaoSelecionada = opcao;
    });

    modalOpcoes.appendChild(item);
  });

  modal.classList.add("ativo");
}

fecharModal.addEventListener("click", () => {
  modal.classList.remove("ativo");
});

modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("ativo");
  }
});

modalContinuar.addEventListener("click", () => {
  if (!opcaoSelecionada) {
    modalContinuar.textContent = "Escolha uma opção primeiro";
    setTimeout(() => {
      modalContinuar.textContent = "Continuar";
    }, 1600);
    return;
  }

  console.log("Serviço:", servicoSelecionado);
  console.log("Opção:", opcaoSelecionada);

  modalContinuar.textContent = "Próxima etapa em breve 💜";
});

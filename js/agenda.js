const botoes = document.querySelectorAll(".servico-card button");

const modal = document.getElementById("modalAgendamento");
const fecharModal = document.getElementById("fecharModal");
const modalIcone = document.getElementById("modalIcone");
const modalTitulo = document.getElementById("modalTitulo");
const modalDescricao = document.getElementById("modalDescricao");
const modalOpcoes = document.getElementById("modalOpcoes");
const modalContinuar = document.getElementById("modalContinuar");

let servicoSelecionado = "";
let opcaoSelecionada = "";
let dataSelecionada = "";
let horarioSelecionado = "";

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    const card = botao.closest(".servico-card");
    servicoSelecionado = card.querySelector("h2").innerText;
    abrirModal(servicoSelecionado);
  });
});

function abrirModal(servico) {
  const dados = SERVICOS[servico];

  modalIcone.textContent = dados.icone;
  modalTitulo.textContent = servico;
  modalDescricao.textContent = "Escolha uma opção para continuar seu agendamento.";
  modalOpcoes.innerHTML = "";
  modalContinuar.textContent = "Continuar";
  modalContinuar.style.display = "block";
  opcaoSelecionada = "";
  dataSelecionada = "";

  dados.opcoes.forEach((opcao) => {
    const item = document.createElement("button");
    item.className = "modal-opcao";

    item.innerHTML = `
      <strong>${opcao.nome}</strong>
      <small>A partir de R$ ${opcao.preco} • ${opcao.tempo}</small>
    `;

    item.addEventListener("click", () => {
      document.querySelectorAll(".modal-opcao").forEach((btn) => {
        btn.classList.remove("ativo");
      });

      item.classList.add("ativo");
      opcaoSelecionada = opcao.nome;
    });

    modalOpcoes.appendChild(item);
  });

  modal.classList.add("ativo");
}

function mostrarCalendario() {
  const hoje = new Date();
  const ano = hoje.getFullYear();
  const mes = hoje.getMonth();

  const primeiroDia = new Date(ano, mes, 1);
  const ultimoDia = new Date(ano, mes + 1, 0);

  const nomesMeses = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ];

  modalIcone.textContent = "📅";
  modalTitulo.textContent = `${nomesMeses[mes]} ${ano}`;
  modalDescricao.textContent = "Escolha o dia do seu atendimento.";
  modalOpcoes.innerHTML = "";
  modalContinuar.textContent = "Continuar";

  const calendario = document.createElement("div");
  calendario.className = "calendario";

  const diasSemana = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  diasSemana.forEach((dia) => {
    const label = document.createElement("div");
    label.className = "dia-semana";
    label.textContent = dia;
    calendario.appendChild(label);
  });

  for (let i = 0; i < primeiroDia.getDay(); i++) {
    const vazio = document.createElement("div");
    calendario.appendChild(vazio);
  }

  for (let dia = 1; dia <= ultimoDia.getDate(); dia++) {
    const data = new Date(ano, mes, dia);
    const botaoDia = document.createElement("button");
    botaoDia.className = "dia-calendario";
    botaoDia.textContent = dia;

    if (data < new Date(hoje.getFullYear(), hoje.getMonth(), hoje.getDate())) {
      botaoDia.disabled = true;
      botaoDia.classList.add("indisponivel");
    }

    botaoDia.addEventListener("click", () => {
      document.querySelectorAll(".dia-calendario").forEach((btn) => {
        btn.classList.remove("ativo");
      });

      botaoDia.classList.add("ativo");

      dataSelecionada = `${String(dia).padStart(2, "0")}/${String(mes + 1).padStart(2, "0")}/${ano}`;
      setTimeout(() => {
        mostrarHorarios();
      }, 300);
    });

    calendario.appendChild(botaoDia);
  }

  modalOpcoes.appendChild(calendario);
}

function mostrarHorarios() {
  modalIcone.textContent = "🕒";
  modalTitulo.textContent = "Escolha o horário";
  modalDescricao.textContent = `Data selecionada: ${dataSelecionada}`;
  modalOpcoes.innerHTML = "";

  modalContinuar.style.display = "block";
  modalContinuar.textContent = "Continuar";

  const listaHorarios = document.createElement("div");
  listaHorarios.className = "lista-horarios";

  HORARIOS_PADRAO.forEach((horario) => {
    const botaoHorario = document.createElement("button");
    botaoHorario.className = "horario-chip";
    botaoHorario.textContent = horario;

    botaoHorario.addEventListener("click", () => {
      document.querySelectorAll(".horario-chip").forEach((btn) => {
        btn.classList.remove("ativo");
      });

      botaoHorario.classList.add("ativo");
      horarioSelecionado = horario;
    });

    listaHorarios.appendChild(botaoHorario);
  });

  modalOpcoes.appendChild(listaHorarios);
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

  if (!dataSelecionada) {
    mostrarCalendario();
    return;
  }

  if (dataSelecionada && !horarioSelecionado) {
    modalContinuar.textContent = "Escolha um horário primeiro";
    setTimeout(() => {
      modalContinuar.textContent = "Continuar";
  }, 1600);

  return;
}

  console.log("Serviço:", servicoSelecionado);
  console.log("Opção:", opcaoSelecionada);
  console.log("Data:", dataSelecionada);

  modalContinuar.textContent = "Horários em breve 💜";
});

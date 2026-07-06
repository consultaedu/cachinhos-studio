const API_URL = "https://script.google.com/macros/s/AKfycbytJW6YT7oikUwlZGiM6C_o3aQDQ7ZtWmDu15sMne-SeDfFcXFwA6cSaKIofQ_NUUuO3A/exec";

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
let formularioAberto = false;

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
  horarioSelecionado = "";
  formularioAberto = false;

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
      opcaoSelecionada = opcao;
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

async function mostrarHorarios() {
  modalIcone.textContent = "🕒";
  modalTitulo.textContent = "Escolha o horário";
  modalDescricao.textContent = `Data selecionada: ${dataSelecionada}`;
  modalOpcoes.innerHTML = "";

  modalContinuar.style.display = "block";
  modalContinuar.textContent = "Continuar";

  let ocupados = [];

try {
  const resposta = await fetch(`${API_URL}?data=${encodeURIComponent(dataSelecionada)}`);
  const resultado = await resposta.json();
  ocupados = resultado.ocupados || [];
} catch (erro) {
  console.error("Erro ao buscar horários ocupados:", erro);
  ocupados = [];
}

  const listaHorarios = document.createElement("div");
  listaHorarios.className = "lista-horarios";

  console.log("Horários padrão:", HORARIOS_PADRAO);
  console.log("Ocupados:", ocupados);
  console.log("Opção selecionada:", opcaoSelecionada);

  HORARIOS_PADRAO.forEach((horario) => {
    const botaoHorario = document.createElement("button");
    botaoHorario.className = "horario-chip";
    botaoHorario.textContent = horario;

    const indisponivel = horarioEstaIndisponivel(
      horario,
      opcaoSelecionada.duracaoMin,
      ocupados
    );

    if (indisponivel) {
      botaoHorario.disabled = true;
      botaoHorario.classList.add("ocupado");
    }

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

function mostrarFormulario() {
  formularioAberto = true;

  modalIcone.textContent = "💜";
  modalTitulo.textContent = "Quase lá!";
  modalDescricao.textContent = "Informe seus dados para concluir o agendamento.";

  modalOpcoes.innerHTML = "";

  modalContinuar.textContent = "Confirmar Agendamento";

  const formulario = document.createElement("div");
  formulario.className = "formulario-agendamento";

  formulario.innerHTML = `
  
    <input
      type="text"
      id="clienteNome"
      placeholder="Seu nome"
    >

    <input
      type="tel"
      id="clienteWhatsapp"
      placeholder="WhatsApp"
    >

    <textarea
      id="clienteObs"
      placeholder="Observações (opcional)"
    ></textarea>

  `;

  modalOpcoes.appendChild(formulario);

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

  if (formularioAberto) {
  const nome = document.getElementById("clienteNome").value.trim();
  const whatsapp = document.getElementById("clienteWhatsapp").value.trim();
  const obs = document.getElementById("clienteObs").value.trim();

  if (!nome || !whatsapp) {
    modalContinuar.textContent = "Preencha nome e WhatsApp";
    setTimeout(() => {
      modalContinuar.textContent = "Confirmar Agendamento";
    }, 1600);
    return;
  }

  const mensagem = encodeURIComponent(
    `Olá! 💜\n\nQuero confirmar meu agendamento na Cachinhos Studio.\n\n` +
    `Serviço: ${servicoSelecionado}\n` +
    `Opção: ${opcaoSelecionada}\n` +
    `Data: ${dataSelecionada}\n` +
    `Horário: ${horarioSelecionado}\n\n` +
    `Nome: ${nome}\n` +
    `WhatsApp: ${whatsapp}\n` +
    `Observação: ${obs || "Nenhuma"}`
  );

  enviarAgendamento({
  nome,
  whatsapp,
  observacao: obs,
  servico: servicoSelecionado,
  opcao: opcaoSelecionada.nome,
  duracao: opcaoSelecionada.duracaoMin,
  data: dataSelecionada,
  hora: horarioSelecionado
  });

  return;
  }

  mostrarFormulario();
});

async function enviarAgendamento(dados) {
  modalContinuar.textContent = "Enviando...";
  modalContinuar.disabled = true;

  try {
    const resposta = await fetch(API_URL, {
      method: "POST",
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();

    if (!resultado.sucesso) {
      throw new Error(resultado.erro || "Erro ao agendar");
    }

    modalIcone.textContent = "✅";
    modalTitulo.textContent = "Agendamento enviado!";
    modalDescricao.textContent = "Seu horário foi registrado com sucesso.";
    modalOpcoes.innerHTML = "";
    modalContinuar.textContent = "Fechar";
    modalContinuar.disabled = false;

    modalContinuar.onclick = () => {
      modal.classList.remove("ativo");
    };

  } catch (erro) {
    modalContinuar.textContent = "Tentar novamente";
    modalContinuar.disabled = false;
    alert("Erro ao enviar agendamento: " + erro.message);
  }
}

function horarioParaMinutos(horario) {
  const [hora, minuto] = horario.split(":").map(Number);
  return hora * 60 + minuto;
}

function horarioEstaIndisponivel(horario, duracaoNova, ocupados) {
  const inicioNovo = horarioParaMinutos(horario);
  const fimNovo = inicioNovo + duracaoNova;

  return ocupados.some((ocupado) => {
    const inicioOcupado = horarioParaMinutos(ocupado.hora);
    const fimOcupado = inicioOcupado + Number(ocupado.duracao || 60);

    return inicioNovo < fimOcupado && fimNovo > inicioOcupado;
  });
}
const botoes = document.querySelectorAll(".servico-card button");

botoes.forEach((botao) => {
  botao.addEventListener("click", () => {
    const card = botao.closest(".servico-card");
    const servico = card.querySelector("h2").innerText;

    localStorage.setItem("servicoSelecionado", servico);

    alert(`Você selecionou: ${servico}`);
  });
});

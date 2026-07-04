const WHATSAPP_NUMERO = "5527997727360"; 
// Troque esse número pelo WhatsApp oficial do studio depois

const botoesAgendar = document.querySelectorAll(".btn");

botoesAgendar.forEach((botao) => {
  botao.addEventListener("click", (e) => {
    const href = botao.getAttribute("href");

    if (href === "#agendamento") return;

    e.preventDefault();

    const mensagem = encodeURIComponent(
      `Olá! 💜\n\nGostaria de agendar um horário na Cachinhos Studio.\n\nPode me passar os horários disponíveis?`
    );

    window.open(`https://wa.me/${WHATSAPP_NUMERO}?text=${mensagem}`, "_blank");
  });
});

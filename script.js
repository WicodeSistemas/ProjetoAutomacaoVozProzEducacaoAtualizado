// Obtém o botão "Start" do documento HTML através do ID 'startBtn'
const startBtn = document.getElementById('startBtn');

// Obtém o botão "Stop" do documento HTML através do ID 'stopBtn'
const stopBtn = document.getElementById('stopBtn');

// Obtém o elemento de status, que será usado para mostrar mensagens, através do ID 'status'
const statusElement = document.getElementById('status');

// Um objeto 'devices' contendo referências para os dispositivos (luz, freezer, TV) do documento HTML
const devices = {
  luz: document.getElementById('Light'),  // Seleciona o elemento com ID 'Light'
  freezer: document.getElementById('freezer'),  // Seleciona o elemento com ID 'freezer'
  tv: document.getElementById('tv')  // Seleciona o elemento com ID 'tv'
};

// Verifica se a biblioteca 'annyang' (reconhecimento de voz) está disponível
if (annyang) {
  // Define os comandos de voz que serão reconhecidos: 'ligar *device' e 'desligar *device'
  const commands = {
    'ligar *device': function(device) {
      // Quando o comando 'ligar' é reconhecido, chama a função toggleDevice passando o dispositivo e o estado 'true' (ligado)
      toggleDevice(device, true);
    },
    'desligar *device': function(device) {
      // Quando o comando 'desligar' é reconhecido, chama a função toggleDevice passando o dispositivo e o estado 'false' (desligado)
      toggleDevice(device, false);
    }
  };

  // Adiciona os comandos à biblioteca 'annyang'
  annyang.addCommands(commands);

  // Define o idioma de reconhecimento de voz para português do Brasil
  annyang.setLanguage('pt-BR');

  // Callback para quando o reconhecimento de voz retorna algum resultado
  annyang.addCallback('result', function(phrases) {
    // Mostra a frase reconhecida no elemento de status
    statusElement.textContent = "Comando reconhecido: " + phrases[0];
  });

  // Callback para quando o som é detectado e o reconhecimento começa
  annyang.addCallback('soundstart', function() {
    // Atualiza o elemento de status para indicar que o sistema está ouvindo
    statusElement.textContent = "Ouvindo...";
  });

  // Callback para quando ocorre um erro no reconhecimento de voz
  annyang.addCallback('error', function() {
    // Exibe uma mensagem de erro no elemento de status
    statusElement.textContent = "Erro no reconhecimento de voz";
  });
}

// Adiciona um evento de clique ao botão "Start"
startBtn.addEventListener('click', function() {
  // Inicia o reconhecimento de voz com o parâmetro 'autoRestart' ativado, mas 'continuous' desativado
  annyang.start({ autoRestart: true, continuous: false });

  // Desabilita o botão "Start" para evitar múltiplos cliques
  startBtn.disabled = true;

  // Habilita o botão "Stop" para que o reconhecimento de voz possa ser interrompido
  stopBtn.disabled = false;

  // Atualiza o elemento de status para indicar que o reconhecimento de voz foi iniciado
  statusElement.textContent = "Reconhecimento de voz iniciado";
});

// Adiciona um evento de clique ao botão "Stop"
stopBtn.addEventListener('click', function() {
  // Para o reconhecimento de voz chamando 'annyang.abort()'
  annyang.abort();

  // Habilita o botão "Start" novamente
  startBtn.disabled = false;

  // Desabilita o botão "Stop"
  stopBtn.disabled = true;

  // Atualiza o elemento de status para indicar que o reconhecimento de voz foi parado
  statusElement.textContent = "Reconhecimento de voz parado";
});

// Função para ligar ou desligar um dispositivo com base no comando de voz reconhecido
function toggleDevice(device, state) {
  // Normaliza o nome do dispositivo, transformando tudo em minúsculas e removendo espaços
  const normalizedDevice = device.toLowerCase().replace(/\s+/g, '');

  // Verifica se o dispositivo normalizado existe no objeto 'devices'
  if (devices[normalizedDevice]) {
    // Altera a classe CSS do dispositivo para 'on' ou 'off' dependendo do estado (ligado/desligado)
    devices[normalizedDevice].className = `device-status ${state ? 'on' : 'off'}`;

    // Atualiza o elemento de status para indicar se o dispositivo está sendo ligado ou desligado
    statusElement.textContent = `${state ? 'Ligando' : 'Desligando'} ${device}`;
  } else {
    // Se o dispositivo não for encontrado, exibe uma mensagem de erro no elemento de status
    statusElement.textContent = `Dispositivo "${device}" não encontrado`;
  }
}

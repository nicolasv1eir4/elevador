// Banco de dados interno do CLP do Elevador
const state = {
    weight: 0,
    maxWeight: 400,
    currentFloor: 0, // 0 = Térreo, 1 = 1º, etc.
    isMoving: false,
    floorsPositions: [10, 140, 270, 370] // Alturas em pixel mapeadas no CSS (bottom)
};

// Mapeamento de Elementos da IHM
const weightDisplay = document.getElementById('weight-display');
const statusDisplay = document.getElementById('status-display');
const floorDisplay = document.getElementById('floor-display');
const alarmPanel = document.getElementById('alert-display');
const cabin = document.getElementById('cabin');

// Botões de Interação
const btnAdd = document.getElementById('add-btn');
const floorButtons = document.querySelectorAll('.floor-btn');

function updateHardware() {
    // 1. Atualizar Displays Numéricos
    weightDisplay.textContent = `${state.weight} kg`;
    
    const floorNames = ["TÉRREO", "1º ANDAR", "2º ANDAR", "3º ANDAR"];
    floorDisplay.textContent = floorNames[state.currentFloor];

    // 2. Regra Crítica de Segurança: Validação de Carga
    if (state.weight >= state.maxWeight) {
        // Ativa Alerta Visual Obligatório
        alarmPanel.textContent = "⚠️ SOBRECARGA DETECTADA";
        alarmPanel.classList.add('overload');
        
        statusDisplay.textContent = "BLOQUEADO";
        statusDisplay.className = "status-overload";
        statusDisplay.style.color = "#e06c75";

        // Trava Física: Desabilita entrada de carga e comandos de movimento
        btnAdd.disabled = true;
        toggleFloorButtons(true);
    } else {
        // Sistema Operando Normalmente
        alarmPanel.textContent = "SISTEMA OPERACIONAL";
        alarmPanel.classList.remove('overload');
        
        if(state.isMoving) {
            statusDisplay.textContent = "EM MOVIMENTO";
            statusDisplay.style.color = "#e5c07b";
        } else {
            statusDisplay.textContent = "STANDBY";
            statusDisplay.style.color = "#98c379";
        }

        btnAdd.disabled = state.isMoving; // Não pode pôr peso se tiver andando
        toggleFloorButtons(state.isMoving);
    }
}

// Controla o travamento do teclado de andares
function toggleFloorButtons(disabledStatus) {
    floorButtons.forEach(btn => btn.disabled = disabledStatus);
}

// Movimentação Dinâmica do Elevador
function goToFloor(targetFloor) {
    if (state.weight >= state.maxWeight || state.isMoving) return;

    state.isMoving = true;
    updateHardware();

    // Executa o movimento físico alterando a propriedade bottom do CSS
    cabin.style.bottom = `${state.floorsPositions[targetFloor]}px`;

    // Simulação do tempo de viagem física entre andares
    setTimeout(() => {
        state.currentFloor = targetFloor;
        state.isMoving = false;
        updateHardware();
    }, 2000); // 2 segundos de viagem
}

// Evento: Sensor de Peso Acionado (+100kg)
btnAdd.addEventListener('click', () => {
    if (state.weight < state.maxWeight && !state.isMoving) {
        state.weight += 100;
        updateHardware();
    }
});

// Evento: Botão de Reset (Zera erros e limpa estados)
document.getElementById('reset-btn').addEventListener('click', () => {
    state.weight = 0;
    state.isMoving = false;
    state.currentFloor = 0;
    cabin.style.bottom = `${state.floorsPositions[0]}px`; // Volta pro térreo
    updateHardware();
});

// Inicialização de Fábrica
updateHardware();
document.getElementById("input-rendimento").addEventListener('input', function(e) {
    document.getElementById("valor-rendimento").innerText = e.target.value;
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const ecrSetup = document.getElementById('screen-setup');
        const ecrJogo = document.getElementById('screen-game');
        const elementoFocado = document.activeElement;
        
        // Corrigido o 'iif' duplicado e alinhadas as validações do ecrã
        if (ecrSetup.classList.contains('hidden') && !ecrJogo.classList.contains('hidden')) {
            if (elementoFocado.tagName !== 'INPUT' && elementoFocado.tagName !== 'TEXTAREA') {
                event.preventDefault();
                // Linha atualizada para chamar a função correta da Engine!
                Engine.avancarMes(); 
            }
        }
    }
});

window.onload = () => {
    UI.renderBancos();
    Engine.ajustarRendimentoPorIdade();
};
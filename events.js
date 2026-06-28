document.getElementById("input-rendimento").addEventListener('input', function(e) {
    document.getElementById("valor-rendimento").innerText = e.target.value;
});

document.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        const ecrSetup = document.getElementById('screen-setup');
        const ecrJogo = document.getElementById('screen-game');
        const elementoFocado = document.activeElement;
        
        if (ecrSetup.classList.contains('hidden') && !ecrJogo.classList.contains('hidden')) {
            if (elementoFocado.tagName !== 'INPUT' && elementoFocado.tagName !== 'TEXTAREA') {
                event.preventDefault();
                Engine.terminarMes();
            }
        }
    }
});

window.onload = () => {
    UI.renderBancos();
    Engine.ajustarRendimentoPorIdade();
};
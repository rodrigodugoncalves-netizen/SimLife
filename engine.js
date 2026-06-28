const Engine = {
    
    iniciarJogo(e) {
        e.preventDefault();
        State.nome = document.getElementById("input-nome").value;
        State.idade = parseInt(document.getElementById("input-idade").value);
        State.receita = parseInt(document.getElementById("input-rendimento").value);
        
        const bancoSelecionado = document.querySelector('input[name="banco"]:checked');
        if (!bancoSelecionado) { alert("Escolhe um banco primeiro!"); return; }
        
        State.bancoId = bancoSelecionado.value;
        State.bancoDados = DB.bancos.find(b => b.id === State.bancoId);
        
        State.bolso = State.bancoDados.bonus;
        if (State.bancoDados.custo > 0) State.bolso -= State.bancoDados.custo;
        if (State.bancoId === 'bcp') State.seguroAtivo = true;

        document.getElementById('screen-setup').classList.add('hidden');
        document.getElementById('screen-game').classList.remove('hidden');
        document.getElementById('ui-header-stats').classList.remove('hidden');
        
        State.objetivosAtivos.push({ id: Date.now(), nome: "Telemóvel Novo", preco: 300, icon: "📱" });

        UI.atualizarTudo();
        UI.renderLoja();
        UI.renderTrofeus();
        UI.notificar("Simulação Iniciada", `Bem-vindo ao teu futuro financeiro, ${State.nome}!`);
    },

    transferirDinheiro(e) {
        if (!State.bancoDados) { UI.notificar("Erro", "Inicia o jogo primeiro!"); return; }
        
        const direcao = document.getElementById("banco-direcao").value;
        const valor = parseFloat(document.getElementById("banco-valor").value);
        
        if (isNaN(valor) || valor <= 0) { UI.notificar("Erro", "Insere um valor válido."); return; }

        if (direcao === 'depositar') {
            if (State.bolso >= valor) {
                State.bolso -= valor;
                State.poupanca += valor;
                UI.flutuarTexto(e, `-${valor}€`, "text-red-500");
                UI.notificar("Banco", "Dinheiro guardado na conta poupança!");
            } else { UI.notificar("Erro", "Não tens esse dinheiro físico no bolso."); }
        } else {
            if (State.poupanca >= valor) {
                State.poupanca -= valor;
                State.bolso += valor;
                UI.flutuarTexto(e, `+${valor}€`, "text-emerald-500");
                UI.notificar("Banco", "Dinheiro levantado para o teu bolso!");
            } else { UI.notificar("Erro", "Não tens esse valor guardado no banco."); }
        }
        
        document.getElementById("banco-valor").value = "";
        UI.atualizarTudo();
    },

    comprarItem(e, itemId) {
        const item = DB.produtos.find(l => l.id === itemId);
        if (!item) return;

        const idadeLimite = item.minIdade;
        if (State.idade < idadeLimite) {
            UI.notificar("Bloqueado", "Ainda não tens idade para comprar este item.");
            return;
        }

        let precoFinal = item.preco;
        if (State.bolso >= precoFinal) {
            State.bolso -= precoFinal;
            State.felicidade += (item.fel || 0);
            State.social += (item.soc || 0);
            this.limitarStatus();
            
            UI.flutuarTexto(e, `-${precoFinal.toFixed(1)}€`, "text-red-500");
            UI.notificar("Loja", `Compraste ${item.nome}! 😊+${item.fel || 0} 👥+${item.soc || 0}`);
            
            // Lógica interna para rastrear troféu de compras
            if(!State.historicoObj.includes(itemId)) {
                State.totalChamadasFamilia += 1; // Usado temporariamente para contar compras
            }

            UI.atualizarTudo();
            this.verificarTrofeus();
        } else {
            UI.notificar("Sem Saldo", "Não tens dinheiro suficiente no bolso! Transfere do Banco.");
        }
    },

    adicionarObjetivo() {
        const nome = document.getElementById("obj-nome").value;
        const preco = parseFloat(document.getElementById("obj-preco").value);
        const icon = document.getElementById("obj-icon").value;

        if (!nome || isNaN(preco) || preco <= 0) { UI.notificar("Erro", "Preenche os campos corretamente."); return; }

        State.objetivosAtivos.push({ id: Date.now(), nome, preco, icon });
        UI.esconderModalObjetivo();
        
        document.getElementById("obj-nome").value = "";
        document.getElementById("obj-preco").value = "";
        
        UI.renderObjetivos();
        UI.notificar("Meta Criada", `Objetivo '${nome}' adicionado!`);
    },

    removerObjetivo(id) {
        State.objetivosAtivos = State.objetivosAtivos.filter(o => o.id !== id);
        UI.renderObjetivos();
    },

    comprarObjetivo(id) {
        const obj = State.objetivosAtivos.find(o => o.id === id);
        if (!obj) return;

        if (State.poupanca >= obj.preco) {
            State.poupanca -= obj.preco;
            State.historicoObj.push(obj.nome);
            State.objetivosAtivos = State.objetivosAtivos.filter(o => o.id !== id);
            
            State.felicidade = 100; 
            
            if (typeof confetti === 'function') {
                confetti({ particleCount: 150, spread: 80, origin: { y: 0.6 } });
            }
            
            UI.notificar("🎉 VITÓRIA!", `Alcançaste a tua meta: ${obj.nome}!`);
            UI.renderObjetivos();
            UI.atualizarTudo();
            this.verificarTrofeus();
        }
    },

    ligarAosAvos(e) {
        if (!State.bancoDados) { UI.notificar("Erro", "Inicia o jogo primeiro!"); return; }
        
        const mesesPassados = State.mes - State.ultimoMesFamilia;
        // BLOQUEIO TOTAL E AUMENTADO: Alterado de 2 para 5 meses
        if (mesesPassados < 5) {
            const mesesEmFalta = 5 - mesesPassados;
            UI.notificar("Família", `Acesso Bloqueado! Faltam ${mesesEmFalta} ${mesesEmFalta === 1 ? 'mês' : 'meses'} para poderes voltar a ligar à família!`);
            return; // Bloqueia mesmo a execução aqui
        }

        State.ultimoMesFamilia = State.mes;
        State.social += 15;
        State.felicidade += 5;
        this.limitarStatus();
        
        if (Math.random() < 0.35) {
            const prendas = [5, 10, 20];
            const ganho = prendas[Math.floor(Math.random() * prendas.length)];
            State.bolso += ganho;
            UI.flutuarTexto(e, `+${ganho}€`, "text-emerald-500");
            UI.notificar("Prenda de Família", `Os teus avós deram-te ${ganho}€ às escondidas! 🪙`);
        } else {
            UI.flutuarTexto(e, "+Social", "text-purple-500");
            UI.notificar("Família", "Conversa muito agradável! Ganhaste Vida Social.");
        }

        this.desbloquearTrofeu("txt_ligar_av0"); // Auxiliar para disparar a conquista de ligação
        UI.atualizarTudo();
        this.verificarTrofeus();
    },

    terminarMes() {
        if (!State.bancoDados) { UI.notificar("Erro", "Inicia o jogo primeiro!"); return; }
        
        State.mes += 1;
        let juroGanho = State.poupanca * State.bancoDados.juro;
        State.poupanca += juroGanho;
        State.bolso += State.receita;
        
        State.felicidade -= 12;
        State.social -= 15;

        // Atualização da Idade simulada com base nos meses para a nova conquista
        if (State.mes % 12 === 0 && State.idade < 18) {
            State.idade += 1;
        }

        this.limitarStatus();
        UI.atualizarTudo();
        
        if (State.mes > 60) {
            setTimeout(() => { this.terminarJogoFinal(); }, 300);
            return;
        }
        
        if (Math.random() < 0.40) {
            const lista = DB.dilemas;
            const sorteado = lista[Math.floor(Math.random() * lista.length)];
            
            if (sorteado.tipo === 'imprevisto' && State.seguroAtivo) {
                State.seguroAtivo = false; 
                UI.notificar("Seguro Ativado", "O Millennium GO cobreu o teu imprevisto de forma gratuita!");
                return;
            }
            
            setTimeout(() => { UI.mostrarEvento(sorteado); }, 300);
        } else {
            UI.notificar("Novo Mês", `Avançaste para o Mês ${State.mes}. A tua mesada caiu na carteira!`);
        }
        
        this.verificarTrofeus();
    },

    processarAcaoEvento(custo, fel, soc) {
        if (custo < 0 && State.bolso < Math.abs(custo)) {
            UI.notificar("Insolvente", "Não tens dinheiro suficiente no bolso! Ficas de castigo (-Felicidade).");
            State.felicidade -= 25;
        } else {
            State.bolso += custo;
            State.felicidade += (fel || 0);
            State.social += (soc || 0);
        }
        
        this.limitarStatus();
        UI.esconderEvento(); 
        UI.atualizarTudo();
        this.verificarTrofeus();
    },

    desbloquearTrofeu(id) {
        if (!State.trofeus.includes(id)) {
            const trofeu = DB.trofeus.find(t => t.id === id);
            if (trofeu) {
                State.trofeus.push(id);
                UI.notificar("🏆 Novo Troféu!", `${trofeu.icon} ${trofeu.nome}`);
                UI.renderTrofeus();
            }
        }
    },

    limitarStatus() {
        if (State.felicidade > 100) State.felicidade = 100;
        if (State.felicidade < 0) State.felicidade = 0;
        if (State.social > 100) State.social = 100;
        if (State.social < 0) State.social = 0;
    },

    ajustarRendimentoPorIdade() {
        const idade = parseInt(document.getElementById("input-idade").value) || 15;
        const rec = document.getElementById("input-rendimento");
        const label = document.getElementById("label-rendimento-aviso");
        
        if (idade < 15) { 
            rec.max = 200; 
            rec.setAttribute('max', '200'); 
            label.innerText = "Mesada comum para esta idade."; 
        }
        else if (idade < 17) { 
            rec.max = 300; 
            rec.setAttribute('max', '300'); 
            label.innerText = "Mesada + Pequenos favores."; 
        }
        else { 
            rec.max = 400; 
            rec.setAttribute('max', '400'); 
            label.innerText = "Podes ter um Part-time leve."; 
        }
        
        if (parseInt(rec.value) > rec.max) rec.value = rec.max;
        document.getElementById("valor-rendimento").innerText = rec.value;
    },
    
    verificarTrofeus() {
        // Troféus Originais
        if (State.poupanca >= 100 && !State.trofeus.includes("poupador")) this.desbloquearTrofeu("poupador");
        if (State.poupanca >= 500 && !State.trofeus.includes("rico")) this.desbloquearTrofeu("rico");
        if (State.historicoObj.length >= 1 && !State.trofeus.includes("conquistador")) this.desbloquearTrofeu("conquistador");
        if (State.felicidade === 100 && State.social === 100 && !State.trofeus.includes("equilibrio")) this.desbloquearTrofeu("equilibrio");
        
        // Verificação dos 4 Novos Troféus
        if (State.trofeus.includes("txt_ligar_av0") && !State.trofeus.includes("familia_unida")) this.desbloquearTrofeu("familia_unida");
        if ((State.poupanca + State.bolso) >= 1000 && !State.trofeus.includes("capitalista")) this.desbloquearTrofeu("capitalista");
        if (State.totalChamadasFamilia >= 5 && !State.trofeus.includes("consumista")) this.desbloquearTrofeu("consumista");
        if (State.idade >= 18 && !State.trofeus.includes("independente")) this.desbloquearTrofeu("independente");
    },

    terminarJogoFinal() {
        const mensagem = `🎉 FIM DA SIMULAÇÃO! 🎉\n\nParabéns ${State.nome}!\n\n💰 Poupança Final: ${State.poupanca.toFixed(2)}€\n🎯 Objetivos Alcançados: ${State.historicoObj.length}\n📅 Meses Vividos: ${State.mes}\n🏆 Troféus: ${State.trofeus.length}/${DB.trofeus.length}`;
        
        UI.notificar("🎉 FIM!", `Terminaste com ${State.poupanca.toFixed(2)}€ e ${State.historicoObj.length} metas feitas!`);
        setTimeout(() => {
            if (confirm(mensagem + "\n\nQueres jogar de novo?")) {
                window.location.reload();
            }
        }, 1000);
    }
};

// Eventos globais de Input e Teclado sincronizados
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
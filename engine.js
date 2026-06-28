const Engine = {
    
    // Inicia o jogo e valida o setup inicial
    iniciarJogo(e) {
        if (e) e.preventDefault();
        
        const nomeInput = document.getElementById("input-nome");
        const idadeInput = document.getElementById("input-idade");
        const rendimentoInput = document.getElementById("input-rendimento");
        
        if (!nomeInput || !idadeInput || !rendimentoInput) {
            console.error("Erro: Elementos do DOM de configuração não encontrados.");
            return;
        }

        State.nome = nomeInput.value.trim() || "Jogador";
        State.idade = parseInt(idadeInput.value) || 15;
        State.receita = parseInt(rendimentoInput.value) || 0;
        
        const bancoSelecionado = document.querySelector('input[name="banco"]:checked');
        if (!bancoSelecionado) { 
            alert("Escolhe um banco primeiro!"); 
            return; 
        }
        
        State.bancoId = bancoSelecionado.value;
        State.bancoDados = DB.bancos.find(b => b.id === State.bancoId);
        
        if (!State.bancoDados) {
            alert("Erro ao carregar os dados do banco selecionado.");
            return;
        }
        
        // Configura saldos iniciais aplicando custos/bónus do banco escolhido
        State.bolso = State.bancoDados.bonus || 0;
        if (State.bancoDados.custo > 0) {
            State.bolso -= State.bancoDados.custo;
        }
        
        // Ativa o seguro especial do Millennium GO!
        if (State.bancoId === 'bcp') {
            State.seguroAtivo = true;
        }

        // Alterna os ecrãs visuais
        document.getElementById('screen-setup').classList.add('hidden');
        document.getElementById('screen-game').classList.remove('hidden');
        document.getElementById('ui-header-stats').classList.remove('hidden');
        
        // Configura o estado inicial da simulação
        State.objetivosAtivos = [{ id: Date.now(), nome: "Telemóvel Novo", preco: 300, icon: "📱" }];
        State.historicoObj = [];
        State.trofeus = [];
        State.mes = 1;
        State.poupanca = 0;
        State.felicidade = 100;
        State.social = 100;
        State.mesesSemGastar = 0;
        State.jogoTerminado = false;

        // Atualiza a interface completa
        UI.atualizarTudo();
        UI.renderLoja();
        UI.renderTrofeus();
        UI.notificar("Jogo Iniciado", `Bem-vindo ao teu futuro, ${State.nome}!`);
    },

    // Move valores entre o bolso e a poupança bancária
    transferirDinheiro(direcao, valor) {
        valor = parseFloat(valor);
        if (isNaN(valor) || valor <= 0) {
            UI.notificar("Erro", "Insere um valor válido superior a 0€.");
            return;
        }

        if (direcao === 'guardar') {
            if (State.bolso >= valor) {
                State.bolso -= valor;
                State.poupanca += valor;
                UI.notificar("Poupança", `Guardaste ${valor.toFixed(2)}€ na tua poupança!`);
            } else {
                UI.notificar("Dinheiro Insuficiente", "Não tens essa quantia no teu bolso.");
            }
        } else if (direcao === 'retirar') {
            if (State.poupanca >= valor) {
                State.poupanca -= valor;
                State.bolso += valor;
                UI.notificar("Banco", `Retiraste ${valor.toFixed(2)}€ para o teu bolso.`);
            } else {
                UI.notificar("Sem Saldo", "Não tens essa quantia na tua poupança.");
            }
        }
        UI.atualizarTudo();
    },

    // Processa a aquisição de um item da loja/lazer
    comprarItem(idItem) {
        if (State.jogoTerminado) return;

        const item = DB.loja.find(i => i.id === idItem);
        if (!item) return;

        if (State.idade < item.minIdade) {
            UI.notificar("Idade Insuficiente", `Precisas de ter pelo menos ${item.minIdade} anos.`);
            return;
        }

        if (State.bolso < item.preco) {
            UI.notificar("Sem Dinheiro", `Não tens dinheiro suficiente no bolso (${item.preco}€).`);
            return;
        }

        State.bolso -= item.preco;
        State.felicidade = Math.min(100, State.felicidade + item.fel);
        State.social = Math.min(100, State.social + item.soc);

        UI.notificar("Compra Efetuada", `Compraste ${item.icone} ${item.nome}!`);
        UI.atualizarTudo();
    },

    // Adiciona um novo objetivo financeiro customizado
    adicionarObjetivo() {
        const nomeEl = document.getElementById("obj-nome");
        const precoEl = document.getElementById("obj-preco");
        const iconEl = document.getElementById("obj-icon");

        if (!nomeEl || !precoEl || !iconEl) return;

        const nome = nomeEl.value.trim();
        const preco = parseFloat(precoEl.value);
        const icon = iconEl.value.trim() || "🎯";

        if (!nome || isNaN(preco) || preco <= 0) {
            alert("Preenche todos os campos corretamente!");
            return;
        }

        State.objetivosAtivos.push({
            id: Date.now(),
            nome: nome,
            preco: preco,
            icon: icon
        });

        nomeEl.value = "";
        precoEl.value = "";
        iconEl.value = "👟";
        
        UI.esconderModalObjetivo();
        UI.renderObjetivos();
        UI.notificar("Objetivo Adicionado", `Criaste o objetivo: ${nome}!`);
    },

    // Altera dinamicamente as regras do slider conforme a idade inserida
    ajustarRendimentoPorIdade() {
        const idadeInput = document.getElementById("input-idade");
        const rec = document.getElementById("input-rendimento");
        const label = document.getElementById("label-rendimento-info");

        if (!idadeInput || !rec || !label) return;

        const idade = parseInt(idadeInput.value) || 15;

        if (idade <= 15) {
            rec.max = 50;
            rec.setAttribute('max', '50');
            label.innerText = "Apenas pequenas mesadas ou tarefas domésticas.";
        } else if (idade <= 17) {
            rec.max = 150;
            rec.setAttribute('max', '150');
            label.innerText = "Podes fazer pequenos trabalhos de Verão ou favores.";
        } else {
            rec.max = 400;
            rec.setAttribute('max', '400');
            label.innerText = "Podes ter um Part-time leve.";
        }
        
        if (parseInt(rec.value) > rec.max) rec.value = rec.max;
        const valorDisplay = document.getElementById("valor-rendimento");
        if (valorDisplay) valorDisplay.innerText = rec.value;
    },

    // Valida e concede troféus de mérito
    verificarTrofeus() {
        if (State.poupanca >= 100 && !State.trofeus.includes("poupador")) this.desbloquearTrofeu("poupador");
        if (State.poupanca >= 500 && !State.trofeus.includes("rico")) this.desbloquearTrofeu("rico");
        if (State.historicoObj.length >= 1 && !State.trofeus.includes("conquistador")) this.desbloquearTrofeu("conquistador");
        if (State.felicidade === 100 && State.social === 100 && !State.trofeus.includes("equilibrio")) this.desbloquearTrofeu("equilibrio");
    },

    desbloquearTrofeu(idTrofeu) {
        State.trofeus.push(idTrofeu);
        UI.renderTrofeus();
        UI.notificar("🏆 Trofeu Desbloqueado!", `Ganhaste a insígnia: ${idTrofeu.toUpperCase()}`);
    },

    // ESTA FUNÇÃO FOI RENOMEADA PARA CASAR COM O TEU HTML!
    avancarMes() {
        if (State.jogoTerminado) return;

        // 1. Calcula juros da poupança
        if (State.poupanca > 0 && State.bancoDados) {
            const jurosGanhos = State.poupanca * State.bancoDados.juro;
            State.poupanca += jurosGanhos;
        }

        // 2. Adiciona o rendimento mensal ao bolso
        State.bolso += State.receita;

        // 3. Atualiza os contadores temporais e reduz status de bem-estar
        State.mes += 1;
        State.felicidade = Math.max(0, State.felicidade - 10);
        State.social = Math.max(0, State.social - 10);

        this.verificarTrofeus();

        // 4. Verifica o fim da simulação (12 meses)
        if (State.mes > 12) {
            this.terminarJogoFinal();
            return;
        }

        UI.atualizarTudo();

        // 5. Sorteia e dispara os dilemas cadastrados no db.js
        if (DB.dilemas && DB.dilemas.length > 0) {
            const dilemaAleatorio = DB.dilemas[Math.floor(Math.random() * DB.dilemas.length)];
            if (typeof UI.mostrarDilema === "function") {
                UI.mostrarDilema(dilemaAleatorio);
            }
        }
    },

    // Trata a escolha de opções dentro de um dilema ativo
    resolverDilema(custo, fel, soc) {
        // Mecânica de proteção de imprevistos do Millennium GO!
        if (custo < 0 && State.seguroAtivo) {
            custo = 0;
            State.seguroAtivo = false;
            UI.notificar("🛡️ Seguro Ativado", "O Millennium GO! cobriu o teu primeiro imprevisto!");
        }

        State.bolso += custo;
        State.felicidade = Math.max(0, Math.min(100, State.felicidade + fel));
        State.social = Math.max(0, Math.min(100, State.social + soc));

        if (typeof UI.esconderDilema === "function") {
            UI.esconderDilema();
        } else {
            const modal = document.getElementById("modal-dilema");
            if (modal) modal.classList.add("hidden");
        }

        UI.atualizarTudo();
    },

    // Finaliza a simulação e expõe o painel final
    terminarJogoFinal() {
        State.jogoTerminado = true;
        const mensagem = `🎉 FIM DA SIMULAÇÃO! 🎉\n\nParabéns ${State.nome}!\n\n💰 Poupança Final: ${State.poupanca.toFixed(2)}€\n🎯 Objetivos Alcançados: ${State.historicoObj.length}\n📅 Meses Vividos: ${State.mes - 1}\n🏆 Trofeus Desbloqueados: ${State.trofeus.length}`;
        alert(mensagem);
    }
};
const UI = {
    mudarAba(idAba) {
        document.querySelectorAll('.aba-conteudo').forEach(el => el.classList.add('hidden'));
        document.querySelectorAll('.tab-btn').forEach(el => {
            el.classList.remove('bg-blue-600', 'text-white', 'border-b-4', 'border-blue-800');
            el.classList.add('bg-white', 'text-slate-600', 'border-2');
        });
        
        const abaEl = document.getElementById(`aba-${idAba}`);
        if (abaEl) abaEl.classList.remove('hidden');
        
        const activeBtn = document.getElementById(`tab-${idAba}`);
        if (activeBtn) {
            activeBtn.classList.remove('bg-white', 'text-slate-600', 'border-2');
            activeBtn.classList.add('bg-blue-600', 'text-white', 'border-b-4', 'border-blue-800');
        }
        
        if (idAba === 'objetivos') this.renderObjetivos();
        if (idAba === 'trofeus') this.renderTrofeus();
        if (idAba === 'loja') {
            this.renderFiltros();
            this.renderLoja();
        }
    },

    atualizarTudo() {
        document.getElementById("ui-jogador-nome").innerText = State.nome;
        document.getElementById("ui-jogador-idade").innerText = `${State.idade} Anos`;
        document.getElementById("ui-mes-atual").innerText = State.mes;
        document.getElementById("ui-rodape-receita").innerText = `+${State.receita}€`;
        
        document.getElementById("ui-saldo").innerText = `${State.bolso.toFixed(2)} €`;
        document.getElementById("ui-poupanca").innerText = `${State.poupanca.toFixed(2)} €`;
        
        document.getElementById("ui-felicidade-texto").innerText = `${State.felicidade}%`;
        document.getElementById("ui-felicidade-barra").style.width = `${State.felicidade}%`;
        document.getElementById("ui-social-texto").innerText = `${State.social}%`;
        document.getElementById("ui-social-barra").style.width = `${State.social}%`;

        document.getElementById("ui-felicidade-barra").className = State.felicidade > 40 ? "bg-yellow-400 h-3 rounded-full transition-all" : "bg-red-500 h-3 rounded-full transition-all";
        
        const bannerSocial = document.getElementById("alerta-social-banner");
        if (State.social < 20) {
            bannerSocial.classList.remove("hidden");
            document.getElementById("ui-social-barra").className = "bg-red-500 h-3 rounded-full transition-all";
        } else {
            bannerSocial.classList.add("hidden");
            document.getElementById("ui-social-barra").className = "bg-purple-500 h-3 rounded-full transition-all";
        }

        if (State.bancoDados) {
            document.getElementById("ui-taxa-juro").innerText = `${(State.bancoDados.juro * 100).toFixed(1)}%`;
            document.getElementById("ui-previsao-juros").innerText = (State.poupanca * State.bancoDados.juro).toFixed(2);
        }
    },

    renderBancos() {
        const html = DB.bancos.map(b => `
            <label class="cursor-pointer group">
                <input type="radio" name="banco" value="${b.id}" class="peer sr-only">
                <div class="border-4 border-slate-200 rounded-2xl p-4 peer-checked:border-blue-600 peer-checked:bg-blue-50 transition-all card-solid flex flex-col h-full">
                    <div class="flex items-center gap-3 mb-2">
                        <div class="${b.cor} text-white w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm">
                            <i class="fa-solid ${b.icone}"></i>
                        </div>
                        <h4 class="font-black text-slate-800">${b.nome}</h4>
                    </div>
                    <p class="text-xs font-bold text-slate-500 leading-tight">${b.desc}</p>
                </div>
            </label>
        `).join('');
        document.getElementById("bancos-container").innerHTML = html;
    },

    renderFiltros() {
        const filtrosDiv = document.getElementById("loja-filtros");
        if (!filtrosDiv) return;
        const categorias = ["todos", "snacks", "digital", "moda", "saidas", "desporto", "extra"];
        filtrosDiv.innerHTML = categorias.map(cat => {
            const label = cat === "todos" ? "Todos" : cat.charAt(0).toUpperCase() + cat.slice(1);
            const active = State.categoriaAtual === cat;
            return `
                <button type="button" onclick="State.categoriaAtual='${cat}'; UI.renderLoja();" class="px-4 py-2 rounded-xl text-xs uppercase btn-solid font-bold ${active ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-800 hover:bg-slate-300'}">
                    ${label}
                </button>
            `;
        }).join('');
    },

    renderLoja() {
        const loja = document.getElementById("loja-produtos");
        if (!loja) return;
        loja.innerHTML = "";
        
        DB.loja.forEach(item => {
            if (State.idade < item.minIdade) return;
            if (State.categoriaAtual !== 'todos' && item.cat !== State.categoriaAtual) return;
            
            let precoTxt = `${item.preco}€`;
            let clickAction = `Engine.comprarItem(event, '${item.id}')`;

            if (item.id === 'livre') {
                precoTxt = "? €";
                clickAction = `UI.comprarLivre(event)`;
            } else if (State.bancoId === 'santander' && item.cat === 'digital') {
                precoTxt = `<span class="line-through text-slate-400 text-xs">${item.preco}€</span> ${(item.preco * 0.8).toFixed(1)}€`;
            }

            loja.innerHTML += `
                <button onclick="${clickAction}" class="bg-white p-4 rounded-2xl border-2 border-slate-200 card-solid flex flex-col items-center hover:bg-slate-50 btn-solid">
                    <span class="text-4xl mb-2">${item.icone || '❓'}</span>
                    <span class="font-black text-slate-800 leading-tight mb-1">${item.nome}</span>
                    <span class="text-xs font-bold text-slate-500 mb-2">${item.fel > 0 ? '+Fel' : ''} ${item.soc > 0 ? '& Soc' : ''}</span>
                    <span class="mt-auto bg-slate-100 text-slate-800 font-black px-3 py-1 rounded-lg w-full text-center">${precoTxt}</span>
                </button>
            `;
        });
    },

    comprarLivre(e) {
        const nome = prompt("O que compraste?");
        if(!nome) return;
        const preco = parseFloat(prompt(`Quanto custou ${nome}? (€)`));
        if(isNaN(preco) || preco <= 0) return;

        if(State.bolso >= preco) {
            State.bolso -= preco;
            const ganho = Math.min(Math.floor(preco * 0.5), 40);
            State.felicidade += ganho;
            Engine.limitarStatus();
            UI.flutuarTexto(e, `- ${preco}€`, "text-red-500");
            UI.atualizarTudo();
        } else {
            UI.notificar("Erro", "Saldo insuficiente no bolso.");
        }
    },

    renderObjetivos() {
        const list = document.getElementById("lista-objetivos");
        list.innerHTML = "";
        
        State.objetivosAtivos.forEach(obj => {
            const perc = Math.min((State.poupanca / obj.preco) * 100, 100);
            const isPronto = perc === 100;
            
            list.innerHTML += `
                <div class="bg-white border-2 border-slate-200 rounded-2xl p-5 relative card-solid">
                    <button onclick="Engine.removerObjetivo(${obj.id})" class="absolute top-2 right-2 text-slate-300 hover:text-red-500"><i class="fa-solid fa-times"></i></button>
                    <div class="flex items-center gap-3 mb-4">
                        <span class="text-4xl">${obj.icon}</span>
                        <div>
                            <h4 class="font-black text-slate-800 leading-tight">${obj.nome}</h4>
                            <span class="text-xs font-bold text-slate-500">Alvo: ${obj.preco.toFixed(2)}€</span>
                        </div>
                    </div>
                    <div class="w-full bg-slate-100 rounded-full h-3 mb-3">
                        <div class="bg-blue-500 h-3 rounded-full transition-all" style="width: ${perc}%"></div>
                    </div>
                    ${isPronto ? 
                        `<button onclick="Engine.comprarObjetivo(${obj.id})" class="w-full bg-emerald-500 hover:bg-emerald-400 text-white font-black py-2 rounded-xl btn-solid mt-2 animate-pulse">Adquirir Agora!</button>`
                        : `<p class="text-xs font-bold text-center text-slate-500 mt-2">Faltam ${(obj.preco - State.poupanca).toFixed(2)}€ no Banco</p>`
                    }
                </div>
            `;
        });
    },

    renderTrofeus() {
        const list = document.getElementById("lista-trofeus");
        if (!list) return;
        list.innerHTML = "";
        if (!DB.trofeus || DB.trofeus.length === 0) return;
        DB.trofeus.forEach(t => {
            const unlocked = State.trofeus.includes(t.id);
            list.innerHTML += `
                <div class="${unlocked ? 'bg-amber-50 border-amber-300' : 'bg-slate-50 border-slate-200 opacity-50 grayscale'} border-2 rounded-2xl p-4 text-center">
                    <span class="text-4xl block mb-2">${t.icon || t.icone || '🏆'}</span>
                    <h4 class="font-black text-slate-800 text-sm leading-tight mb-1">${t.nome}</h4>
                    <p class="text-[10px] font-bold text-slate-500">${t.desc}</p>
                </div>
            `;
        });
    },

    mostrarEvento(evento) {
        document.getElementById('evento-titulo').innerText = evento.titulo;
        document.getElementById('evento-desc').innerText = evento.desc;
        
        let icon = "⚠️";
        let bg = "bg-slate-800";
        if(evento.tipo === 'sorte') { icon = "🍀"; bg = "bg-emerald-600"; }
        
        document.getElementById('evento-icon').innerText = icon;
        document.getElementById('evento-header').className = `p-6 text-center text-white ${bg}`;

        const acoesDiv = document.getElementById('evento-acoes');
        acoesDiv.innerHTML = "";
        
        evento.acoes.forEach(a => {
            acoesDiv.innerHTML += `<button onclick="Engine.processarAcaoEvento(${a.custo}, ${a.fel || 0}, ${a.soc || 0})" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-black py-3 rounded-xl btn-solid">${a.txt}</button>`;
        });

        document.getElementById('modal-evento').classList.remove('hidden');
    },

    esconderEvento() { document.getElementById('modal-evento').classList.add('hidden'); },
    esconderEventos() { this.esconderEvento(); }, // Função de segurança para evitar quebras por digitação
    mostrarModalObjetivo() { document.getElementById('modal-objetivo').classList.remove('hidden'); },
    esconderModalObjetivo() { document.getElementById('modal-objetivo').classList.add('hidden'); },

    notificar(titulo, msg) {
        const toast = document.createElement('div');
        toast.className = 'bg-slate-800 text-white p-4 rounded-xl shadow-xl border-l-4 border-blue-500 toast-enter flex items-start gap-3 w-72';
        toast.innerHTML = `<i class="fa-solid fa-bell text-blue-400 mt-1"></i><div><h4 class="font-black text-sm">${titulo}</h4><p class="text-xs text-slate-300 mt-0.5">${msg}</p></div>`;
        document.getElementById('toast-container').appendChild(toast);
        setTimeout(() => { toast.classList.replace('toast-enter', 'toast-exit'); setTimeout(() => toast.remove(), 250); }, 4000);
    },

    flutuarTexto(e, txt, corClass) {
        try {
            const btn = e.target.closest('button');
            if (!btn) return;
            const rect = btn.getBoundingClientRect();
            const floater = document.createElement('div');
            floater.className = `fixed font-black text-2xl z-50 animate-float pointer-events-none drop-shadow-md ${corClass}`;
            floater.style.left = `${rect.left + rect.width / 2 - 20}px`;
            floater.style.top = `${rect.top}px`;
            floater.innerText = txt;
            document.body.appendChild(floater);
            setTimeout(() => floater.remove(), 800);
        } catch (err) {
            console.error("Erro no flutuarTexto:", err);
        }
    }
};
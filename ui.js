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
        // Elementos Básicos do Jogador
        if (document.getElementById("ui-jogador-nome")) {
            document.getElementById("ui-jogador-nome").innerText = State.nome || "Jogador";
        }
        if (document.getElementById("ui-jogador-idade")) {
            document.getElementById("ui-jogador-idade").innerText = `${State.idade} Anos`;
        }
        if (document.getElementById("ui-mes")) {
            document.getElementById("ui-mes").innerText = `Mês ${State.mes}`;
        }

        // Saldos e Rendimentos
        if (document.getElementById("ui-bolso")) {
            document.getElementById("ui-bolso").innerText = `${State.bolso.toFixed(2)}€`;
        }
        if (document.getElementById("ui-poupanca")) {
            document.getElementById("ui-poupanca").innerText = `${State.poupanca.toFixed(2)}€`;
        }
        if (document.getElementById("ui-rendimento")) {
            document.getElementById("ui-rendimento").innerText = `${State.receita.toFixed(2)}€/mês`;
        }

        // Barras de Estado (Felicidade e Social)
        this.atualizarBarraProgresso("barra-felicidade", "txt-felicidade", State.felicidade);
        this.atualizarBarraProgresso("barra-social", "txt-social", State.social);

        // Atualizar as abas se estiverem visíveis
        const abaObjetivos = document.getElementById("aba-objetivos");
        if (abaObjetivos && !abaObjetivos.classList.contains("hidden")) {
            this.renderObjetivos();
        }
    },

    atualizarBarraProgresso(idBarra, idTexto, valor) {
        const barra = document.getElementById(idBarra);
        const texto = document.getElementById(idTexto);
        if (barra) barra.style.width = `${valor}%`;
        if (texto) texto.innerText = `${valor}%`;
    },

    renderFiltros() {
        const container = document.getElementById("loja-filtros");
        if (!container) return;

        const categorias = [
            { id: "todos", nome: "Todos", icone: "fa-th-large" },
            { id: "utilitarios", nome: "Utilitários", icone: "fa-wrench" },
            { id: "saude", nome: "Saúde & Desporto", icone: "fa-heartbeat" },
            { id: "lazer", nome: "Lazer & Saídas", icone: "fa-gamepad" }
        ];

        container.innerHTML = categorias.map(cat => {
            const ativo = State.categoriaAtual === cat.id;
            const classeBtn = ativo 
                ? "bg-blue-600 text-white border-b-4 border-blue-800 font-black" 
                : "bg-white text-slate-600 border-2 border-slate-200 font-bold hover:bg-slate-50";

            return `
                <button onclick=\"State.categoriaAtual = '${cat.id}'; UI.renderFiltros(); UI.renderLoja();\" 
                        class=\"px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all duration-700 ${classeBtn}\">
                    <i class=\"fa-solid ${cat.icone}\"></i> ${cat.nome}
                </button>
            `;
        }).join("");
    },

    renderLoja() {
        const container = document.getElementById("loja-itens");
        if (!container) return;

        let itens = DB.loja || [];
        if (State.categoriaAtual !== "todos") {
            itens = itens.filter(item => item.cat === State.categoriaAtual);
        }

        if (itens.length === 0) {
            container.innerHTML = `<p class="col-span-full text-center text-slate-400 font-bold py-8">Nenhum item disponível nesta categoria.</p>`;
            return;
        }

        container.innerHTML = itens.map(item => {
            const bloqueado = State.idade < item.minIdade;
            
            if (bloqueado) {
                return `
                    <div class="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center opacity-60">
                        <span class="text-3xl mb-2">🔒</span>
                        <h4 class="font-black text-slate-700 text-sm">${item.nome}</h4>
                        <p class="text-[11px] font-extrabold text-red-500 uppercase tracking-wider mt-1">Disponível aos ${item.minIdade} anos</p>
                    </div>
                `;
            }

            return `
                <div class="bg-white border-2 border-slate-100 rounded-2xl p-5 card-solid flex flex-col justify-between transition-all duration-300">
                    <div class="flex justify-between items-start">
                        <span class="text-3xl bg-slate-50 p-2.5 rounded-xl">${item.icone || "📦"}</span>
                        <span class="bg-blue-50 text-blue-700 font-black text-sm px-3 py-1 rounded-xl">${item.preco}€</span>
                    </div>
                    <div class="mt-4">
                        <h4 class="font-black text-slate-800 text-sm">${item.nome}</h4>
                        <div class="flex gap-2 mt-2">
                            ${item.fel > 0 ? `<span class="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-md">😊 +${item.fel} Felicidade</span>` : ""}
                            ${item.soc > 0 ? `<span class="text-[10px] bg-purple-50 text-purple-700 font-black px-2 py-0.5 rounded-md">👥 +${item.soc} Social</span>` : ""}
                        </div>
                    </div>
                    <button onclick="Engine.comprarItem('${item.id}', event)" 
                            class="w-full mt-4 bg-slate-800 hover:bg-slate-700 text-white font-black py-2.5 rounded-xl btn-solid text-xs uppercase tracking-wider border-b-4 border-slate-950">
                        Comprar
                    </button>
                </div>
            `;
        }).join("");
    },

    renderObjetivos() {
        const container = document.getElementById("lista-objetivos");
        if (!container) return;

        if (State.objetivosAtivos.length === 0) {
            container.innerHTML = `<p class="text-center text-slate-400 font-bold py-6">Não tens nenhum objetivo definido de momento.</p>`;
            return;
        }

        container.innerHTML = State.objetivosAtivos.map(obj => {
            const progresso = Math.min((State.poupanca / obj.preco) * 100, 100);
            return `
                <div class="bg-white border-2 border-slate-100 rounded-2xl p-5 card-solid space-y-4">
                    <div class="flex justify-between items-center">
                        <div class="flex items-center gap-3">
                            <span class="text-2xl bg-slate-50 p-2 rounded-xl">${obj.icon || "🎯"}</span>
                            <div>
                                <h4 class="font-black text-slate-800 text-sm">${obj.nome}</h4>
                                <p class="text-xs text-slate-400 font-bold">Meta: <span class="text-slate-700 font-black">${obj.preco}€</span></p>
                            </div>
                        </div>
                        <button onclick="Engine.alcancarObjetivo(${obj.id})" 
                                ${State.poupanca < obj.preco ? "disabled" : ""} 
                                class="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black px-4 py-2.5 rounded-xl btn-solid border-b-4 border-emerald-800 disabled:opacity-40 disabled:pointer-events-none uppercase tracking-wider">
                            Alcançar
                        </button>
                    </div>
                    <div class="space-y-1">
                        <div class="flex justify-between text-[11px] font-black text-slate-500">
                            <span>Progresso do Mealheiro</span>
                            <span>${progresso.toFixed(0)}%</span>
                        </div>
                        <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden border">
                            <div class="bg-emerald-500 h-full transition-all duration-500" style="width: ${progresso}%"></div>
                        </div>
                    </div>
                </div>
            `;
        }).join("");
    },

    renderTrofeus() {
        const container = document.getElementById("lista-trofeus");
        if (!container) return;

        const todosTrofeus = [
            { id: "poupador", nome: "Poupador Iniciante", desc: "Alcança 100€ na Conta Poupança.", icone: "🥉" },
            { id: "rico", nome: "Futuro Investidor", desc: "Alcança 500€ na Conta Poupança.", icone: "🥈" },
            { id: "conquistador", nome: "Focado em Metas", desc: "Completa com sucesso o teu primeiro Objetivo Pessoal.", icone: "🥇" },
            { id: "equilibrio", nome: "Mestre do Equilíbrio", desc: "Fica com 100% de Felicidade e 100% de Vida Social ao mesmo tempo.", icone: "🏆" }
        ];

        container.innerHTML = todosTrofeus.map(trf => {
            const desbloqueado = State.trofeus.includes(trf.id);
            return `
                <div class="border-2 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${desbloqueado ? 'bg-white border-slate-100 card-solid' : 'bg-slate-50/50 border-dashed border-slate-200 opacity-50'}">
                    <span class="text-4xl filter ${desbloqueado ? '' : 'grayscale'}">${trf.icone}</span>
                    <div>
                        <h4 class="font-black text-sm ${desbloqueado ? 'text-slate-800' : 'text-slate-400'}">${trf.nome}</h4>
                        <p class="text-xs text-slate-400 font-bold mt-0.5">${trf.desc}</p>
                        ${desbloqueado ? '<span class="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mt-1 inline-block uppercase tracking-wider">Desbloqueado</span>' : '<span class="text-[10px] font-black text-slate-400 uppercase tracking-wider mt-1 inline-block">Bloqueado</span>'}
                    </div>
                </div>
            `;
        }).join("");
    },

    renderBancos() {
        const container = document.getElementById("bancos-container");
        if (!container) return;

        const bancos = DB.bancos || [];
        container.innerHTML = bancos.map(b => `
            <label class="relative bg-white border-2 border-slate-200 p-4 rounded-2xl card-solid cursor-pointer flex flex-col justify-between transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:ring-2 has-[:checked]:ring-blue-100 group">
                <input type="radio" name="banco" value="${b.id}" class="sr-only" onchange="Engine.ajustarRendimentoPorIdade()">
                <div class="flex items-start justify-between">
                    <div class="flex items-center gap-3">
                        <div class="w-10 h-10 ${b.cor} text-white flex items-center justify-center rounded-xl text-lg shadow-sm">
                            <i class="fa-solid ${b.icone}"></i>
                        </div>
                        <div>
                            <h4 class="font-black text-slate-800 text-sm">${b.nome}</h4>
                            <p class="text-[10px] font-extrabold text-blue-600 uppercase tracking-wider mt-0.5">${(b.juro * 100).toFixed(1)}% Juro Base</p>
                        </div>
                    </div>
                    <button type="button" onclick="UI.mostrarModalBanco('${b.id}', event)" class="text-slate-400 hover:text-blue-500 p-1 rounded-lg transition-colors">
                        <i class="fa-solid fa-circle-info text-lg"></i>
                    </button>
                </div>
            </label>
        `).join("");
    },

    mostrarModalBanco(idBanco, event) {
        if (event) {
            event.preventDefault();
            event.stopPropagation();
        }
        
        const banco = DB.bancos.find(b => b.id === idBanco);
        if (!banco) return;

        document.getElementById("modal-banco-nome").innerText = banco.nome;
        document.getElementById("modal-banco-juro").innerText = `${(banco.juro * 100).toFixed(1)}% TANB`;
        document.getElementById("modal-banco-bonus").innerText = `${banco.bonus}€`;
        document.getElementById("modal-banco-custo").innerText = `${banco.custo}€`;
        document.getElementById("modal-banco-cartao").innerText = banco.cartao || "Débito Normal";

        const ulVantagens = document.getElementById("modal-banco-vantagens");
        const ulDesvantagens = document.getElementById("modal-banco-desvantagens");

        ulVantagens.innerHTML = (banco.vantagens || []).map(v => `<li>${v}</li>`).join("");
        ulDesvantagens.innerHTML = (banco.desdesvantagens || banco.desvantagens || []).map(d => `<li>${d}</li>`).join("");

        document.getElementById("modal-banco").classList.remove("hidden");
    },

    esconderModalBanco() {
        document.getElementById("modal-banco").classList.add("hidden");
    },

    mostrarModalObjetivo() { 
        document.getElementById("modal-objetivo").classList.remove("hidden"); 
    },
    
    esconderModalObjetivo() { 
        document.getElementById("modal-objetivo").classList.add("hidden"); 
    },

    notificar(titulo, msg) {
        const toast = document.createElement('div');
        toast.className = 'bg-slate-800 text-white p-4 rounded-xl shadow-xl border-l-4 border-blue-500 toast-enter flex items-start gap-3 w-72';
        toast.innerHTML = `<i class="fa-solid fa-bell text-blue-400 mt-1"></i><div><h4 class="font-black text-sm">${titulo}</h4><p class="text-xs text-slate-300 mt-0.5">${msg}</p></div>`;
        
        const container = document.getElementById('toast-container');
        if (container) {
            container.appendChild(toast);
            setTimeout(() => { 
                toast.classList.replace('toast-enter', 'toast-exit'); 
                setTimeout(() => toast.remove(), 250); 
            }, 4000);
        }
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
            console.error("Erro no efeito flutuante:", err);
        }
    }
};
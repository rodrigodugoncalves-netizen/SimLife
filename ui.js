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
        if (document.getElementById("ui-jogador-nome")) {
            document.getElementById("ui-jogador-nome").innerText = State.nome || "Jogador";
        }
        if (document.getElementById("ui-jogador-idade")) {
            document.getElementById("ui-jogador-idade").innerText = `${State.idade} Anos`;
        }
        if (document.getElementById("ui-mes-atual")) {
            document.getElementById("ui-mes-atual").innerText = `Mês ${State.mes}`;
        }
        if (document.getElementById("ui-saldo")) {
            document.getElementById("ui-saldo").innerText = `${State.bolso.toFixed(2)} €`;
        }
        if (document.getElementById("ui-bolso-header")) {
            document.getElementById("ui-bolso-header").innerText = `${State.bolso.toFixed(2)}€`;
        }
        if (document.getElementById("ui-poupanca")) {
            document.getElementById("ui-poupanca").innerText = `${State.poupanca.toFixed(2)} €`;
        }
        if (document.getElementById("ui-poupanca-header")) {
            document.getElementById("ui-poupanca-header").innerText = `${State.poupanca.toFixed(2)}€`;
        }
        if (document.getElementById("ui-rodape-receita")) {
            document.getElementById("ui-rodape-receita").innerText = `+${State.receita}€`;
        }

        this.atualizarBarraProgresso("ui-felicidade-barra", "ui-felicidade-texto", State.felicidade);
        this.atualizarBarraProgresso("ui-social-barra", "ui-social-texto", State.social);

        if (State.bancoDados) {
            if (document.getElementById("ui-taxa-juro")) {
                document.getElementById("ui-taxa-juro").innerText = `${(State.bancoDados.juro * 100).toFixed(1)}%`;
            }
            if (document.getElementById("ui-previsao-juros")) {
                document.getElementById("ui-previsao-juros").innerText = (State.poupanca * State.bancoDados.juro).toFixed(2);
            }
        }

        const bannerSocial = document.getElementById("alerta-social-banner");
        if (bannerSocial) {
            if (State.social < 20) bannerSocial.classList.remove("hidden");
            else bannerSocial.classList.add("hidden");
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
            { id: "alimentacao", nome: "Alimentação", icone: "fa-utensils" },
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
                <button onclick="State.categoriaAtual = '${cat.id}'; UI.renderFiltros(); UI.renderLoja();" 
                        class="px-4 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all duration-200 ${classeBtn}">
                    <i class="fa-solid ${cat.icone}"></i> ${cat.nome}
                </button>
            `;
        }).join("");
    },

    renderLoja() {
        const container = document.getElementById("loja-produtos");
        if (!container) return;

        let itens = DB.produtos || [];
        if (State.categoriaAtual !== "todos") {
            itens = itens.filter(item => item.cat === State.categoriaAtual);
        }

        if (itens.length === 0) {
            container.innerHTML = `<p class="col-span-full text-center text-slate-400 font-bold py-8">Nenhum item disponível nesta categoria.</p>`;
            return;
        }

        container.innerHTML = itens.map(item => {
            const idadeLimite = item.minIdade || 13;
            const isBloqueado = State.idade < idadeLimite;
            
            if (isBloqueado) {
                return `
                    <div class="bg-slate-100 border-2 border-dashed border-slate-200 rounded-2xl p-5 flex flex-col items-center justify-center text-center opacity-60">
                        <span class="text-3xl mb-2">🔒</span>
                        <h4 class="font-black text-slate-700 text-sm">${item.nome}</h4>
                        <p class="text-[11px] font-extrabold text-red-500 uppercase tracking-wider mt-1">Disponível aos ${idadeLimite} anos</p>
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
                        <div class="flex flex-wrap gap-1 mt-2">
                            ${item.fel > 0 ? `<span class="text-[10px] bg-emerald-50 text-emerald-700 font-black px-2 py-0.5 rounded-md">😊 +${item.fel} Fel</span>` : ""}
                            ${item.soc > 0 ? `<span class="text-[10px] bg-purple-50 text-purple-700 font-black px-2 py-0.5 rounded-md">👥 +${item.soc} Soc</span>` : ""}
                        </div>
                    </div>
                    <button onclick="Engine.comprarItem(event, '${item.id}')" 
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
                        <button onclick="Engine.comprarObjetivo(${obj.id})" 
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

        container.innerHTML = DB.trofeus.map(trf => {
            const desbloqueado = State.trofeus.includes(trf.id);
            return `
                <div class="border-2 rounded-2xl p-4 flex items-center gap-4 transition-all duration-300 ${desbloqueado ? 'bg-white border-slate-100 card-solid' : 'bg-slate-50/50 border-dashed border-slate-200 opacity-50'}">
                    <span class="text-4xl filter ${desbloqueado ? '' : 'grayscale'}">${trf.icon}</span>
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
        container.innerHTML = bancos.map(b => {
            const vantagensLista = (b.vantagens || []).map(v => `
                <li class="flex items-start gap-1.5 text-slate-600">
                    <i class="fa-solid fa-check text-emerald-500 text-[10px] mt-1 shrink-0"></i>
                    <span>${v}</span>
                </li>
            `).join("");

            const desvantagensLista = (b.desvantagens || []).map(d => `
                <li class="flex items-start gap-1.5 text-slate-600">
                    <i class="fa-solid fa-xmark text-rose-500 text-[10px] mt-1 shrink-0"></i>
                    <span>${d}</span>
                </li>
            `).join("");

            return `
                <label class="relative bg-white border-2 border-slate-200 p-5 rounded-2xl card-solid cursor-pointer flex flex-col gap-4 transition-all duration-200 has-[:checked]:border-blue-500 has-[:checked]:ring-2 has-[:checked]:ring-blue-100 group">
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
                    </div>

                    <div class="border-t border-slate-100 pt-3 flex flex-col gap-3 text-[11px] font-medium leading-relaxed">
                        <div>
                            <span class="font-black text-emerald-600 uppercase tracking-wider text-[9px] block mb-1">Vantagens:</span>
                            <ul class="space-y-1">${vantagensLista}</ul>
                        </div>
                        <div>
                            <span class="font-black text-rose-600 uppercase tracking-wider text-[9px] block mb-1">Desvantagens:</span>
                            <ul class="space-y-1">${desvantagensLista}</ul>
                        </div>
                    </div>
                </label>
            `;
        }).join("");
    },

    mostrarModalObjetivo() { 
        document.getElementById("modal-objective")?.classList.remove("hidden"); // Adaptado caso precises
        document.getElementById("modal-objetivo")?.classList.remove("hidden"); 
    },
    
    esconderModalObjetivo() { 
        document.getElementById("modal-objective")?.classList.add("hidden");
        document.getElementById("modal-objetivo")?.classList.add("hidden"); 
    },

    mostrarEvento(dilema) {
        document.getElementById("evento-titulo").innerText = dilema.titulo;
        document.getElementById("evento-desc").innerText = dilema.desc;
        
        const containerAcoes = document.getElementById("evento-acoes");
        containerAcoes.innerHTML = dilema.acoes.map(acao => `
            <button onclick="Engine.processarAcaoEvento(${acao.custo}, ${acao.fel || 0}, ${acao.soc || 0})" 
                    class="w-full bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold py-3 px-4 rounded-xl text-sm border-2 border-slate-300 transition-colors">
                ${acao.txt}
            </button>
        `).join("");
        
        document.getElementById("modal-evento").classList.remove("hidden");
    },

    esconderEvento() {
        document.getElementById("modal-evento").classList.add("hidden");
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
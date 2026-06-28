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
        document.getElementById("ui-mes").innerText = `Mês ${State.mes}`;
        document.getElementById("ui-bolso").innerText = `${State.bolso.toFixed(2)}€`;
        document.getElementById("ui-poupanca").innerText = `${State.poupanca.toFixed(2)}€`;
        document.getElementById("ui-receita").innerText = `${State.receita}€`;
        
        document.getElementById("ui-felicidade").innerText = `${State.felicidade}%`;
        document.getElementById("bar-felicidade").style.width = `${State.felicidade}%`;
        
        document.getElementById("ui-social").innerText = `${State.social}%`;
        document.getElementById("bar-social").style.width = `${State.social}%`;
        
        if (State.bancoDados) {
            document.getElementById("ui-nome-banco").innerText = State.bancoDados.nome;
            document.getElementById("ui-taxa-banco").innerText = `${(State.bancoDados.juro * 100).toFixed(1)}%`;
        }
        
        this.renderObjetivos();
    },

    renderBancos() {
        const html = DB.bancos.map(b => `
            <div class="border-4 border-slate-200 rounded-2xl p-4 transition-all card-solid flex flex-col relative bg-white">
                <label class="cursor-pointer group flex-grow flex flex-col">
                    <input type="radio" name="banco" value="${b.id}" class="peer sr-only">
                    <div class="absolute inset-0 border-4 border-transparent rounded-2xl peer-checked:border-blue-600 peer-checked:bg-blue-50/30 pointer-events-none transition-all"></div>
                    
                    <div class="flex items-center gap-3 mb-2 z-10">
                        <div class="${b.cor} text-white w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm">
                            <i class="fa-solid ${b.icone}"></i>
                        </div>
                        <div>
                            <h4 class="font-black text-slate-800">${b.nome}</h4>
                            <span class="text-[10px] font-extrabold text-slate-400 uppercase bg-slate-100 px-2 py-0.5 rounded">${b.cartao || 'Conta Jovem'}</span>
                        </div>
                    </div>
                </label>

                <div class="mt-3 z-10">
                    <button type="button" onclick="UI.toggleVantagens('${b.id}')" class="text-xs font-black text-blue-600 hover:text-blue-500 flex items-center gap-1 focus:outline-none bg-blue-50 px-3 py-1.5 rounded-lg w-full justify-center border border-blue-200">
                        <i id="banco-seta-${b.id}" class="fa-solid fa-chevron-down transition-transform"></i> Ver Vantagens e Detalhes
                    </button>
                </div>

                <div id="banco-detalhes-${b.id}" class="hidden mt-4 pt-3 border-t-2 border-dashed border-slate-200 space-y-3 z-10">
                    <div>
                        <h5 class="text-[10px] font-black text-emerald-600 uppercase tracking-wider mb-1"><i class="fa-solid fa-circle-check"></i> Vantagens:</h5>
                        <ul class="text-xs text-slate-600 font-bold space-y-1 list-disc pl-4">
                            ${b.vantagens ? b.vantagens.map(v => `<li>${v}</li>`).join('') : '<li>Vantagens gerais de conta digital.</li>'}
                        </ul>
                    </div>
                    <div>
                        <h5 class="text-[10px] font-black text-red-500 uppercase tracking-wider mb-1"><i class="fa-solid fa-circle-xmark"></i> Desvantagens:</h5>
                        <ul class="text-xs text-slate-600 font-bold space-y-1 list-disc pl-4">
                            ${b.desvantagens ? b.desvantagens.map(d => `<li>${d}</li>`).join('') : '<li>Rentabilidade sujeita às taxas de mercado.</li>'}
                        </ul>
                    </div>
                </div>
            </div>
        `).join('');
        document.getElementById("bancos-container").innerHTML = html;
    },

    toggleVantagens(bancoId) {
        const painel = document.getElementById(`banco-detalhes-${bancoId}`);
        const seta = document.getElementById(`banco-seta-${bancoId}`);
        
        if (painel.classList.contains('hidden')) {
            painel.classList.remove('hidden');
            seta.classList.add('rotate-180');
        } else {
            painel.classList.add('hidden');
            seta.classList.remove('rotate-180');
        }
    },

    renderFiltros() {
        const categorias = { "todos": "Todos", "comida": "Comida", "desporto": "Desporto", "moda": "Moda", "saidas": "Saídas" };
        let html = "";
        for (let key in categorias) {
            const ativo = State.categoriaAtual === key;
            html += `
                <button onclick="UI.filtrarLoja('${key}')" class="px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border-2 ${
                    ativo 
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md' 
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }">
                    ${categorias[key]}
                </button>
            `;
        }
        document.getElementById("loja-filtros").innerHTML = html;
    },

    filtrarLoja(cat) {
        State.categoriaAtual = cat;
        this.renderFiltros();
        this.renderLoja();
    },

    renderLoja() {
        const itensFiltrados = DB.loja.filter(item => State.categoriaAtual === "todos" || item.cat === State.categoriaAtual);
        
        if(itensFiltrados.length === 0) {
            document.getElementById("loja-container").innerHTML = `<div class="col-span-full text-center py-8 font-extrabold text-slate-400 text-sm">Nenhum item disponível nesta categoria.</div>`;
            return;
        }

        const html = itensFiltrados.map(item => {
            const minIdadeOk = State.idade >= (item.minIdade || 0);
            return `
                <div class="border-4 border-slate-200 rounded-2xl p-4 bg-white flex flex-col justify-between card-solid relative overflow-hidden ${!minIdadeOk ? 'opacity-50' : ''}">
                    <div>
                        <div class="flex items-center gap-3 mb-2">
                            <div class="bg-amber-100 text-amber-600 w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-sm font-sans">
                                ${item.icone}
                            </div>
                            <div>
                                <h4 class="font-black text-slate-800">${item.nome}</h4>
                                <span class="text-xs font-black text-amber-500">${item.preco}€</span>
                            </div>
                        </div>
                        <p class="text-[11px] text-slate-500 font-bold leading-relaxed mb-4">
                            Regenera: <span class="text-emerald-600">+${item.fel} Felicidade</span> e <span class="text-blue-600">+${item.soc} Social</span>.
                        </p>
                    </div>
                    ${minIdadeOk ? `
                        <button onclick="Engine.comprarLoja('${item.id}', event)" class="w-full bg-amber-500 hover:bg-amber-400 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md border-b-4 border-amber-700 active:translate-y-0.5 btn-solid">
                            Comprar
                        </button>
                    ` : `
                        <div class="w-full bg-slate-100 text-slate-400 py-2 rounded-xl text-xs font-black uppercase tracking-wider text-center border-2 border-slate-200 cursor-not-allowed">
                            <i class="fa-solid fa-lock text-[10px]"></i> Requer ${item.minIdade} Anos
                        </div>
                    `}
                </div>
            `;
        }).join('');
        document.getElementById("loja-container").innerHTML = html;
    },

    renderObjetivos() {
        if (State.objetivosAtivos.length === 0) {
            document.getElementById("objetivos-container").innerHTML = `
                <div class="text-center py-8 border-4 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                    <p class="text-slate-400 font-extrabold text-xs">Não tens nenhum objective definido.</p>
                </div>
            `;
            return;
        }

        const html = State.objetivosAtivos.map(obj => {
            const progresso = Math.min((State.poupanca / obj.preco) * 100, 100);
            const alcancado = State.poupanca >= obj.preco;
            
            return `
                <div class="border-4 border-slate-200 rounded-2xl p-4 bg-white card-solid flex flex-col justify-between relative">
                    <div>
                        <div class="flex justify-between items-start mb-3">
                            <div class="flex items-center gap-3">
                                <div class="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl font-sans shadow-sm">
                                    ${obj.icon}
                                </div>
                                <div>
                                    <h4 class="font-black text-slate-800 text-sm leading-tight">${obj.nome}</h4>
                                    <p class="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mt-0.5">Alvo: ${obj.preco}€</p>
                                </div>
                            </div>
                            <button onclick="Engine.removerObjetivo(${obj.id})" class="text-slate-300 hover:text-red-500 transition-colors p-1">
                                <i class="fa-solid fa-trash-can text-xs"></i>
                            </button>
                        </div>
                        
                        <div class="mb-4">
                            <div class="flex justify-between text-[10px] font-black text-slate-500 mb-1">
                                <span>PROGRESSO</span>
                                <span>${progresso.toFixed(0)}%</span>
                            </div>
                            <div class="w-full bg-slate-100 h-3 rounded-full overflow-hidden p-0.5 border border-slate-200">
                                <div class="bg-blue-500 h-full rounded-full transition-all duration-500" style="width: ${progresso}%"></div>
                            </div>
                        </div>
                    </div>

                    <button 
                        onclick="Engine.completarObjetivo(${obj.id})"
                        ${!alcancado ? 'disabled' : ''}
                        class="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all ${
                            alcancado 
                            ? 'bg-emerald-500 hover:bg-emerald-400 text-white border-b-4 border-emerald-700 btn-solid active:translate-y-0.5' 
                            : 'bg-slate-100 text-slate-400 border-2 border-slate-200 cursor-not-allowed shadow-none'
                        }"
                    >
                        ${alcancado ? '🎯 Alcançar Objetivo!' : `Faltam ${(obj.preco - State.poupanca).toFixed(2)}€`}
                    </button>
                </div>
            `;
        }).join('');
        document.getElementById("objetivos-container").innerHTML = html;
    },

    renderTrofeus() {
        const html = DB.trofeus.map(t => {
            const ganho = State.trofeus.includes(t.id);
            return `
                <div class="flex items-center gap-3 p-3 rounded-xl border-2 transition-all ${ganho ? 'border-amber-400 bg-amber-50/40 shadow-sm' : 'border-slate-150 bg-slate-50/50 opacity-60'}">
                    <div class="text-2xl ${ganho ? 'text-amber-500 animate-pulse' : 'text-slate-300'}">
                        <i class="fa-solid fa-trophy"></i>
                    </div>
                    <div>
                        <h4 class="text-xs font-black text-slate-800">${t.nome}</h4>
                        <p class="text-[10px] text-slate-500 font-bold mt-0.5">${t.desc}</p>
                    </div>
                </div>
            `;
        }).join('');
        document.getElementById("trofeus-container").innerHTML = html;
    },

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
        } catch (err) { console.log(err); }
    }
};
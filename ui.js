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
        document.getElementById("ui-mes").innerText = State.mes;
        document.getElementById("ui-bolso").innerText = `${State.bolso.toFixed(2)}€`;
        document.getElementById("ui-poupanca").innerText = `${State.poupanca.toFixed(2)}€`;
        
        const barraFel = document.getElementById("barra-felicidade");
        barraFel.style.width = `${State.felicidade}%`;
        barraFel.innerText = `${State.felicidade}%`;
        
        const barraSoc = document.getElementById("barra-social");
        barraSoc.style.width = `${State.social}%`;
        barraSoc.innerText = `${State.social}%`;
        
        if (State.bancoDados) {
            document.getElementById("ui-banco-nome").innerText = State.bancoDados.nome;
            document.getElementById("ui-banco-icone").className = `fa-solid ${State.bancoDados.icone} text-lg text-white`;
            const wrapper = document.getElementById("ui-banco-icone-wrapper");
            wrapper.className = `w-10 h-10 rounded-xl flex items-center justify-center shadow-md ${State.bancoDados.cor}`;
        }
    },

    renderBancos() {
        const container = document.getElementById("container-bancos");
        if (!container) return;
        container.innerHTML = "";
        
        DB.bancos.forEach(banco => {
            const div = document.createElement("div");
            div.className = "bg-white p-4 rounded-xl border-2 border-slate-200 hover:border-blue-500 transition-all flex flex-col justify-between card-solid cursor-pointer relative has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50/30";
            div.innerHTML = `
                <input type="radio" name="banco" value="${banco.id}" id="banco-${banco.id}" class="absolute top-4 right-4 accent-blue-600 w-4 h-4 cursor-pointer">
                <label for="banco-${banco.id}" class="block cursor-pointer h-full flex flex-col justify-between">
                    <div>
                        <div class="flex items-center gap-3 mb-3">
                            <div class="w-10 h-10 ${banco.cor} rounded-xl flex items-center justify-center text-white shadow-md">
                                <i class="fa-solid ${banco.icone} text-lg"></i>
                            </div>
                            <div>
                                <h3 class="font-black text-sm text-slate-800">${banco.nome}</h3>
                                <p class="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">${banco.cartao || 'Conta Jovem'}</p>
                            </div>
                        </div>
                        <p class="text-xs text-slate-500 font-bold leading-relaxed mb-4">${banco.desc}</p>
                    </div>
                    <button type="button" onclick="event.stopPropagation(); UI.mostrarModalBanco('${banco.id}')" class="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-black py-2 rounded-xl text-xs uppercase tracking-wider transition-all border-b-2 border-slate-300 active:translate-y-0.5">
                        <i class="fa-solid fa-magnifying-glass-chart mr-1"></i> Analisar Detalhes
                    </button>
                </label>
            `;
            container.appendChild(div);
        });
    },

    mostrarModalBanco(idBanco) {
        const banco = DB.bancos.find(b => b.id === idBanco);
        if (!banco) return;
        
        document.getElementById("modal-banco-nome").innerText = banco.nome;
        document.getElementById("modal-banco-cartao").innerText = banco.cartao || "Conta Jovem";
        document.getElementById("modal-banco-icone").className = `fa-solid ${banco.icone} text-xl`;
        document.getElementById("modal-banco-icone-wrapper").className = `w-12 h-12 ${banco.cor} text-white rounded-2xl flex items-center justify-center shadow-lg`;
        
        const listaVantagens = document.getElementById("modal-banco-vantagens");
        listaVantagens.innerHTML = banco.vantagens.map(v => `<li>${v}</li>`).join('');
        
        const listaDesvantagens = document.getElementById("modal-banco-desvantagens");
        listaDesvantagens.innerHTML = banco.desvantagens.map(d => `<li>${d}</li>`).join('');
        
        document.getElementById("modal-banco").classList.remove("hidden");
    },

    esconderModalBanco() {
        document.getElementById("modal-banco").classList.add("hidden");
    },

    renderFiltros() {
        const container = document.getElementById("container-filtros");
        if (!container) return;
        container.innerHTML = "";
        
        const categorias = [
            { id: "todos", nome: "Todos", icon: "✨" },
            { id: "alimentacao", nome: "Alimentação", icon: "🍔" },
            { id: "saude", nome: "Saúde & Desporto", icon: "🏋️" },
            { id: "utilitarios", nome: "Tecnologia & Moda", icon: "👟" },
            { id: "lazer", nome: "Lazer & Saídas", icon: "🎪" }
        ];
        
        categorias.forEach(cat => {
            const ativo = State.categoriaAtual === cat.id;
            const btn = document.createElement("button");
            btn.className = `px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm flex items-center gap-1.5 border-2 ${
                ativo 
                ? 'bg-amber-500 text-white border-amber-600 border-b-4' 
                : 'bg-white text-slate-600 border-slate-200 hover:border-amber-400'
            }`;
            btn.innerHTML = `<span>${cat.icon}</span> ${cat.nome}`;
            btn.onclick = () => {
                State.categoriaAtual = cat.id;
                this.renderFiltros();
                this.renderLoja();
            };
            container.appendChild(btn);
        });
    },

    renderLoja() {
        const container = document.getElementById("container-loja");
        if (!container) return;
        container.innerHTML = "";
        
        const itensFiltrados = DB.loja.filter(item => {
            if (State.categoriaAtual !== "todos" && item.cat !== State.categoriaAtual) return false;
            return true;
        });
        
        if (itensFiltrados.length === 0) {
            container.innerHTML = `<div class="col-span-full text-center py-8 text-slate-400 font-bold text-sm">Nenhum item disponível nesta categoria.</div>`;
            return;
        }
        
        itensFiltrados.forEach(item => {
            const bloqueadoPorIdade = State.idade < item.minIdade;
            const div = document.createElement("div");
            div.className = `bg-white p-4 rounded-2xl border-2 border-slate-200 card-solid flex flex-col justify-between relative ${bloqueadoPorIdade ? 'opacity-60 select-none' : ''}`;
            
            let conteudoBotao = `
                <button onclick="Engine.comprarItem(event, '${item.id}')" class="w-full bg-amber-500 hover:bg-amber-400 text-white py-2 rounded-xl text-xs font-black uppercase tracking-wider shadow-md border-b-4 border-amber-700 active:translate-y-0.5 btn-solid">
                    Comprar
                </button>
            `;
            
            if (bloqueadoPorIdade) {
                conteudoBotao = `
                    <button disabled class="w-full bg-slate-200 text-slate-400 py-2 rounded-xl text-xs font-black uppercase tracking-wider cursor-not-allowed border-b-4 border-slate-300 flex items-center justify-center gap-1">
                        <i class="fa-solid fa-lock text-[10px]"></i> Nível ${item.minIdade}
                    </button>
                `;
            }
            
            div.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-3xl bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center shadow-inner border border-slate-200/60">${item.icone}</div>
                        <span class="bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full text-xs font-black border border-amber-200">${item.preco.toFixed(2)}€</span>
                    </div>
                    <h3 class="font-black text-slate-800 text-sm mb-1">${item.nome}</h3>
                    <div class="flex gap-2 mb-4">
                        ${item.fel > 0 ? `<span class="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded flex items-center gap-0.5"><i class="fa-solid fa-face-smile"></i> +${item.fel}</span>` : ''}
                        ${item.soc > 0 ? `<span class="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-200 px-1.5 py-0.5 rounded flex items-center gap-0.5"><i class="fa-solid fa-users"></i> +${item.soc}</span>` : ''}
                    </div>
                </div>
                ${conteudoBotao}
            `;
            container.appendChild(div);
        });
    },

    renderObjetivos() {
        const containerAtivos = document.getElementById("objetivos-ativos");
        const containerAlcancados = document.getElementById("objetivos-alcancados");
        if (!containerAtivos || !containerAlcancados) return;
        
        containerAtivos.innerHTML = "";
        containerAlcancados.innerHTML = "";
        
        State.objetivosAtivos.forEach(obj => {
            const alcancado = State.poupanca >= obj.preco;
            const card = document.createElement("div");
            card.className = "bg-white p-4 rounded-2xl border-2 border-slate-200 card-solid flex flex-col justify-between";
            card.innerHTML = `
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <div class="text-3xl bg-slate-100 w-12 h-12 rounded-xl flex items-center justify-center border border-slate-200/60 shadow-inner">${obj.icon}</div>
                        <span class="bg-blue-100 text-blue-700 px-2.5 py-1 rounded-full text-xs font-black border border-blue-200">${obj.preco}€</span>
                    </div>
                    <h3 class="font-black text-slate-800 text-sm mb-4">${obj.nome}</h3>
                </div>
                <button 
                    onclick="Engine.comprarObjetivo(${obj.id})"
                    ${!alcancado ? 'disabled' : ''}
                    class="w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider shadow-md transition-all ${
                        alcancado 
                        ? 'bg-blue-600 hover:bg-blue-500 text-white border-b-4 border-blue-800 active:translate-y-0.5 btn-solid cursor-pointer' 
                        : 'bg-slate-100 text-slate-400 border-b-4 border-slate-200 cursor-not-allowed'
                    }"
                >
                    ${alcancado ? '🎯 Alcançar Objetivo!' : `Faltam ${(obj.preco - State.poupanca).toFixed(2)}€`}
                </button>
            `;
            containerAtivos.appendChild(card);
        });
        
        if (State.historicoObj.length === 0) {
            containerAlcancados.innerHTML = `<div class="text-center py-6 text-slate-400 font-bold text-xs bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl col-span-full">Ainda não realizaste nenhum grande sonho. Junta dinheiro e alcança o teu primeiro objetivo!</div>`;
        } else {
            State.historicoObj.forEach(obj => {
                const card = document.createElement("div");
                card.className = "bg-emerald-50/50 p-4 rounded-2xl border-2 border-emerald-200 shadow-sm flex items-center justify-between";
                card.innerHTML = `
                    <div class="flex items-center gap-3">
                        <div class="text-2xl bg-white w-10 h-10 rounded-xl flex items-center justify-center shadow-sm border border-emerald-100">${obj.icon}</div>
                        <div>
                            <h4 class="font-black text-slate-800 text-sm">${obj.nome}</h4>
                            <p class="text-[10px] font-extrabold text-emerald-600 uppercase tracking-wider"><i class="fa-solid fa-circle-check"></i> Concluído no Mês ${obj.mesConcluido}</p>
                        </div>
                    </div>
                    <span class="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full text-xs font-black border border-emerald-200">${obj.preco}€</span>
                `;
                containerAlcancados.appendChild(card);
            });
        }
    },

    renderTrofeus() {
        const container = document.getElementById("container-trofeus");
        if (!container) return;
        container.innerHTML = "";
        
        const conquistas = [
            { id: "poupador", titulo: "Primeira Poupança", desc: "Acumula teus primeiros 100€ na Conta Poupança.", icon: "🥉" },
            { id: "rico", titulo: "Independência Financeira", desc: "Alcança a marca histórica de 500€ guardados.", icon: "🥈" },
            { id: "conquistador", titulo: "Sonhador Realizado", desc: "Alcança com sucesso pelo menos 1 objetivo de vida.", icon: "🥇" },
            { id: "equilibrio", titulo: "Mestre do Equilíbrio", desc: "Fica com 100% de Felicidade e 100% de Social ao mesmo tempo.", icon: "🏆" }
        ];
        
        conquistas.forEach(trofeu => {
            const desbloqueado = State.trofeus.includes(trofeu.id);
            const div = document.createElement("div");
            div.className = `p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${
                desbloqueado 
                ? 'bg-gradient-to-br from-amber-50 to-orange-50/30 border-amber-200 shadow-sm' 
                : 'bg-white border-slate-200 opacity-50'
            }`;
            div.innerHTML = `
                <div class="text-4xl filter ${desbloqueado ? '' : 'grayscale'}">${trofeu.icon}</div>
                <div>
                    <h3 class="font-black text-sm ${desbloqueado ? 'text-amber-800' : 'text-slate-700'}">${trofeu.titulo}</h3>
                    <p class="text-xs ${desbloqueado ? 'text-amber-700/80' : 'text-slate-400'} font-bold mt-0.5 leading-tight">${trofeu.desc}</p>
                </div>
            `;
            container.appendChild(div);
        });
    },

    mostrarModalObjetivo() { document.getElementById('modal-objetivo').classList.remove('hidden'); },
    esconderModalObjetivo() { document.getElementById('modal-objetivo').classList.add('hidden'); },

    notificar(titulo, msg) {
        const toast = document.createElement('div');
        toast.className = 'bg-slate-800 text-white p-4 rounded-xl shadow-xl border-l-4 border-blue-500 toast-enter flex items-start gap-3 w-72';
        toast.innerHTML = `<i class=\"fa-solid fa-bell text-blue-400 mt-1\"></i><div><h4 class=\"font-black text-sm\">${titulo}</h4><p class=\"text-xs text-slate-300 mt-0.5\">${msg}</p></div>`;
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
        } catch(err) { console.log(err); }
    }
};
const DB = {
    bancos: [
        { 
            id: "cgd", 
            nome: "Caixa Jovem", 
            juro: 0.001, // 0.1% TANB (Realista para contas tradicionais)
            bonus: 0, 
            icone: "fa-building-columns", 
            cor: "bg-blue-600", 
            desc: "✅ Vantagem: A maior rede de balcões e caixas ATM em Portugal para depósitos físicos.<br>❌ Desvantagem: Rentabilidade quase nula (0.1% juros) e comissão de abertura de 5€.",
            custo: 5 
        },
        { 
            id: "activo", 
            nome: "Activo Bank", 
            juro: 0.025, // 2.5% em contas poupança digitais
            bonus: 10, 
            icone: "fa-mobile-screen", 
            cor: "bg-slate-800", 
            desc: "✅ Vantagem: Conta e cartões 100% gratuitos (sem comissões), bónus de adesão de 10€ e juros altos.<br>❌ Desvantagem: Linhas de apoio telefónico demoradas e poucos balcões físicos em caso de urgência.", 
            custo: 0 
        },
        { 
            id: "bcp", 
            nome: "Millennium GO!", 
            juro: 0.005, // 0.5%
            bonus: 0, 
            icone: "fa-shield", 
            cor: "bg-pink-600", 
            desc: "✅ Vantagem: Inclui um seguro de proteção digital e assistência médica para jovens via App.<br>❌ Desvantagem: Juros baixos e passa a cobrar comissão mensal de manutenção assim que fizeres 18 anos.", 
            custo: 0 
        },
        { 
            id: "santander", 
            nome: "Santander Stream", 
            juro: 0.01, // 1%
            bonus: 0, 
            icone: "fa-fire", 
            cor: "bg-red-600", 
            desc: "✅ Vantagem: Descontos imediatos na subscrição de streaming (Spotify/Netflix) e em cinemas.<br>❌ Desvantagem: Obriga a gastos mínimos no cartão e os juros não acompanham a inflação.", 
            custo: 0 
        }
    ],
    loja: [
        { id: "livre", nome: "Despesa Livre", cat: "extra", preco: 0, fel: 0, soc: 0, minIdade: 13, icone: "📝" },
        { id: "gomas", nome: "Pacote de Gomas", cat: "snacks", preco: 2, fel: 5, soc: 0, minIdade: 13, icone: "🍬" },
        { id: "fastfood", nome: "Menu Fast-Food", cat: "snacks", preco: 8, fel: 10, soc: 5, minIdade: 13, icone: "🍔" },
        { id: "robux", nome: "Moedas Jogo", cat: "digital", preco: 10, fel: 15, soc: 0, minIdade: 13, icone: "🎮" },
        { id: "spotify", nome: "Spotify Premium", cat: "digital", preco: 8, fel: 10, soc: 0, minIdade: 13, icone: "🎧" },
        { id: "tshirt", nome: "T-Shirt Básica", cat: "moda", preco: 15, fel: 10, soc: 5, minIdade: 13, icone: "👕" },
        { id: "cinema", nome: "Bilhete Cinema", cat: "saidas", preco: 7, fel: 10, soc: 15, minIdade: 13, icone: "🍿" },
        { id: "jantar", nome: "Jantar de Turma", cat: "saidas", preco: 20, fel: 20, soc: 25, minIdade: 15, icone: "🍕" },
        { id: "ginasio", nome: "Mensalidade Ginásio", cat: "desporto", preco: 30, fel: 15, soc: 10, minIdade: 15, icone: "🏋️" },
        { id: "sapatilhas", nome: "Sapatilhas Marca", cat: "moda", preco: 80, fel: 40, soc: 15, minIdade: 14, icone: "👟" },
        { id: "festival", nome: "Passe Festival Verão", cat: "saidas", preco: 120, fel: 50, soc: 40, minIdade: 16, icone: "🎪" }
    ],
    dilemas: [
        { tipo: "escolha", titulo: "Convite para Sair", desc: "Os teus amigos vão todos ao Shopping. Vais gastar 15€ mas ganhas muita vida social.", acoes: [{ txt: "Ir com eles (-15€)", custo: -15, fel: 10, soc: 25 }, { txt: "Ficar em casa", custo: 0, fel: -10, soc: -15 }] },
        { tipo: "imprevisto", titulo: "Material Escolar", desc: "Precisas de comprar uma calculadora nova para a escola. É obrigatório.", acoes: [{ txt: "Pagar 25€", custo: -25, fel: 0, soc: 0 }] },
        { tipo: "sorte", titulo: "Boa Ação", desc: "Ajudaste um vizinho e ele deu-te uma gorjeta!", acoes: [{ txt: "Agradecer (+10€)", custo: 10, fel: 5, soc: 5 }] }
    ],
    trofeus: [
        { id: "poupador", nome: "Poupador", icon: "💰", desc: "Juntaste 100€ na poupança." },
        { id: "rico", nome: "Ricaço", icon: "💎", desc: "Juntaste 500€ na poupança." },
        { id: "conquistador", nome: "Conquistador", icon: "🏆", desc: "Compraste o teu primeiro objetivo." },
        { id: "equilibrio", nome: "Equilíbrio Perfeito", icon: "⚖️", desc: "Atingiste 100% em Felicidade e Vida Social." }
    ]
};
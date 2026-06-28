const DB = {
    bancos: [
        { 
            id: "cgd", 
            nome: "Caixa Jovem", 
            juro: 0.001, // 0.1% TANB
            bonus: 0, 
            icone: "fa-building-columns", 
            cor: "bg-blue-600", 
            custo: 5,
            cartao: "Cartão Débito Caixa ID",
            vantagens: [
                "Maior rede de balcões e caixas ATM em Portugal para depósitos físicos.",
                "Acesso a descontos exclusivos em eventos e transportes associados ao Cartão Jovem.",
                "App Caixadirecta robusta com MB WAY integrado."
            ],
            desvantagens: [
                "Rentabilidade quase nula (0.1% juros base).",
                "Cobrança de comissão de abertura de conta (5€).",
                "Processos mais burocráticos para resolução de problemas digitais."
            ]
        },
        { 
            id: "activo", 
            nome: "Activo Bank", 
            juro: 0.025, // 2.5% em contas poupança digitais
            bonus: 10, 
            icone: "fa-mobile-screen", 
            cor: "bg-slate-800", 
            custo: 0,
            cartao: "Cartão de Débito Activo",
            vantagens: [
                "Conta e cartões 100% gratuitos (zero comissões de manutenção).",
                "Abertura de conta rápida por videochamada.",
                "Bónus de adesão imediato de 10€ e taxas de juro apelativas."
            ],
            desvantagens: [
                "Linhas de apoio telefónico podem ser demoradas em picos de tráfego.",
                "Poucos balcões físicos em caso de extrema urgência.",
                "Não permite depósitos de moedas nas máquinas automáticas (apenas notas)."
            ]
        },
        { 
            id: "bcp", 
            nome: "Millennium GO!", 
            juro: 0.005, // 0.5%
            bonus: 0, 
            icone: "fa-shield", 
            cor: "bg-pink-600", 
            custo: 0,
            cartao: "Cartão Millennium GO Débito",
            vantagens: [
                "Inclui seguro de proteção digital gratuito para compras online.",
                "Assistência médica remota gratuita para jovens via App.",
                "Isenção de comissão de manutenção de conta até aos 18 anos."
            ],
            desvantagens: [
                "Taxa de juro de poupança muito baixa (0.5%).",
                "Passa a cobrar comissão mensal de manutenção obrigatoriamente aos 18 anos.",
                "Exige atualizações frequentes de dados na aplicação."
            ]
        },
        { 
            id: "santander", 
            nome: "Santander Stream", 
            juro: 0.01, // 1%
            bonus: 0, 
            icone: "fa-fire", 
            cor: "bg-red-600", 
            custo: 0,
            cartao: "Cartão Santander Stream",
            vantagens: [
                "Descontos e cashback diretos na subscrição de streaming (Spotify/Netflix).",
                "Descontos imediatos em cinemas parceiros (ex: Cinemas NOS).",
                "Isenção de custos em transferências imediatas via App."
            ],
            desvantagens: [
                "Obriga a gastos ou movimentos mínimos no cartão para manter as vantagens.",
                "Taxa de juro (1%) não acompanha o valor real da inflação.",
                "Apoio ao cliente focado no assistente virtual automático antes do humano."
            ]
        }
    ],
    loja: [
        { id: "lanche", nome: "Lanche c/ Amigos", cat: "comida", preco: 5, fel: 15, soc: 10, icone: "🍔" },
        { id: "cinema", nome: "Ida ao Cinema", cat: "lazer", preco: 10, fel: 20, soc: 15, minIdade: 12, icone: "🍿" },
        { id: "jantar", nome: "Jantar de Grupo", cat: "lazer", preco: 20, fel: 25, soc: 30, minIdade: 14, icone: "🍕" },
        { id: "ginasio", nome: "Mensalidade Ginásio", cat: "saude", preco: 30, fel: 15, soc: 10, minIdade: 15, icone: "🏋️" },
        { id: "sapatilhas", nome: "Sapatilhas Marca", cat: "utilitarios", preco: 80, fel: 40, soc: 15, minIdade: 14, icone: "👟" },
        { id: "festival", nome: "Passe Festival Verão", cat: "lazer", preco: 120, fel: 50, soc: 40, minIdade: 16, icone: "🎪" }
    ],
    dilemas: [
        { tipo: "escolha", titulo: "Convite para Sair", desc: "Os teus amigos vão todos ao Shopping. Vais gastar 15€ mas ganhas muita vida social.", acoes: [{ txt: "Ir com eles (-15€)", custo: -15, fel: 10, soc: 25 }, { txt: "Ficar em casa", custo: 0, fel: -10, soc: -15 }] },
        { tipo: "imprevisto", titulo: "Material Escolar", desc: "Precisas de comprar uma calculadora nova para a escola. É obrigatório.", acoes: [{ txt: "Pagar 25€", custo: -25, fel: 0, soc: 0 }] },
        { tipo: "sorte", titulo: "Boa Ação", desc: "Ajudaste um vizinho e ele deu-te uma gorjeta!", acoes: [{ txt: "Agradecer (+10€)", custo: 10, fel: 5, soc: 5 }] }
    ],
    trofeus: [
        { id: "poupador", nome: "Poupador Consciente", desc: "Chegaste aos 100€ na poupança!" },
        { id: "rico", nome: "Investidor de Elite", desc: "Juntaste 500€ na tua conta poupança!" },
        { id: "conquistador", nome: "Sonhador Ativo", desc: "Alcançaste com sucesso pelo menos 1 objetivo de vida!" },
        { id: "equilibrio", nome: "Mestre da Vida", desc: "Tiveste 100% de Felicidade e 100% Social ao mesmo tempo!" }
    ]
};
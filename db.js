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
                "Abertura de conta rápida e digital via Chave Móvel Digital.",
                "Bónus imediato de 10€ ao ativar a conta."
            ],
            desvantagens: [
                "Linhas de apoio telefónico demoradas em horas de pico.",
                "Poucos balcões físicos em caso de urgência fora das grandes cidades.",
                "Não permite depósitos físicos de moedas facilmente."
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
            cartao: "Cartão Free debito_young",
            vantagens: [
                "Inclui um Seguro de Imprevistos Grátis que anula o custo do primeiro azar do jogo.",
                "Apoio ao cliente 24/7 diretamente pela aplicação móvel.",
                "Excelente integração com carteiras digitais (Apple Pay, Google Pay)."
            ],
            desvantagens: [
                "Taxa de juro mediana (0.5%), abaixo dos bancos digitais.",
                "Sem bónus financeiro de boas-vindas.",
                "Exige atualizações frequentes de dados na plataforma."
            ]
        }
    ],
    produtos: [
        // Categoria: Alimentação
        { id: "lanche", nome: "Lanche na Padaria", cat: "alimentacao", preco: 4, fel: 8, soc: 10, minIdade: 14, icone: "🥐" },
        { id: "fastfood", nome: "Menu Fast Food", cat: "alimentacao", preco: 8, fel: 15, soc: 12, minIdade: 14, icone: "🍔" },
        { id: "jantar_amigos", nome: "Jantar de Grupo (Pizzaria)", cat: "alimentacao", preco: 15, fel: 25, soc: 30, minIdade: 15, icone: "🍕" },
        { id: "sushi", nome: "Rodízio de Sushi", cat: "alimentacao", preco: 22, fel: 35, soc: 20, minIdade: 16, icone: "🍣" },
        
        // Categoria: Saúde e Desporto
        { id: "ginasio", nome: "Mensalidade Ginásio", cat: "saude", preco: 30, fel: 15, soc: 10, minIdade: 15, icone: "🏋️" },
        { id: "suplementos", nome: "Proteína & Shaker", cat: "saude", preco: 25, fel: 12, soc: 0, minIdade: 16, icone: "🥤" },
        { id: "padel", nome: "Aluguer de Campo de Padel", cat: "saude", preco: 10, fel: 18, soc: 25, minIdade: 14, icone: "🎾" },
        
        // Categoria: Utilitários e Tecnologia
        { id: "sapatilhas", nome: "Sapatilhas Marca", cat: "utilitarios", preco: 80, fel: 40, soc: 15, minIdade: 14, icone: "👟" },
        { id: "fones_bluetooth", nome: "Fones Sem Fios", cat: "utilitarios", preco: 45, fel: 30, soc: 0, minIdade: 14, icone: "🎧" },
        { id: "powerbank", nome: "Powerbank Rápido", cat: "utilitarios", preco: 20, fel: 15, soc: 5, minIdade: 14, icone: "🔋" },
        { id: "streaming", nome: "Subscrição Streaming", cat: "utilitarios", preco: 10, fel: 20, soc: 10, minIdade: 14, icone: "📺" },
        
        // Categoria: Lazer e Saídas
        { id: "cinema", nome: "Bilhete Cinema com Pipocas", cat: "lazer", preco: 11, fel: 18, soc: 15, minIdade: 14, icone: "🎬" },
        { id: "festival", nome: "Passe Festival Verão", cat: "lazer", preco: 120, fel: 50, soc: 40, minIdade: 16, icone: "🎪" },
        { id: "concerto", nome: "Bilhete para Concerto", cat: "lazer", preco: 35, fel: 40, soc: 25, minIdade: 15, icone: "🎸" },
        { id: "gaming", nome: "Skin / DLC de Jogo", cat: "lazer", preco: 15, fel: 25, soc: 10, minIdade: 14, icone: "🎮" },
        { id: "escape_room", nome: "Bilhete Escape Room", cat: "lazer", preco: 18, py: 30, soc: 35, minIdade: 15, icone: "🧩" }
    ],
    dilemas: [
        { tipo: "escolha", titulo: "Convite para Sair", desc: "Os teus amigos vão todos ao Shopping. Vais gastar 15€ mas ganhas muita vida social.", acoes: [{ txt: "Ir com eles (-15€)", custo: -15, fel: 10, soc: 25 }, { txt: "Ficar em casa", custo: 0, fel: -10, soc: -15 }] },
        { tipo: "imprevisto", titulo: "Material Escolar", desc: "Precisas de comprar uma calculadora nova para a escola. É obrigatório.", acoes: [{ txt: "Pagar 25€", custo: -25, fel: 0, soc: 0 }] },
        { tipo: "sorte", titulo: "Boa Ação", desc: "Ajudaste um vizinho e ele deu-te uma gorjeta!", acoes: [{ txt: "Agradecer (+10€)", custo: 10, fel: 5, soc: 5 }] }
    ]
};
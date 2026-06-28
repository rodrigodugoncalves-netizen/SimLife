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
                "App Caixadirecta robusta com MB WAY integrado.",
                "Facilidade de emissão de declarações académicas e pagamento de propinas em terminais.",
                "Excelente estabilidade institucional e segurança de dados reconhecida nacionalmente."
            ],
            desvantagens: [
                "Rentabilidade quase nula (0.1% juros base).",
                "Cobrança de comissão de abertura de conta (5€).",
                "Processos mais burocráticos para resolução de problemas digitais.",
                "Filas de espera longas nos balcões físicos para atendimento presencial.",
                "Cobrança oculta em transferências internacionais não digitais."
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
                "Bónus imediato de 10€ ao ativar a conta.",
                "Podes usar os balcões e máquinas do Millennium BCP para algumas operações.",
                "Interface da aplicação super moderna, intuitiva e jovem."
            ],
            desvantagens: [
                "Linhas de apoio telefónico demoradas em horas de pico.",
                "Poucos balcões físicos próprios em caso de urgência fora das grandes cidades.",
                "Não permite depósitos físicos de moedas facilmente.",
                "Notificações de saldo da app às vezes demoram a atualizar após compras.",
                "Recusa ocasional de cartões em portagens ou sistemas offline mais antigos."
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
                "Excelente integração com carteiras digitais (Apple Pay, Google Pay).",
                "Grande capilaridade de caixas automáticos avançados para depósito de notas.",
                "Acesso facilitado a microcréditos para portáteis ou estudos a partir dos 18 anos."
            ],
            desvantagens: [
                "Taxa de juro mediana (0.5%), abaixo dos bancos digitais.",
                "Sem bónus financeiro de boas-vindas.",
                "Exige atualizações frequentes de dados na plataforma para não bloquear funções.",
                "A publicidade excessiva a seguros dentro da app pode ser irritante.",
                "Comissões pesadas caso ultrapasses o limite de idade jovem sem dar conta."
            ]
        },
        { 
            id: "big", 
            nome: "Banco BiG Jovem", 
            juro: 0.040, // 4.0% TANB
            bonus: 0, 
            icone: "fa-chart-pie", 
            cor: "bg-amber-600", 
            custo: 0,
            cartao: "Cartão BiG Investidor",
            vantagens: [
                "Melhor taxa de juro do simulador (4.0% TANB) para veres o dinheiro crescer rápido.",
                "Acesso didático a pequenos fundos de investimento para menores de idade.",
                "Isenção total de custos de manutenção de conta poupança.",
                "Webinars semanais gratuitos dentro da app sobre educação financeira e poupança.",
                "Suporte especializado em aconselhamento de metas financeiras de longo prazo."
            ],
            desvantagens: [
                "Não tem MB WAY nativo gratuito (taxas adicionais por transferência de envio).",
                "Rede física quase inexistente em Portugal (apenas escassas 'agências digitais').",
                "O dinheiro dos juros exige permanência mínima (se levantares antes do mês, perdes o juro).",
                "A interface da aplicação é mais técnica e menos focada em redes sociais.",
                "Não oferece cartões com designs personalizáveis ou parcerias de entretenimento."
            ]
        }
    ],
    produtos: [
        // Categoria: Alimentação
        { id: "lanche", nome: "Lanche na Padaria", cat: "alimentacao", preco: 4, fel: 8, soc: 10, minIdade: 14, icone: "🥐" },
        { id: "fastfood", nome: "Menu Fast Food", cat: "alimentacao", preco: 8, fel: 15, soc: 12, minIdade: 14, icone: "🍔" },
        { id: "jantar_amigos", nome: "Jantar de Grupo (Pizzaria)", cat: "alimentacao", preco: 15, fel: 25, soc: 30, minIdade: 15, icone: "🍕" },
        { id: "sushi", nome: "Rodízio de Sushi", cat: "alimentacao", preco: 22, fel: 35, soc: 20, minIdade: 16, icone: "🍣" },
        { id: "bubble_tea", nome: "Bubble Tea de Tarde", cat: "alimentacao", preco: 5, fel: 10, soc: 15, minIdade: 13, icone: "🧋" },
        { id: "gelado_artesanal", nome: "Gelado de Copo Grande", cat: "alimentacao", preco: 4.5, fel: 12, soc: 8, minIdade: 13, icone: "🍨" },
        { id: "brunch_domingo", nome: "Brunch de Domingo Estiloso", cat: "alimentacao", preco: 18, fel: 20, soc: 25, minIdade: 15, icone: "🥞" },
        { id: "energetico_pack", nome: "Pack de Bebidas Energéticas", cat: "alimentacao", preco: 6, fel: 15, soc: -5, minIdade: 16, icone: "⚡" },
        
        // Categoria: Saúde e Desporto
        { id: "ginasio", nome: "Mensalidade Ginásio", cat: "saude", preco: 30, fel: 15, soc: 10, minIdade: 15, icone: "🏋️" },
        { id: "suplementos", nome: "Proteína & Shaker", cat: "saude", preco: 25, fel: 12, soc: 0, minIdade: 16, icone: "🥤" },
        { id: "padel", nome: "Aluguer de Campo de Padel", cat: "saude", preco: 10, fel: 18, soc: 25, minIdade: 14, icone: "🎾" },
        { id: "sapatilhas_corrida", nome: "Sapatilhas de Corrida", cat: "saude", preco: 65, fel: 20, soc: 5, minIdade: 14, icone: "👟" },
        { id: "smartband", nome: "Pulseira de Atividade", cat: "saude", preco: 35, fel: 22, soc: 0, minIdade: 13, icone: "⌚" },
        { id: "massagem_recup", nome: "Sessão de Fisioterapia/Massagem", cat: "saude", preco: 40, fel: 30, soc: 0, minIdade: 16, icone: "💆" },
        
        // Categoria: Utilitários e Tecnologia
        { id: "sapatilhas", nome: "Sapatilhas Marca", cat: "utilitarios", preco: 80, fel: 40, soc: 15, minIdade: 14, icone: "👟" },
        { id: "fones_bluetooth", nome: "Fones Sem Fios", cat: "utilitarios", preco: 45, fel: 30, soc: 0, minIdade: 14, icone: "🎧" },
        { id: "powerbank", nome: "Powerbank Rápido", cat: "utilitarios", preco: 20, fel: 15, soc: 5, minIdade: 14, icone: "🔋" },
        { id: "streaming", nome: "Subscrição Streaming", cat: "utilitarios", preco: 10, fel: 20, soc: 10, minIdade: 14, icone: "📺" },
        { id: "rato_gaming", nome: "Rato Gaming RGB", cat: "utilitarios", preco: 35, fel: 25, soc: 0, minIdade: 13, icone: "🖱️" },
        { id: "teclado_mecanico", nome: "Teclado Mecânico Pro", cat: "utilitarios", preco: 75, fel: 35, soc: 0, minIdade: 14, icone: "⌨️" },
        { id: "tripod_ringlight", nome: "Anel de Luz para Vídeos", cat: "utilitarios", preco: 15, fel: 18, soc: 12, minIdade: 13, icone: "💡" },
        { id: "mochila_antirroubo", nome: "Mochila para Portátil", cat: "utilitarios", preco: 30, fel: 12, soc: 0, minIdade: 14, icone: "🎒" },
        
        // Categoria: Lazer e Saídas
        { id: "cinema", nome: "Bilhete Cinema com Pipocas", cat: "lazer", preco: 11, fel: 18, soc: 15, minIdade: 14, icone: "🎬" },
        { id: "festival", nome: "Passe Festival Verão", cat: "lazer", preco: 120, fel: 50, soc: 40, minIdade: 16, icone: "🎪" },
        { id: "concerto", nome: "Bilhete para Concerto", cat: "lazer", preco: 35, fel: 40, soc: 25, minIdade: 15, icone: "🎸" },
        { id: "gaming", nome: "Skin / DLC de Jogo", cat: "lazer", preco: 15, fel: 25, soc: 10, minIdade: 14, icone: "🎮" },
        { id: "escape_room", nome: "Bilhete Escape Room", cat: "lazer", preco: 18, fel: 30, soc: 35, minIdade: 15, icone: "🧩" },
        { id: "bowling_noite", nome: "Noite de Bowling com Amigos", cat: "lazer", preco: 12, fel: 20, soc: 28, minIdade: 13, icone: "🎳" },
        { id: "parque_diversoes", nome: "Viagem ao Parque de Diversões", cat: "lazer", preco: 45, fel: 45, soc: 35, minIdade: 14, icone: "🎡" },
        { id: "karting", nome: "Corrida de Karting", cat: "lazer", preco: 25, fel: 35, soc: 20, minIdade: 15, icone: "🏎️" },
        { id: "bilhar_arcade", nome: "Fichas de Salão de Jogos", cat: "lazer", preco: 6, fel: 14, soc: 18, minIdade: 13, icone: "🕹️" }
    ],
    dilemas: [
        { tipo: "escolha", titulo: "Convite para Sair", desc: "Os teus amigos vão todos ao Shopping. Vais gastar 15€ mas ganhas muita vida social.", acoes: [{ txt: "Ir com eles (-15€)", custo: -15, fel: 10, soc: 25 }, { txt: "Ficar em casa", custo: 0, fel: -10, soc: -15 }] },
        { tipo: "imprevisto", titulo: "Material Escolar", desc: "Precisas de comprar uma calculadora nova para a escola. É obrigatório.", acoes: [{ txt: "Pagar 25€", custo: -25, fel: 0, soc: 0 }] },
        { tipo: "sorte", titulo: "Boa Ação", desc: "Ajudaste um vizinho e ele deu-te uma gorjeta!", acoes: [{ txt: "Agradecer (+10€)", custo: 10, fel: 5, soc: 5 }] }
    ],
    trofeus: [
        { id: "poupador", nome: "Poupador Iniciante", desc: "Alcança 100€ na Conta Poupança.", icon: "🥉" },
        { id: "rico", nome: "Futuro Investidor", desc: "Alcança 500€ na Conta Poupança.", icon: "🥈" },
        { id: "conquistador", nome: "Focado em Metas", desc: "Completa com sucesso o teu primeiro Objetivo Pessoal.", icon: "🥇" },
        { id: "equilibrio", nome: "Mestre do Equilíbrio", desc: "Fica com 100% de Felicidade e 100% de Vida Social ao mesmo tempo.", icon: "🏆" }
    ]
};
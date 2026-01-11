// src/lib/insights.ts

export type CategoriaClima =
    | 'CALOR_INFERNAL'
    | 'CALOR_PRAIA'
    | 'FRIO_CONGELANTE'
    | 'FRIO_LEVE'
    | 'TEMPESTADE'
    | 'CHUVA'
    | 'NEUTRO';

const FRASES_CLIMA: Record<CategoriaClima, string[]> = {

    CALOR_INFERNAL: [
        "Tá tão quente que o frango já nasce assado! 🍗🔥",
        "Sensação térmica: Abraço do capeta. Se hidrate! 😈💧",
        "O sol não tá brilhando, tá humilhando. 😎",
        "Se você tem ar condicionado, você é rei hoje. 👑",
        "Hoje o ovo frita no asfalto (literalmente). 🍳",
        "Índice UV extremo! Protetor solar não é cosmético, é sobrevivência. 🧴",
        "Beba água! Seus rins mandaram lembranças. 🚰",
        "Calor intenso. Evite exposição direta ao sol nas horas de pico. ☀️",
        "Asfalto fervendo! Calibre os pneus, o calor altera a pressão. 🚗"
    ],

    CALOR_PRAIA: [
        "Dia perfeito para dar aquele mergulho! 🌊",
        "O sol apareceu pra te ver sorrir. Aproveite! ✨",
        "Céu azul de brigadeiro. Ótimo para exercícios ao ar livre. 🏃‍♂️",
        "Tá calor, mas não exagera. Camisa é obrigatória no escritório, tá? 👔",
        "Vontade de trabalhar: 0%. Vontade de praia: 100%. 🏖️",
        "Vitamina D garantida! Mas não esquece o óculos escuro. 😎",
        "Tempo seco pede água. Garrafinha na mão! 💧",
        "Dia lindo para ir de bike (se não for suar muito). 🚲",
        "Clima agradável e produtivo. Foco nas metas! 🎯"
    ],

    FRIO_CONGELANTE: [
        "Frio de renguear cusco! (Traduzindo: Tá muito gelado!). 🥶",
        "Amanhã a previsão é de: Edredom e Netflix. 📺",
        "Banho hoje? Só nas partes críticas. (Brincadeira... ou não). 🚿",
        "Se ver um pinguim na rua, devolve pro zoológico. 🐧",
        "Coragem não é lutar, é sair do banho quentinho hoje. ❄️",
        "Risco de hipotermia se vacilar. Agasalhe-se bem! 🧥",
        "Motor frio demora pra pegar. Tenha paciência na partida. 🚗"
    ],

    FRIO_LEVE: [
        "Aquele friozinho gostoso pra tomar um vinho. 🍷",
        "Clima elegante! Hora de tirar aquela jaqueta bonita do armário. 🧥",
        "Tempo fresco, cabeça fresca. Ótimo dia! 😊",
        "Tá frio, mas não neva. Guarda o esqui, campeão. ⛷️",
        "Ventinho gelado... Quem tem rinite que lute. 🤧",
        "Mudança de temperatura. Cuidado com a imunidade! 💊",
        "Pista fria tem menos aderência. Cuidado nas curvas. 🏍️"
    ],

    TEMPESTADE: [
        "Caiu o mundo! Se não tem barco, fica em casa. 🚣",
        "A chapinha já era. Aceita que dói menos. 🦁",
        "Tá chovendo canivete! Cuidado. ⛈️",
        "Vende-se: Guarda-chuva que virou ao contrário. Tratar aqui. ☂️",
        "Evite locais abertos. Raios não brincam em serviço. ⚡",
        "Aquaplanagem é real. Pé leve e nada de costurar. 🛑",
        "Internet pode oscilar com o vento. Salve seus arquivos! 💾"
    ],

    CHUVA: [
        "Chuvinha boa pra programar e focar. ☕💻",
        "O céu chora pra limpar a poluição. Respire fundo (depois). 🌿",
        "Vai sair? Leva o guarda-chuva ou vai virar pinto molhado. 🐥",
        "Dia oficial da preguiça. Pena que boleto não espera. 💸",
        "Pista escorregadia. Aumente a distância do carro da frente. 📏",
        "Motoqueiros: Cuidado com as faixas pintadas no chão, vira sabão! 🏍️"
    ],

    NEUTRO: [
        "Clima agradável e estável. Aproveite a tranquilidade. 😌",
        "Nem quente, nem frio. Apenas a perfeição. ✨",
        "Condições normais. Segue o baile! 💃",
        "Tempo bom para resolver a vida na rua. Vai fundo! 🚀",
        "Céu nublado, mas sem surpresas. Um dia de paz. ☁️",
        "Previsão de hoje: 100% de chance de dar tudo certo. 🍀"
    ]
};

export const gerarInsight = (categoria: string): string => {

    const catSegura = categoria || 'NEUTRO';

    const chave = (catSegura in FRASES_CLIMA) ? (catSegura as CategoriaClima) : 'NEUTRO';

    const lista = FRASES_CLIMA[chave];

    const indice = Math.floor(Math.random() * lista.length);

    return lista[indice];
};
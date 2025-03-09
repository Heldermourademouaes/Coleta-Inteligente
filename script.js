$('.destaque').slick({
    autoplay: true,
    autoplaySpeed: 4000,
    infinite: true,
    speed: 300,
  });

// Seleciona todos os elementos com a classe 'accordion'
var accordions = document.querySelectorAll('.accordion');
var panels = document.querySelectorAll('.painel');

accordions.forEach(function(accordion, index) {
    accordion.addEventListener('click', function() {
        // Fechar todos os outros painéis
        panels.forEach(function(panel, i) {
            if (i !== index) {
                panel.classList.remove('open');
                accordions[i].classList.remove('active');
            }
        });

        // Alternar o painel clicado
        var panel = this.nextElementSibling;
        this.classList.toggle('active');
        panel.classList.toggle('open');
    });
});
 
// Horários e locais da coleta
const schedule = [
    { rua: "Rua Afonso Pena", bairro: "Centro", start: "08:00", end: "09:00", dias: ["segunda"] },
    { rua: "Avenida Bento Gonçalves", bairro: "Partenon", start: "10:00", end: "11:00", dias: ["terça", "quinta"] },
    { rua: "Rua João Pessoa", bairro: "Cidade Baixa", start: "14:00", end: "15:00", dias: ["quarta"] },
    { rua: "Rua General Neto", bairro: "Floresta", start: "16:00", end: "17:00", dias: ["sexta"] }
];

// Função para atualizar o relógio e a localização do caminhão de lixo
function updateClock() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('clock').textContent = `${hours}:${minutes}:${seconds}`;
    
    // Verificar localização atual do caminhão
    const currentLocation = getCurrentLocation(now);
    document.getElementById('current-location').textContent = currentLocation || "Nenhuma coleta no momento";

    // Calcular próxima coleta
    const nextCollection = getNextCollection(now);
    document.getElementById('future-location').textContent = nextCollection || "Nenhuma coleta prevista";
}

// Função para obter a localização com base na hora atual
function getCurrentLocation(time) {
    const currentHour = String(time.getHours()).padStart(2, '0');
    const currentMinute = String(time.getMinutes()).padStart(2, '0');
    const currentTime = `${currentHour}:${currentMinute}`;

    for (const item of schedule) {
        if (currentTime >= item.start && currentTime < item.end) {
            return `${item.rua}, ${item.bairro}`;
        }
    }
    return null;
}

// Função para encontrar a próxima coleta
function getNextCollection(time) {
    const dayOfWeek = time.toLocaleString('pt-BR', { weekday: 'long' });
    let nextCollection = null;
    let nextDay = null;

    // Verifica cada item no cronograma
    for (const item of schedule) {
        if (item.dias.includes(dayOfWeek)) {
            nextCollection = `${item.rua}, ${item.bairro} (${item.start} - ${item.end})`;
            nextDay = dayOfWeek.charAt(0).toUpperCase() + dayOfWeek.slice(1); // Capitaliza o dia da semana
            return `Próxima coleta: ${nextCollection} na ${nextDay}`;
        }
    }

    // Se não houver coleta hoje, procura no próximo dia da semana
    const daysOfWeek = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
    for (let i = 1; i < 7; i++) { // Procura nos próximos 6 dias
        const nextDayIndex = (time.getDay() + i) % 7;
        const nextDay = daysOfWeek[nextDayIndex];
        for (const item of schedule) {
            if (item.dias.includes(nextDay)) {
                nextCollection = `${item.rua}, ${item.bairro} (${item.start} - ${item.end})`;
                const capitalizedNextDay = nextDay.charAt(0).toUpperCase() + nextDay.slice(1); // Capitaliza o próximo dia
                return `Próxima coleta: ${nextCollection} na ${capitalizedNextDay}`;
            }
        }
    }

    return "Nenhuma coleta prevista";
}

// Chama a função para atualizar o relógio e a localização a cada segundo
setInterval(updateClock, 1000);  // Atualiza o relógio a cada segundo
updateClock();  // Chamada inicial para exibir o relógio imediatamente

// Função para filtrar a tabela com base no campo de entrada
document.getElementById('searchInput').addEventListener('keyup', function () {
    const searchValue = this.value.toLowerCase();
    const table = document.getElementById('streetTable');
    const rows = table.getElementsByTagName('tr');

    // Loop pelas linhas da tabela (ignorando o cabeçalho)
    for (let i = 1; i < rows.length; i++) {
        const rua = rows[i].getElementsByTagName('td')[0].textContent.toLowerCase();
        const bairro = rows[i].getElementsByTagName('td')[1].textContent.toLowerCase();

        // Verifica se o texto da busca corresponde à rua ou ao bairro
        if (rua.includes(searchValue) || bairro.includes(searchValue)) {
            rows[i].style.display = '';
        } else {
            rows[i].style.display = 'none';
        }
    }
});


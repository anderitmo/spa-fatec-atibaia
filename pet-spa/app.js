const app = document.getElementById("app");

//ROTA
function rota() {
    const url = window.location.pathname;

    if (url === "/" || url === "/index.html")
    {
        // renderiza a agenda
        renderizarAgenda();
    } else {

        // renderizar a confirmação da agenda
        if (url.startsWith("/agendar/"))
        {
            const id = url.split("/")[2];
            renderizarConfirmacao(id);
        }        
    }
}

// Navegação (History API)
function navegar (rotaPathname)
{
    window.history.pushState(null, null, rotaPathname);
    rota();
}

// Renderizar agenda na DIV id="app"
async function renderizarAgenda() {
    try {
        const response = await fetch("agenda.json");
        const dados = await response.json();

        let tabela = `
            <table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; max-width: 600px;">
                <thead>
                    <tr style="background-color: #f2f2f2;">
                        <th>ID</th>    
                        <th>Horário</th>
                        <th>Serviço</th>
                        <th>Disponível</th>
                        <th>Agendar</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (const item of dados) {
            const disponivel = item.disponivel === "S" ? "✅ Sim" : "❌ Não";
            tabela += `
                <tr>
                    <td>${item.id}</td>
                    <td>${item.horario}</td>
                    <td>${item.servico}</td>
                    <td>${disponivel}</td>
                    <td>  <button onclick="navegar('/agendar/${item.id}')">Agendar</button> </td>
                   
                </tr>
            `;
        }

        tabela += `
                </tbody>
            </table>
        `;

        app.innerHTML = tabela;
    } catch (erro) {
        app.innerHTML = `<p style="color: red;">Erro ao carregar agenda: ${erro.message}</p>`;
    }
}


// Tela de Confirmação (ilusão de carregar outra página)
function renderizarConfirmacao(id) {
    app.innerHTML = `
        <h2>Confirmação de Agendamento </h2>
        <p>Você está agendando o serviço de ID: ${id}.</p>

        <button onclick="window.history.back()"> Cancelar </button>
        <button onclick="navegar('/agendar/${id}')">Agendar</button>
        `;
}



// Escuta quando o usuário clica no botão Voltar/Avançar do navegador
window.addEventListener('popstate', rota);

// Dispara o roteador na primeira vez que a página carrega
window.addEventListener('DOMContentLoaded', rota);
const formulario = document.getElementById("form-meta");
const listaMetas = document.getElementById("lista-metas");
const botaoAdicionar = document.getElementById("adicionar-meta");

const totalMetas = document.getElementById("total-metas");
const valorAcumulado = document.getElementById("valor-acumulado");
const progressoGeral = document.getElementById("progresso-geral");
const metasAtivas = document.getElementById("metas-ativas");

const graficoProgresso = document.getElementById("grafico-progresso");
const proximosPrazos = document.getElementById("proximos-prazos");

let metas = JSON.parse(localStorage.getItem("metasFinanTech")) || [];

function salvarMetas() {
    localStorage.setItem("metasFinanTech", JSON.stringify(metas));
}

function formatarDinheiro(valor) {
    return Number(valor).toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function formatarData(data) {
    if (!data) {
        return "Não definido";
    }

    const partes = data.split("-");

    return partes[2] + "/" + partes[1] + "/" + partes[0];
}

function calcularProgresso(meta) {
    return Math.min((meta.valorAtual / meta.valorObjetivo) * 100, 100);
}

function atualizarIndicadores() {
    let acumulado = 0;
    let objetivoTotal = 0;
    let ativas = 0;

    metas.forEach(function(meta) {
        acumulado += meta.valorAtual;
        objetivoTotal += meta.valorObjetivo;

        if (meta.valorAtual < meta.valorObjetivo) {
            ativas++;
        }
    });

    let progresso = 0;

    if (objetivoTotal > 0) {
        progresso = Math.min((acumulado / objetivoTotal) * 100, 100);
    }

    totalMetas.textContent = metas.length;
    valorAcumulado.textContent = formatarDinheiro(acumulado);
    progressoGeral.textContent = progresso.toFixed(1) + "%";
    metasAtivas.textContent = ativas;
}

function mostrarMetas() {
    listaMetas.innerHTML = "";

    metas.forEach(function(meta, indice) {
        const progresso = calcularProgresso(meta);

        const artigo = document.createElement("article");
        artigo.className = "meta";

        const cabecalho = document.createElement("header");
        cabecalho.className = "cabecalho-meta";

        const informacoes = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = meta.nome;

        const descricao = document.createElement("p");
        descricao.textContent = meta.descricao || "Sem descrição";

        informacoes.appendChild(titulo);
        informacoes.appendChild(descricao);

        const botaoExcluir = document.createElement("button");
        botaoExcluir.type = "button";
        botaoExcluir.textContent = "Excluir";

        botaoExcluir.addEventListener("click", function() {
            excluirMeta(indice);
        });

        cabecalho.appendChild(informacoes);
        cabecalho.appendChild(botaoExcluir);

        const areaProgresso = document.createElement("div");
        areaProgresso.className = "progresso-meta";

        const textoProgresso = document.createElement("p");
        textoProgresso.textContent = "Progresso";

        const barra = document.createElement("progress");
        barra.value = progresso;
        barra.max = 100;

        const porcentagem = document.createElement("span");
        porcentagem.textContent = progresso.toFixed(1) + "%";

        areaProgresso.appendChild(textoProgresso);
        areaProgresso.appendChild(barra);
        areaProgresso.appendChild(porcentagem);

        const detalhes = document.createElement("section");
        detalhes.className = "informacoes-meta";

        function criarInformacao(texto, valor) {
            const div = document.createElement("div");

            const p = document.createElement("p");
            p.textContent = texto;

            const h4 = document.createElement("h4");
            h4.textContent = valor;

            div.appendChild(p);
            div.appendChild(h4);

            return div;
        }

        detalhes.appendChild(
            criarInformacao("Valor atual", formatarDinheiro(meta.valorAtual))
        );

        detalhes.appendChild(
            criarInformacao("Valor objetivo", formatarDinheiro(meta.valorObjetivo))
        );

        detalhes.appendChild(
            criarInformacao("Prazo", formatarData(meta.prazo))
        );

        const botaoDepositar = document.createElement("button");
        botaoDepositar.type = "button";
        botaoDepositar.textContent = "Adicionar dinheiro";

        botaoDepositar.addEventListener("click", function() {
            adicionarDinheiro(indice);
        });

        artigo.appendChild(cabecalho);
        artigo.appendChild(areaProgresso);
        artigo.appendChild(detalhes);
        artigo.appendChild(botaoDepositar);

        listaMetas.appendChild(artigo);
    });
}

function adicionarMeta(evento) {
    evento.preventDefault();

    const nome = document.getElementById("nome-meta").value.trim();
    const valorObjetivo = Number(document.getElementById("valor-meta").value);
    const valorAtual = Number(document.getElementById("valor-inicial").value);
    const prazo = document.getElementById("prazo-meta").value;
    const categoria = document.getElementById("categoria-meta").value;
    const descricao = document.getElementById("descricao-meta").value.trim();

    if (nome === "" || valorObjetivo <= 0 || valorAtual < 0) {
        alert("Preencha os campos corretamente.");
        return;
    }

    if (valorAtual > valorObjetivo) {
        alert("O valor inicial não pode ser maior que o objetivo.");
        return;
    }

    const novaMeta = {
        nome: nome,
        valorObjetivo: valorObjetivo,
        valorAtual: valorAtual,
        prazo: prazo,
        categoria: categoria,
        descricao: descricao
    };

    metas.push(novaMeta);

    salvarMetas();
    atualizarPagina();

    formulario.reset();

    alert("Meta cadastrada com sucesso!");
}

function excluirMeta(indice) {
    const confirmar = confirm("Deseja realmente excluir esta meta?");

    if (confirmar) {
        metas.splice(indice, 1);

        salvarMetas();
        atualizarPagina();
    }
}

function adicionarDinheiro(indice) {
    const valor = prompt("Quanto deseja adicionar à meta?");

    if (valor === null) {
        return;
    }

    const deposito = Number(valor.replace(",", "."));

    if (!Number.isFinite(deposito) || deposito <= 0) {
        alert("Digite um valor válido.");
        return;
    }

    const meta = metas[indice];

    if (meta.valorAtual + deposito > meta.valorObjetivo) {
        alert("O depósito ultrapassa o valor da meta.");
        return;
    }

    meta.valorAtual += deposito;

    salvarMetas();
    atualizarPagina();

    alert("Valor adicionado com sucesso!");
}

function mostrarPrazos() {
    proximosPrazos.innerHTML = "";

    const metasComPrazo = metas.filter(function(meta) {
        return meta.prazo !== "" && meta.valorAtual < meta.valorObjetivo;
    });

    metasComPrazo.sort(function(a, b) {
        return a.prazo.localeCompare(b.prazo);
    });

    metasComPrazo.forEach(function(meta) {
        const item = document.createElement("li");

        item.textContent = meta.nome + " - " + formatarData(meta.prazo);

        proximosPrazos.appendChild(item);
    });
}

function atualizarGrafico() {
    graficoProgresso.innerHTML = "";

    metas.forEach(function(meta) {
        const progresso = calcularProgresso(meta);

        const div = document.createElement("div");

        const nome = document.createElement("p");
        nome.textContent = meta.nome;

        const barra = document.createElement("progress");
        barra.value = progresso;
        barra.max = 100;

        const porcentagem = document.createElement("span");
        porcentagem.textContent = " " + progresso.toFixed(1) + "%";

        div.appendChild(nome);
        div.appendChild(barra);
        div.appendChild(porcentagem);

        graficoProgresso.appendChild(div);
    });
}

function atualizarPagina() {
    mostrarMetas();
    atualizarIndicadores();
    mostrarPrazos();
    atualizarGrafico();
}

botaoAdicionar.addEventListener("click", function() {
    document.querySelector(".adicionar").scrollIntoView({
        behavior: "smooth"
    });

    document.getElementById("nome-meta").focus();
});

formulario.addEventListener("submit", adicionarMeta);

atualizarPagina();
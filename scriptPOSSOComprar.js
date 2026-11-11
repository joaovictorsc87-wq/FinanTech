
const form = document.getElementById("form-compra");

function formatarDinheiro(valor) {
    return valor.toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
    });
}

function analisarCompra(event) {
    event.preventDefault();

    let campoProduto = document.getElementById("produto");
    let produto = campoProduto.value.trim();

    let preco = Number(document.getElementById("preco").value);
    let saldo = Number(document.getElementById("saldo").value);
    let despesas = Number(document.getElementById("despesas").value);
    let reserva = Number(document.getElementById("reserva").value);

    if (produto === "") {
        alert("Digite o nome do produto!");
        campoProduto.focus();
        return;
    }

    if (
        !Number.isFinite(preco) ||
        !Number.isFinite(saldo) ||
        !Number.isFinite(despesas) ||
        !Number.isFinite(reserva) ||
        preco <= 0 ||
        saldo < 0 ||
        despesas < 0 ||
        reserva < 0
    ) {
        alert("Preencha os valores corretamente!");
        return;
    }

    let disponivel = saldo - despesas - reserva;
    let restante = disponivel - preco;

    let mensagem = document.getElementById("mensagem");
    let orientacao = document.getElementById("orientacao");

    document.getElementById("disponivel").textContent =
        formatarDinheiro(disponivel);

    document.getElementById("valor-produto").textContent =
        formatarDinheiro(preco);

    document.getElementById("restante").textContent =
        formatarDinheiro(restante);

    if (disponivel < 0) {
        mensagem.textContent = "Seu orçamento já está comprometido.";
        mensagem.style.color = "#b91c1c";

        orientacao.textContent =
            "Suas despesas e sua reserva ultrapassam o saldo disponível. Organize seu orçamento antes de realizar novas compras.";

    } else if (disponivel >= preco) {
        mensagem.textContent = "A compra cabe no seu orçamento!";
        mensagem.style.color = "#15803d";

        orientacao.textContent =
            "Você possui dinheiro suficiente para comprar " +
            produto +
            " sem utilizar o valor reservado para despesas e emergências.";

    } else {
        let falta = preco - disponivel;

        mensagem.textContent = "Melhor esperar um pouco!";
        mensagem.style.color = "#b91c1c";

        orientacao.textContent =
            "Ainda faltam " + formatarDinheiro(falta) +
            " para comprar " + produto +
            " sem comprometer seu orçamento.";
    }

    document.getElementById("resultado").hidden = false;

    document.getElementById("resultado").scrollIntoView({
        behavior: "smooth"
    });
}

form.addEventListener("submit", analisarCompra);

form.addEventListener("reset", function () {
    document.getElementById("resultado").hidden = true;
});

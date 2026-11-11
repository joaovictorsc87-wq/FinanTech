const formularioCadastro = document.querySelector("#form-cadastro");
const mensagemCadastro = document.querySelector("#mensagem-cadastro");

function mostrarMensagemCadastro(texto, tipo = "erro") {
    if (mensagemCadastro) {
        mensagemCadastro.textContent = texto;
        mensagemCadastro.hidden = false;
        mensagemCadastro.className = `mensagem-cadastro ${tipo}`;
    } else {
        alert(texto);
    }
}

if (formularioCadastro) {
    formularioCadastro.addEventListener("submit", function (event) {
        event.preventDefault();

        const nome = document.querySelector("#usuario").value.trim();
        const email = document.querySelector("#mail").value.trim();
        const senha = document.querySelector("#pw").value;

        if (nome === "" || email === "" || senha === "") {
            mostrarMensagemCadastro("Preencha todos os campos.");
            return;
        }

        const usuarioSalvo = localStorage.getItem("usuarioFinanTech");

        if (usuarioSalvo) {
            const usuarioExistente = JSON.parse(usuarioSalvo);

            if (usuarioExistente.email === email) {
                mostrarMensagemCadastro("Este e-mail já está cadastrado.");
                return;
            }
        }

        const usuario = {
            nome: nome,
            email: email,
            senha: senha
        };

        // localStorage mantém os dados mesmo depois de fechar o navegador.
        localStorage.setItem("usuarioFinanTech", JSON.stringify(usuario));

        mostrarMensagemCadastro("Cadastro realizado com sucesso! Redirecionando...", "sucesso");

        setTimeout(function () {
            window.location.href = "loginEntrar.html";
        }, 800);
    });
}

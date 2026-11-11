const formularioLogin = document.querySelector("#form-login");
const mensagemLogin = document.querySelector("#mensagem-login");

function mostrarMensagemLogin(texto, tipo = "erro") {
    if (mensagemLogin) {
        mensagemLogin.textContent = texto;
        mensagemLogin.hidden = false;
        mensagemLogin.className = `mensagem-login ${tipo}`;
    } else {
        alert(texto);
    }
}

if (formularioLogin) {
    formularioLogin.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = document.querySelector("#mail").value.trim();
        const senha = document.querySelector("#pw").value;
        const cadastro = localStorage.getItem("usuarioFinanTech");

        if (email === "" || senha === "") {
            mostrarMensagemLogin("Informe o e-mail e a senha.");
            return;
        }

        if (!cadastro) {
            mostrarMensagemLogin("E-mail não cadastrado. Faça seu cadastro primeiro.");
            return;
        }

        const usuario = JSON.parse(cadastro);

        if (email !== usuario.email || senha !== usuario.senha) {
            mostrarMensagemLogin("E-mail ou senha incorretos.");
            return;
        }

        // sessionStorage identifica que o usuário está logado nesta sessão.
        sessionStorage.setItem("usuarioLogado", "true");
        sessionStorage.setItem("nomeUsuarioFinanTech", usuario.nome);

        window.location.href = "index.html";
    });
}
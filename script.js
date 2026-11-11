const CHAVE_USUARIO = "finantechUsuario";

/**
 * Converte a parte anterior do e-mail em um nome amigável para a saudação.
 * Exemplo: joao.silva@email.com -> Joao Silva.
 *
 * @param {string} email E-mail informado no formulário.
 * @returns {string} Nome formatado para ser exibido na página inicial.
 */
function obterNomeUsuario(email) {
    const parteDoNome = email.split("@")[0]
        .replace(/[._-]+/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    return parteDoNome
        .split(" ")
        .filter(Boolean)
        .map((palavra) => palavra.charAt(0).toUpperCase() + palavra.slice(1).toLowerCase())
        .join(" ");
}

/**
 * Exibe uma mensagem de validação sem alterar o layout principal do formulário.
 *
 * @param {string} mensagem Texto que será mostrado ao usuário.
 */
function exibirMensagemLogin(mensagem) {
    const elementoMensagem = document.getElementById("mensagem-login");

    if (elementoMensagem) {
        elementoMensagem.textContent = mensagem;
        elementoMensagem.hidden = false;
    }
}

/**
 * Valida os campos do formulário e simula o login no navegador.
 * Não há consulta a servidor: o nome é salvo apenas na sessão atual.
 *
 * @param {SubmitEvent} event Evento de envio do formulário.
 */
function validarLogin(event) {
    event.preventDefault();

    const formulario = event.currentTarget;
    const campoEmail = document.getElementById("mail");
    const campoSenha = document.getElementById("pw");
    const email = campoEmail.value.trim();
    const senha = campoSenha.value;
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (email === "") {
        exibirMensagemLogin("Preencha o campo de e-mail.");
        campoEmail.focus();
        return;
    }

    if (!regexEmail.test(email)) {
        exibirMensagemLogin("Digite um e-mail válido.");
        campoEmail.focus();
        return;
    }

    if (senha.trim() === "") {
        exibirMensagemLogin("Preencha o campo de senha.");
        campoSenha.focus();
        return;
    }

    if (senha.length < 6) {
        exibirMensagemLogin("A senha deve ter pelo menos 6 caracteres.");
        campoSenha.focus();
        return;
    }

    const nomeUsuario = obterNomeUsuario(email);
    sessionStorage.setItem(CHAVE_USUARIO, nomeUsuario);
    formulario.reset();
    window.location.href = "index.html";
}

/**
 * Recupera o usuário salvo na sessão e mostra a mensagem de boas-vindas.
 * A mensagem fica oculta quando a página inicial é acessada sem login.
 */
function carregarBoasVindas() {
    const elementoMensagem = document.getElementById("mensagem-boas-vindas");
    const nomeUsuario = sessionStorage.getItem(CHAVE_USUARIO);

    if (elementoMensagem && nomeUsuario) {
        elementoMensagem.textContent = `Olá, ${nomeUsuario}! Seja bem-vindo(a) ao FinanTech.`;
        elementoMensagem.hidden = false;
    }
}


function atualizarCabecalhoUsuario() {
    const areaAcoes = document.getElementById("acoes-usuario");
    const nomeUsuario = sessionStorage.getItem(CHAVE_USUARIO);

    if (!areaAcoes || !nomeUsuario) {
        return;
    }

    areaAcoes.replaceChildren();

    const elementoNome = document.createElement("span");
    elementoNome.className = "usuario-logado";
    elementoNome.textContent = nomeUsuario;

    const botaoSair = document.createElement("button");
    botaoSair.type = "button";
    botaoSair.className = "sair";
    botaoSair.textContent = "Sair";
    botaoSair.addEventListener("click", sair);

    areaAcoes.append(elementoNome, botaoSair);
}


function sair() {
    sessionStorage.removeItem(CHAVE_USUARIO);
    window.location.href = "index.html";
}


document.addEventListener("DOMContentLoaded", () => {
    const formulario = document.getElementById("form-login");

    if (formulario) {
        formulario.addEventListener("submit", validarLogin);
    }

    carregarBoasVindas();
    atualizarCabecalhoUsuario();
});

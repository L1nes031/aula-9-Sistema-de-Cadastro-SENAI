const cep = document.querySelector("#cep");
const logradouro = document.querySelector("#logradouro");
const bairro = document.querySelector("#bairro");
const cidade = document.querySelector("#cidade");
const uf = document.querySelector("#uf");
const mensagemCep = document.querySelector("#mensagemCep");

cep.addEventListener("blur", buscarCep);

async function buscarCep() {

    const valorCep = cep.value.replace(/\D/g, "");

    if (valorCep.length !== 8) {
        mensagemCep.textContent = "Digite um CEP válido!";
        return;
    }

    mensagemCep.textContent = "Buscando endereço...";

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${valorCep}/json/`
        );

        const dados = await resposta.json();

        if (dados.erro) {
            mensagemCep.textContent = "CEP não encontrado!";
            logradouro.value = "";
            bairro.value = "";
            cidade.value = "";
            uf.value = "";
            return;
        }

        logradouro.value = dados.logradouro;
        bairro.value = dados.bairro;
        cidade.value = dados.localidade;
        uf.value = dados.uf;

        mensagemCep.textContent = "Endereço encontrado!";

    } catch (erro) {
        mensagemCep.textContent = "Erro ao consultar o CEP.";
        console.log(erro);
    }
}

const formCadastro = document.querySelector("#formCadastro");
const listaCadastros = document.querySelector("#listaCadastros");

let cadastros = JSON.parse(localStorage.getItem("cadastros")) || [];

let indiceEdicao = null;

function mostrarCadastros() {

    listaCadastros.innerHTML = "";

    cadastros.forEach(function(cadastro, indice) {

        const linha = listaCadastros.insertRow();

        const dados = [
            cadastro.nome,
            cadastro.nascimento,
            cadastro.vinculo,
            cadastro.turma,
            cadastro.cep,
            cadastro.logradouro,
            cadastro.numero,
            cadastro.complemento,
            cadastro.bairro,
            cadastro.cidade,
            cadastro.uf
        ];

        dados.forEach(function(dado) {
            const celula = linha.insertCell();
            celula.textContent = dado;
        });

        const celulaAcoes = linha.insertCell();

        const botaoEditar = document.createElement("button");
        botaoEditar.textContent = "Editar";
        botaoEditar.type = "button";

        botaoEditar.addEventListener("click", function() {
            editarCadastro(indice);
        });

        celulaAcoes.appendChild(botaoEditar);

        const botaoExcluir = document.createElement("button");
        botaoExcluir.textContent = "Excluir";
        botaoExcluir.type = "button";

        botaoExcluir.addEventListener("click", function() {
            excluirCadastro(indice);
        });

        celulaAcoes.appendChild(botaoExcluir);

    });

}

function editarCadastro(indice) {

    const cadastro = cadastros[indice];

    document.querySelector("#nome").value = cadastro.nome;
    document.querySelector("#nascimento").value = cadastro.nascimento;
    document.querySelector("#vinculo").value = cadastro.vinculo;
    document.querySelector("#turma").value = cadastro.turma;
    cep.value = cadastro.cep;
    logradouro.value = cadastro.logradouro;
    document.querySelector("#numero").value = cadastro.numero;
    document.querySelector("#complemento").value = cadastro.complemento;
    bairro.value = cadastro.bairro;
    cidade.value = cadastro.cidade;
    uf.value = cadastro.uf;

    indiceEdicao = indice;

    document.querySelector("#btnCadastrar").textContent = "Salvar alterações";

    formCadastro.scrollIntoView({ behavior: "smooth" });
}

function excluirCadastro(indice) {

    const confirmar = confirm("Deseja realmente excluir este cadastro?");

    if (confirmar) {

        cadastros.splice(indice, 1);

        localStorage.setItem("cadastros", JSON.stringify(cadastros));

        mostrarCadastros();
    }

}

mostrarCadastros();

formCadastro.addEventListener("submit", function(event) {

    event.preventDefault();

    const novoCadastro = {

        nome: document.querySelector("#nome").value,
        nascimento: document.querySelector("#nascimento").value,
        vinculo: document.querySelector("#vinculo").value,
        turma: document.querySelector("#turma").value,
        cep: cep.value,
        logradouro: logradouro.value,
        numero: document.querySelector("#numero").value,
        complemento: document.querySelector("#complemento").value,
        bairro: bairro.value,
        cidade: cidade.value,
        uf: uf.value

    };

    if (indiceEdicao === null) {

        cadastros.push(novoCadastro);

    } else {

        cadastros[indiceEdicao] = novoCadastro;

        indiceEdicao = null;

        document.querySelector("#btnCadastrar").textContent = "Cadastrar";
    }

    localStorage.setItem("cadastros", JSON.stringify(cadastros));

    mostrarCadastros();

    formCadastro.reset();

    mensagemCep.textContent = "";

});
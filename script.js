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
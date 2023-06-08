const procurarConta = (numConta, arr) => arr.find((user) => user.numero === numConta);  // Função para procurar conta por número de conta

//Função para verificar se o corpo da requisição está vazio
const bodyVazio = (obj) => {
    let resposta;

    Object.keys(obj).length === 0 ? resposta = true : resposta = false;

    return resposta
};

const verificarCamposEmBranco = (obj) => {
    return Object.keys(obj).some((elemento) => obj[elemento] === "");
};


module.exports = { procurarConta, bodyVazio, verificarCamposEmBranco };
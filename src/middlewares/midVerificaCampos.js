const { contas } = require('../bancodedados');
const { procurarConta, bodyVazio, verificarCamposEmBranco } = require('../utils/funcoeAuxiliares');


//Intermediario para verificacao de senha
const verificaSenhaObrigatorio = (req, res, next) => {
    const { senha_banco } = req.query;

    const senhaAutorizada = 123;

    if (senha_banco === undefined) {
        return res.status(400).json({ mensagem: "O campo senha é obrigatório!" });
    };

    if (Number(senha_banco) !== senhaAutorizada) {
        return res.status(400).json({ mensagem: "Senha digitada inválida" });
    };

    try {
        return next();
    } catch (error) {
        return res.status(400).json({ messagem: error.message });
    };

};


//intermediario para verificacao de campos obrigatorios
const verificaCamposCriaConta = (req, res, next) => {
    const corpo = req.body;
    const arrBaseUsuarios = contas;

    const camposObrigatorios = ["nome", "cpf", "data_nascimento", "telefone", "email", "senha"];

    const arrDoObjeto = Object.keys(corpo); //Transformado Obj em array

    const verificaTodosOsCampos = camposObrigatorios.every(valor => arrDoObjeto.includes(valor));

    if (!verificaTodosOsCampos) {
        return res.status(400).json({ message: "Erro: Todos os campos devem ser preenchidos corretamente!" });
    };

    try {
        if (verificarCamposEmBranco(corpo)) {
            throw new Error("Existe campos vazios, todos os campos devem ser preenchidos corretamente");
        };

        arrBaseUsuarios.forEach((user) => {
            if (corpo.cpf === user.usuario.cpf) {
                throw new Error("Erro: CPF já cadastrado no sistema");
            };

            if (corpo.email === user.usuario.email) {
                throw new Error("Erro: Este email não pode ser usado, já cadastrado!");
            };
        });

        return next();

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

};

// intermediario para verificacao de campos para atualizacao
const verificaCampoAtualiza = async (req, res, next) => {
    const corpo = req.body;
    const { numeroConta } = req.params;

    const usuarioConta = await procurarConta(numeroConta, contas);
    const { usuario } = usuarioConta;

    const camposValidos = ["nome", "cpf", "email", "data_nascimento", "telefone", "senha", "saldo"];

    if (!usuarioConta) {
        return res.status(400).json({ mensagem: "Usuário não encontrado!" });
    };

    if (Object.keys(corpo).length === 0) {
        return res.status(400).json({ mensagem: "Nenhum campo preenchido" });
    };

    if (verificarCamposEmBranco(corpo)) {
        return res.status(400).json({ mensagem: "Existe campos vazios, todos os campos devem ser preenchidos corretamente" });
    };

    if (isNaN(numeroConta)) {
        return res.status(400).json({ mensagem: "Número inválido" });
    };

    if (corpo.cpf === usuario.cpf) {
        return res.status(400).json({ mensagem: "CPF já cadastrado, não pode ser alterado!" })
    };

    if (corpo.email === usuario.email) {
        return res.status(400).json({ mensagem: "Email já cadastrado, não pode ser alterado!" });
    };

    const keys = Object.keys(corpo);

    const verifica = keys.every((elemento) => camposValidos.includes(elemento));

    if (!verifica) {
        return res.status(400).json({ mensagem: "Campo para atualização  inexistente" });
    };

    if (Object.keys(corpo).includes("cpf") && corpo.cpf !== usuario.cpf) {
        return res.status(400).json({ mensagem: "Conta vinculada a outro CPF, campo não pode ser atualizado" });
    };

    next();

};


// intermediario para verificacao de campos para deposito
const verificaDeposito = async (req, res, next) => {
    const corpo = req.body;
    const { numero, valor } = corpo;

    const usuario = await procurarConta(numero, contas);

    try {

        if (bodyVazio(corpo)) {
            throw new Error("Campo vazio, preencha os campos solicitados");
        };

        if (verificarCamposEmBranco(corpo)) {
            throw new Error("Existe campos vazios, todos os campos devem ser preenchidos corretamente");
        };

        if (isNaN(numero)) {
            throw new Error("Número da conta inválido");
        };

        if (!usuario) {
            throw new Error("Número de conta não encontrado");
        };

        if (Number(valor) <= 0) {
            throw new Error("Depósito inválido! Não permitido, valor para depósito deve ser maior que zero");
        };

        if (isNaN(valor)) {
            throw new Error("Valor inválido!");
        };

        next();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    };

};

// intermediario para verificacao de campos para saque
const verificaSaque = async (req, res, next) => {
    const corpo = req.body;
    const { senha } = req.query;
    const { numero, valor } = corpo;

    const usuarioConta = await procurarConta(numero, contas);

    try {

        if (bodyVazio(corpo)) {
            throw new Error("Campo vazio, preencha os campos solicitados");
        };

        if (verificarCamposEmBranco(corpo)) {
            throw new Error("Existe campos vazios, todos os campos devem ser preenchidos corretamente");
        };

        if (isNaN(numero)) {
            throw new Error("Número da conta inválido");
        };

        if (!usuarioConta) {
            throw new Error("Número de conta não encontrado");
        };

        if (senha !== usuarioConta.usuario.senha) {
            throw new Error("Senha inválida");
        };

        if (usuarioConta.saldo < Number(valor)) {
            throw new Error("Saldo insuficiente para saque");
        };

        if (Number(valor) <= 0) {
            throw new Error("Valor para saque incorreto!");
        };

        if (isNaN(valor)) {
            throw new Error("Valor inválido!");
        };

        next();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    };

};

// intermediario para verificacao de campos de transferencia
const verificaTransferencia = async (req, res, next) => {
    const corpo = req.body;
    const { numero_conta_origem, numero_conta_destino, senha_origem, valor } = corpo;

    const camposObrigatorios = ["numero_conta_origem", "numero_conta_destino", "senha_origem", "valor"];

    const verifica = camposObrigatorios.every((elemento) => Object.keys(corpo).includes(elemento));

    const usuarioOrigem = await procurarConta(numero_conta_origem, contas);
    const usuarioDestino = await procurarConta(numero_conta_destino, contas);

    try {

        if (bodyVazio(corpo)) {
            throw new Error("Campo vazio, preencha os campos solicitados");
        };

        if (!verifica) {
            throw new Error("Todos os campos devem ser preenchidos corretamente");
        };

        if (verificarCamposEmBranco(corpo)) {
            throw new Error("Existe campos vazios, todos os campos devem ser preenchidos corretamente");
        };

        if (!usuarioOrigem) {
            throw new Error("Conta de origem não encontrada");
        };

        if (!usuarioDestino) {
            throw new Error("Conta de destino não encontrada");
        };

        if (isNaN(senha_origem) || senha_origem === undefined || usuarioOrigem.usuario.senha !== senha_origem) {
            throw new Error("Senha inválida!");
        };

        if (Number(valor) > usuarioOrigem.saldo) {
            throw new Error("Conta não possui saldo suficiente para transferência");
        };

        if (isNaN(valor) || valor <= 0) {
            throw new Error("Valor de transferência inválido!");
        }

        next();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    }
};

// intermediario para verificacao de campos de consulta de saldo
const verificaSaldo = async (req, res, next) => {
    const { numero_conta, senha } = req.query;

    const usuarioConta = await procurarConta(numero_conta, contas);

    try {
        if (numero_conta === undefined || senha === undefined) {
            throw new Error("Número da conta ou senha não informada!, favor preencher campos obrigatórios!");
        };

        if (isNaN(numero_conta)) {
            throw new Error("Número de conta inválido");
        };

        if (!usuarioConta) {
            throw new Error("Conta não encontrada");
        };

        if (isNaN(senha) || senha !== usuarioConta.usuario.senha) {
            throw new Error("Senha inválida");
        };

        next();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    };
};

const verificaExtrato = async (req, res, next) => {
    const { numero_conta, senha } = req.query;

    const usuarioConta = await procurarConta(numero_conta, contas);

    try {
        if (numero_conta === undefined || senha === undefined) {
            throw new Error("Número da conta ou senha não informada!, favor preencher campos obrigatórios!");
        };

        if (isNaN(numero_conta)) {
            throw new Error("Número de conta inválido");
        };

        if (!usuarioConta) {
            throw new Error("Conta não encontrada");
        };

        if (isNaN(senha) || senha !== usuarioConta.usuario.senha) {
            throw new Error("Senha inválida");
        };

        next();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    };
};

const verificaDeletarConta = async (req, res, next) => {
    const { numeroConta } = req.params;

    const conta = await procurarConta(numeroConta, contas);

    try {
        if (isNaN(numeroConta)) {
            throw new Error("Número de conta inválido");
        };

        if (!conta) {
            throw new Error("Número de conta inexistente");
        }

        if (conta.saldo > 0) {
            throw new Error("Conta com saldo maior que R$ 0,00, não pode ser excluída!");
        };

        next();

    } catch (error) {
        return res.status(400).json({ mensagem: error.message });
    };
};

module.exports = { verificaSenhaObrigatorio, verificaCamposCriaConta, verificaCampoAtualiza, verificaDeposito, verificaSaque, verificaTransferencia, verificaSaldo, verificaExtrato, verificaDeletarConta };
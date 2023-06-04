const bancoDeDados = require('../bancodedados');


//Intermediario para verificacao de senha
const verificaSenhaObrigatorio = (req, res, next) => {
    const { senha_banco } = req.query;

    const senhaAutorizada = 123;

    if (senha_banco === undefined) {
        return res.status(400).json({ "mensagem": "O campo senha é obrigatório!" });
    };

    if (Number(senha_banco) !== senhaAutorizada) {
        return res.status(400).json({ "mensagem": "Senha digitada inválida" });
    };

    try {
        return next();
    } catch (error) {
        return res.status(400).json({ "messagem": error.message });
    };

};


//intermediario para verificacao de campos obrigatorios
const verificaCamposCriaConta = (req, res, next) => {
    const corpo = req.body;
    const arrBaseUsuarios = bancoDeDados.contas;

    const camposObrigatorios = ["nome", "cpf", "data_nascimento", "telefone", "email", "senha"];


    const arrDoObjeto = Object.keys(corpo); //Transformado Obj em array

    const verificaTodosOsCampos = camposObrigatorios.every(valor => arrDoObjeto.includes(valor));

    if (!verificaTodosOsCampos) {
        return res.status(400).json({ "message": "Erro: Todos os campos devem ser preenchidos corretamente!" });
    };

    try {
        arrBaseUsuarios.forEach((usuario) => {
            if (corpo.cpf === usuario.cpf) {
                throw new Error("Erro: CPF já cadastrado no sistema");
            };

            if (corpo.email === usuario.email) {
                throw new Error("Erro: Este email não pode ser usado, já cadastrado!");
            };
        });

        return next();

    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

};

// intermediario para verificacao de campos para atualizacao
const verificaCampoAtualiza = (req, res, next) => {

    const corpo = req.body;
    const { numeroConta } = req.params;
    const usuario = bancoDeDados.contas.find((user) => user.numero === numeroConta);

    const camposValidos = ["nome", "cpf", "email", "data_nascimento", "telefone", "senha", "saldo"];

    try {

        if (!usuario) {
            return res.status(400).json({ "mensagem": "Usuário não encontrado!" })
        };

        if (Object.keys(corpo).length === 0) {
            return res.status(400).json({ "mensagem": "Nenhum campo preenchido" });
        };

        if (isNaN(numeroConta)) {
            return res.status(400).json({ "mensagem": "Número inválido" })
        };

        if (corpo.cpf === usuario.cpf) {
            return res.status(400).json({ "mensagem": "CPF já cadastrado, não pode ser alterado!" });
        };

        if (corpo.email === usuario.email) {
            return res.status(400).json({ "mensagem": "Email já cadastrado, não pode ser alterado!" });
        };

        const keys = Object.keys(corpo);

        const verifica = keys.every((elemento) => camposValidos.includes(elemento));

        if (!verifica) {
            return res.status(400).json({ "mensagem": "Campo para atualização  inexistente" });
        };

        next();

    } catch (error) {
        return res.status(400).json({ "mensagem": error.mensagem });
    }

};

// intermediario para verificacao de campos para deposito
const verificaDeposito = (req, res, next) => {
    const corpo = req.body;
    const { numero, valor } = corpo;

    const usuario = bancoDeDados.contas.find((conta) => conta.numero === numero);

    try {
        if (Object.keys(corpo).length === 0) {
            throw new Error("Campo vazio, preencha os campos solicitados");
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

        next();

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    };

};

// intermediario para verificacao de campos para saque
const verificaSaque = (req, res, next) => {
    const corpo = req.body;
    const { senha } = req.query;
    const { numero, valor } = corpo;

    const usuario = bancoDeDados.contas.find((conta) => conta.numero === numero);

    try {
        if (Object.keys(corpo).length === 0) {
            throw new Error("Campo vazio, preencha os campos solicitados");
        };

        if (isNaN(numero)) {
            throw new Error("Número da conta inválido");
        };

        if (!usuario) {
            throw new Error("Número de conta não encontrado");
        };

        if (senha !== usuario.senha) {
            throw new Error("Senha inválida");
        };

        if (usuario.saldo < Number(valor)) {
            throw new Error("Saldo insuficiente para saque");
        };

        next();

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    };

};

// intermediario para verificacao de campos de transferencia
const verificaTransferencia = (req, res, next) => {
    const corpo = req.body;

    const camposObrigatorios = ["numero_conta_origem", "numero_conta_destino", "senha_origem", "valor"];

    const verifica = camposObrigatorios.every((elemento) => Object.keys(corpo).includes(elemento));

    const usuarioOrigem = bancoDeDados.contas.find((userOrig) => userOrig.numero === corpo.numero_conta_origem);
    const usuarioDestino = bancoDeDados.contas.find((userDest) => userDest.numero === corpo.numero_conta_destino);

    try {
        if (Object.keys(corpo).length === 0) {
            throw new Error("Campo vazio, preencha os campos solicitados");
        };

        if (!verifica) {
            throw new Error("Todos os campos devem ser preenchidos corretamente");
        };

        if (!usuarioOrigem) {
            throw new Error("Conta de origem não encontrada");
        };

        if (!usuarioDestino) {
            throw new Error("Conta de destino não encontrada");
        };

        if (isNaN(corpo.senha_origem) || corpo.senha_origem === undefined || usuarioOrigem.senha !== corpo.senha_origem) {
            throw new Error("Senha inválida!");
        };

        if (Number(corpo.valor) > usuarioOrigem.saldo) {
            throw new Error("Conta não possui saldo suficiente para transferência");
        };

        if (isNaN(corpo.valor) || corpo.valor <= 0) {
            throw new Error("Valor de transferência inválido!");
        }

        next();

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    }
};

// intermediario para verificacao de campos de consulta de saldo
const verificaSaldo = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    const usuario = bancoDeDados.contas.find((user) => user.numero === numero_conta);

    try {
        if (numero_conta === undefined || senha === undefined) {
            throw new Error("Número da conta ou senha não informada!, favor preencher campos obrigatórios!");
        };

        if (isNaN(numero_conta)) {
            throw new Error("Número de conta inválido");
        };

        if (!usuario) {
            throw new Error("Conta não encontrada");
        };

        if (isNaN(senha) || senha !== usuario.senha) {
            throw new Error("Senha inválida");
        };

        next();

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    };
};

const verificaExtrato = (req, res, next) => {
    const { numero_conta, senha } = req.query;

    const usuario = bancoDeDados.contas.find((user) => user.numero === numero_conta);

    try {
        if (numero_conta === undefined || senha === undefined) {
            throw new Error("Número da conta ou senha não informada!, favor preencher campos obrigatórios!");
        };

        if (isNaN(numero_conta)) {
            throw new Error("Número de conta inválido");
        };

        if (!usuario) {
            throw new Error("Conta não encontrada");
        };

        if (isNaN(senha) || senha !== usuario.senha) {
            throw new Error("Senha inválida");
        };

        next();

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    };
};

module.exports = { verificaSenhaObrigatorio, verificaCamposCriaConta, verificaCampoAtualiza, verificaDeposito, verificaSaque, verificaTransferencia, verificaSaldo, verificaExtrato };
const bancoDeDados = require('../bancodedados');
const { format } = require('date-fns');

const listaConta = (req, res) => {
    return res.status(200).json(bancoDeDados.contas);
};

const criarConta = (req, res) => {
    const corpo = req.body;

    const ultimaConta = bancoDeDados.contas[bancoDeDados.contas.length - 1];

    const novaConta = {
        "numero": bancoDeDados.contas.length === 0 ? "1" : JSON.stringify(Number(ultimaConta.numero) + 1),
        "saldo": 0,
        ...corpo
    };

    bancoDeDados.contas.push(novaConta);

    return res.status(201).json(novaConta);
};

const atualzaConta = (req, res) => {
    const corpo = req.body;
    const { numeroConta } = req.params;
    const usuario = bancoDeDados.contas.find((user) => user.numero === numeroConta);

    const keys = Object.keys(corpo);

    for (let i of keys) {
        usuario[i] = corpo[i];
    };

    return res.status(200).json({ "menssagem": "Conta atualizada com sucesso!" });

};

const excluirConta = (req, res) => {
    const { numeroConta } = req.params;

    const conta = bancoDeDados.contas.find((conta) => conta.numero === numeroConta);

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

        const index = bancoDeDados.contas.indexOf(conta);

        bancoDeDados.contas.splice(index, 1);

        return res.status(200).json({ "mensagem": "Conta excluída com sucesso!" });

    } catch (error) {
        return res.status(400).json({ "mensagem": error.message });
    };
};

const depositar = (req, res) => {
    const { numero, valor, data } = req.body;

    const conta = bancoDeDados.contas.find((cont) => cont.numero === numero);

    const dataInput = new Date(data);

    conta.saldo += Number(valor);

    const registro = {
        "data": format(dataInput, 'yyyy-MM-dd HH:mm:ss'),
        "numero_conta": numero,
        "valor": Number(valor)
    };

    bancoDeDados.depositos.push(registro);

    return res.status(200).json(({ "mensagem": "Depósito realizado com sucesso!" }));
};

const sacar = (req, res) => {
    const { numero, valor } = req.body;

    const conta = bancoDeDados.contas.find((cont) => cont.numero === numero);

    const data = new Date();

    conta.saldo -= Number(valor);

    const registro = {
        "data": format(data, 'yyyy-MM-dd HH:mm:ss'),
        "numero_conta": numero,
        "valor": Number(valor)
    };

    bancoDeDados.saques.push(registro);

    return res.status(200).json({ "mensagem": "Saque realiazado com sucesso!" });
};

const transferencia = (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;

    const userOrigem = bancoDeDados.contas.find((user) => user.numero === numero_conta_origem);
    const userDestino = bancoDeDados.contas.find((user) => user.numero === numero_conta_destino);

    userOrigem.saldo -= Number(valor);
    userDestino.saldo += Number(valor);

    const data = new Date();

    const registro = {
        "data": format(data, "yyyy-MM-dd HH:mm:ss"),
        "numero_conta_origem": userOrigem.numero,
        "numero_conta_destino": userDestino.numero,
        "valor": Number(valor)
    };

    bancoDeDados.transferencias.push(registro);

    return res.status(200).json({ "mensagem": "Transferência realizada com sucesso!" });
};

const saldo = (req, res) => {
    const { numero_conta } = req.query;

    const usuario = bancoDeDados.contas.find((user) => user.numero === numero_conta);

    return res.status(200).json({ "saldo": usuario.saldo });
};

const extrato = (req, res) => {
    const { numero_conta } = req.query;

    const registroDeposito = bancoDeDados.depositos.filter((user) => user.numero_conta === numero_conta);
    const registroSaque = bancoDeDados.saques.filter((user) => user.numero_conta === numero_conta);
    const arrTransferencias = bancoDeDados.transferencias
    const enviadas = arrTransferencias.filter((userEnv) => userEnv.numero_conta_origem === numero_conta);
    const recebidas = arrTransferencias.filter((userRec) => userRec.numero_conta_destino === numero_conta);

    const registro = {
        "depositos": registroDeposito,
        "saques": registroSaque,
        "transferenciasEnviadas": enviadas,
        "transferenciasRecebidas": recebidas
    };

    return res.status(200).json(registro);
};

module.exports = { listaConta, criarConta, atualzaConta, excluirConta, depositar, sacar, transferencia, saldo, extrato };
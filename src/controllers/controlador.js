const { contas, depositos, saques, transferencias } = require('../bancodedados');
const { format } = require('date-fns');
const { procurarConta } = require('../utils/funcoeAuxiliares');

const listaConta = (_req, res) => {
    return res.status(200).json(contas);
};

const criarConta = (req, res) => {
    const corpo = req.body;

    const ultimaConta = contas[contas.length - 1];

    const novaConta = {
        numero: contas.length === 0 ? "1" : JSON.stringify(Number(ultimaConta.numero) + 1),
        saldo: 0,
        usuario: {
            ...corpo
        }
    };

    contas.push(novaConta);

    return res.status(201).json(novaConta);
};

const atualzaConta = async (req, res) => {
    const corpo = req.body;
    const { numeroConta } = req.params;

    const usuarioConta = await procurarConta(numeroConta, contas);

    const keys = Object.keys(corpo);

    for (let i of keys) {
        usuarioConta.usuario[i] = corpo[i];
    };

    return res.status(200).json({ mensagem: "Conta atualizada com sucesso!" });

};

const excluirConta = async (req, res) => {
    const { numeroConta } = req.params;

    const conta = await procurarConta(numeroConta, contas);

    const index = contas.indexOf(conta);

    contas.splice(index, 1);

    return res.status(200).json({ mensagem: "Conta excluída com sucesso!" });
};

const depositar = async (req, res) => {
    const { numero, valor } = req.body;

    const conta = await procurarConta(numero, contas);

    const data = new Date();

    conta.saldo += Number(valor);

    const registro = {
        data: format(data, 'yyyy-MM-dd HH:mm:ss'),
        numero_conta: numero,
        valor: Number(valor)
    };

    depositos.push(registro);

    return res.status(200).json(({ mensagem: "Depósito realizado com sucesso!" }));
};

const sacar = async (req, res) => {
    const { numero, valor } = req.body;

    const conta = await procurarConta(numero, contas);

    const data = new Date();

    conta.saldo -= Number(valor);

    const registro = {
        data: format(data, 'yyyy-MM-dd HH:mm:ss'),
        numero_conta: numero,
        valor: Number(valor)
    };

    saques.push(registro);

    return res.status(200).json({ mensagem: "Saque realiazado com sucesso!" });
};

const transferencia = async (req, res) => {
    const { numero_conta_origem, numero_conta_destino, valor } = req.body;

    const userOrigem = await procurarConta(numero_conta_origem, contas);
    const userDestino = await procurarConta(numero_conta_destino, contas);

    userOrigem.saldo -= Number(valor);
    userDestino.saldo += Number(valor);

    const data = new Date();

    const registro = {
        data: format(data, "yyyy-MM-dd HH:mm:ss"),
        numero_conta_origem: userOrigem.numero,
        numero_conta_destino: userDestino.numero,
        valor: Number(valor)
    };

    transferencias.push(registro);

    return res.status(200).json({ mensagem: "Transferência realizada com sucesso!" });
};

const saldo = async (req, res) => {
    const { numero_conta } = req.query;

    const usuario = await procurarConta(numero_conta, contas);

    return res.status(200).json({ saldo: usuario.saldo });
};

const extrato = (req, res) => {
    const { numero_conta } = req.query;

    const registroDeposito = depositos.filter((user) => user.numero_conta === numero_conta);
    const registroSaque = saques.filter((user) => user.numero_conta === numero_conta);
    const arrTransferencias = transferencias
    const enviadas = arrTransferencias.filter((userEnv) => userEnv.numero_conta_origem === numero_conta);
    const recebidas = arrTransferencias.filter((userRec) => userRec.numero_conta_destino === numero_conta);

    const registro = {
        depositos: registroDeposito,
        saques: registroSaque,
        transferenciasEnviadas: enviadas,
        transferenciasRecebidas: recebidas
    };

    return res.status(200).json(registro);
};

module.exports = { listaConta, criarConta, atualzaConta, excluirConta, depositar, sacar, transferencia, saldo, extrato };
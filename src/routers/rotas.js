const express = require('express');
const rota = express.Router();

const { verificaSenhaObrigatorio, verificaCamposCriaConta, verificaCampoAtualiza, verificaDeposito, verificaSaque, verificaTransferencia, verificaSaldo, verificaExtrato, verificaDeletarConta } = require('../middlewares/midVerificaCampos');

const { listaConta, criarConta, atualzaConta, excluirConta, depositar, sacar, transferencia, saldo, extrato } = require('../controllers/controlador');


rota.get('/contas', verificaSenhaObrigatorio, listaConta); // Listar contas

rota.post('/contas', verificaCamposCriaConta, criarConta); // Criar conta

rota.put('/contas/:numeroConta/usuario', verificaCampoAtualiza, atualzaConta); // Atualizar conta

rota.delete('/contas/:numeroConta', verificaDeletarConta, excluirConta) // Excluir conta

rota.post('/transacoes/depositar', verificaDeposito, depositar); // Depositar Valor na conta

rota.post('/transacoes/sacar', verificaSaque, sacar); // Sacar valor na conta

rota.post('/transacoes/transferir', verificaTransferencia, transferencia); // Transferencia de valores entre contas

rota.get('/contas/saldo', verificaSaldo, saldo); // Consulta de saldo de conta

rota.get('/contas/extrato', verificaExtrato, extrato); // Consulta de extrato da conta


module.exports = rota;
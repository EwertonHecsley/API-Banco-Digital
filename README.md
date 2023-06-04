# API de Banco Digital

Esta é uma RESTful API para um Banco Digital, desenvolvida como um projeto piloto para uma instituição **FINANCEIRA**. A API permite a criação de contas bancárias, atualização de dados do usuário, depósitos, saques, transferências, consulta de saldo e emissão de extrato bancário.

## Funcionalidades

- Listar contas bancárias existentes
- Criar uma nova conta bancária
- Atualizar os dados do usuário da conta bancária
- Excluir uma conta bancária
- Realizar depósitos em uma conta bancária
- Realizar saques de uma conta bancária
- Transferir valores entre contas bancárias
- Consultar saldo de uma conta bancária
- Emitir extrato bancário

## Requisitos

- A API segue o padrão REST
- A estrutura de dados é persistida em memória, no objeto existente no arquivo bancodedados.js
- Todos os valores monetários são representados em centavos
- O código está organizado em arquivos distintos, delimitando as responsabilidades de cada um
- Evite códigos duplicados, centralizando funcionalidades comuns em funções

## Endpoints

### Listar contas bancárias
```
GET /contas?senha_banco=123
```
Este endpoint lista todas as contas bancárias existentes.

- Verifica se a senha do banco foi informada
- Valida se a senha do banco está correta

### Criar conta bancária
```
POST /contas
```
Este endpoint cria uma nova conta bancária.

- Verifica se todos os campos obrigatórios foram informados
- Cria uma nova conta com um número único e saldo inicial de 0

### Atualizar usuário da conta bancária
```
PUT /contas/:numeroConta/usuario
```
Este endpoint atualiza os dados do usuário de uma conta bancária.

- Verifica se ao menos um campo foi passado no corpo da requisição
- Verifica se o número da conta é válido
- Verifica se o CPF informado já existe em outro registro
- Verifica se o E-mail informado já existe em outro registro

### Excluir conta bancária
```
DELETE /contas/:numeroConta
```
Este endpoint exclui uma conta bancária existente.

- Verifica se o número da conta é válido
- Permite excluir a conta apenas se o saldo for 0

### Depositar
```
POST /transacoes/depositar
```
Este endpoint realiza um depósito em uma conta bancária.

- Verifica se o número da conta e o valor do depósito foram informados
- Verifica se a conta bancária informada existe
- Não permite depósitos com valores negativos ou zerados
- Soma o valor do depósito ao saldo da conta

### Sacar
```
POST /transacoes/sacar
```
Este endpoint realiza um saque em uma conta bancária.

- Verifica se o número da conta, o valor do saque e a senha foram informados
- Verifica se a conta bancária informada existe
- Verifica se a senha informada é válida para a conta informada
- Verifica se há saldo disponível para o saque
- Subtrai o valor sacado do saldo da conta

### Transferir
```
POST /transacoes/transferir
```
Este endpoint realiza uma transferência de recursos entre contas bancárias.

- Verifica se o número das contas, o valor da transferência e a senha foram informados
- Verifica se as contas bancárias informadas existem
- Verifica se a senha informada é válida para a conta de origem
- Verifica se há saldo disponível para a transferência
- Subtrai o valor transferido do saldo da conta de origem e adiciona ao saldo da conta de destino

### Consultar saldo
```
GET /contas/:numeroConta/saldo
```
Este endpoint consulta o saldo de uma conta bancária.

- Verifica se o número da conta é válido
- Retorna o saldo da conta bancária

### Emitir extrato
```
GET /contas/:numeroConta/extrato
```
Este endpoint emite o extrato bancário de uma conta bancária.

- Verifica se o número da conta é válido
- Retorna o extrato bancário contendo todas as transações realizadas

---

## Instruções de Instalação e Configuração

1. Clone o repositório:


```bash
git clone https://github.com/seu-usuario/seu-repositorio.git

```

2. Acesse o diretório do projeto:

```bash
cd seu-repositorio
```

3. Instale as dependências:

```bash
npm install
```

4. Renomeie o arquivo **.env.example** para **.env**

5. Abra o arquivo .env e defina as variáveis de ambiente necessárias, como as credenciais do banco de dados ou quaisquer outras configurações relevantes para o seu projeto.

Exemplo de arquivo .env:

```bash
PORT=3000
DB_HOST=localhost
DB_USER=seu-usuario
DB_PASSWORD=sua-senha
```


Espero que isso atenda às suas expectativas. Se você tiver mais alguma solicitação, por favor, avise-me!

[LinkedIn](https://www.linkedin.com/in/ewerton-hecsley-8a613992/?trk)


## Contribuição

Se você quiser contribuir para este projeto, siga as etapas abaixo:

1. Faça um fork deste repositório
2. Crie uma branch para sua nova feature (`git checkout -b feature/nova-feature`)
3. Faça commit de suas alterações (`git commit -am 'Adicione uma nova feature'`)
4. Faça push para a branch (`git push origin feature/nova-feature`)
5. Abra uma Pull Request

## Licença

Este projeto está licenciado sob a Licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.


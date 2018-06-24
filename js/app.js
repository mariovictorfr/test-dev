var xhr = new XMLHttpRequest();

//Função para inserir ou atualizar um registro
function add() {
    var data = {};
    data.nome = document.getElementById('nome').value;
    data.marca = document.getElementById('marca').value;
    data.preco = document.getElementById('preco').value;
    var json = JSON.stringify(data);

    //se o id for informado irá atualizar o registro pelo método PUT, se não cria um novo registro com POST
    if (!document.getElementById('id').value) {
        //url da API
        var url = "http://localhost:8000/api/carros";
        //método utilizado
        xhr.open("POST", url, true);
    } else {
        id = document.getElementById('id').value;
        var url = `http://localhost:8000/api/carros/${id}`;
        xhr.open("PUT", url, true);
    }

    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8');
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        //verifica o resultado da requisição
        if (xhr.readyState == 4 && xhr.status == "201") {
            //exibe alerta para informar o usuário
            alert('bg-success', 'Cadastro efetuado com sucesso.');
            //atualiza a tabela de carros
            getAll();
        } else {
            //se houver algum erro exibe no alerta
            alert('bg-danger', 'Erro: ' + resp);
        }
    }
    xhr.send(json);
    //reseta o formulário
    document.getElementById('form').reset();
    //altera o título do formulário
    document.getElementById('form-title').innerText = "Cadastrar Novo Carro";
}

//Função para buscar todos os registros
function getAll() {
    var url = "http://localhost:8000/api/carros";

    xhr.open('GET', url, true);
    xhr.onload = function () {
        var resp = JSON.parse(xhr.responseText);
        if (xhr.readyState == 4 && xhr.status == "200") {
            //passa os registros para a função que gera os resultados em forma de tabela
            table(resp);
            //alert('bg-success', 'Sucesso');
        } else {
            alert('bg-danger', 'Erro: ' + resp);
        }
    }
    xhr.send(null);
}

//Função para deletar um registro pelo id informado
function del(id) {
    if (id) {
        var url = `http://localhost:8000/api/carros/${id}`;

        xhr.open("DELETE", url, true);
        xhr.onload = function () {
            var resp = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                alert('bg-success', 'Cadastro excluído com sucesso.');
                getAll();
            } else {
                alert('bg-danger', 'Erro: ' + resp);
            }
        }
        xhr.send(null);
    }
}

//Função para buscar o registro do carro com o id informado
function update(id) {
    if (id) {
        var url = `http://localhost:8000/api/carros/${id}`;

        //altera o título do form
        document.getElementById('form-title').innerHTML = "Editar Cadastro de Carro";

        xhr.open('GET', url, true);
        xhr.onload = function () {
            var resp = JSON.parse(xhr.responseText);
            if (xhr.readyState == 4 && xhr.status == "200") {
                //registro encontrado e inserido os valores no form
                document.getElementById('id').value = resp.id;
                document.getElementById('nome').value = resp.nome;
                document.getElementById('marca').value = resp.marca;
                document.getElementById('preco').value = resp.preco;
            } else {
                alert('bg-danger', 'Erro: ' + resp);
            }
        }
        xhr.send(null);
    }
}

//Função para gerar as linhas da tabela de registros
function table(resp) {
    //Verifica se existem registros
    if (resp.length > 0) {
        var carros = document.getElementById('carros');
        carros.innerHTML = '';
        var html = '';
        for (const x in resp) {
            html += '<tr>';
            html += `<td>${resp[x].id}</td>`
            html += `<td>${resp[x].nome}</td>`
            html += `<td>${resp[x].marca}</td>`
            html += `<td>R$ ${resp[x].preco}</td>`
            html += `<td><div class="btn-group">
                    <div class="tooltip">
                        <button class="btn btn-sm bg-primary" onclick="update(${resp[x].id})">
                            <span class="fa fa-pen"></span>
                        </button>
                        <span class="tooltip-text">Editar</span>
                    </div>
                    <div class="tooltip">
                        <button class="btn btn-sm bg-danger" onclick="del(${resp[x].id})">
                            <span class="fa fa-trash"></span>
                        </button>
                        <span class="tooltip-text">Deletar</span>
                    </div>
                </div></td>`;
            html += '</tr>';
        }
        carros.innerHTML = html;
    } else {
        var carros = document.getElementById('carros');
        carros.innerHTML = '<td colspan="5">Não há carros cadastrados.</td>';
    }
}

//Função que exibe o alerta. Recebe a classe do alerta e a mensagem que será exibida
function alert(bg, msg) {
    //define a calsse
    document.getElementById('alert').className = 'alert ' + bg;
    //define a mensagem
    document.getElementById("alert").innerText = msg;
    //exibe o alerta
    document.getElementById("alert").style.display = "block";
    //oculta o alerta após 10 segundos
    setTimeout(function () { document.getElementById('alert').style.display = 'none' }, 10000);
}

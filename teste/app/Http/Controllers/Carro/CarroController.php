<?php

namespace App\Http\Controllers\Carro;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Carro;
use Illuminate\Support\Facades\Storage;

class CarroController extends Controller
{
    //Retorna todos os registros
    public function getAll(Request $request)
    {
        //verifica se o arquivo existe
        if (Storage::exists('carros.json')) {
            $carros = json_decode(Storage::get('carros.json'), true);
            if (!is_null($carros['carros'])) {
                return response()->json($carros['carros']);
            }
            return response()->json('not_found', 404);
        }
        return response()->json('file_not_found', 404);
    }

    //Retorna um registro pelo id
    public function get(Request $request, $id)
    {
        if (Storage::exists('carros.json')) {
            $carros = json_decode(Storage::get('carros.json'), true);
            foreach ($carros['carros'] as $key => $value) {
                if ($value['id'] == $id) {
                    return response()->json($value);
                }
            }
            return response()->json('not_found', 404);
        }
        return response()->json('file_not_found', 404);
    }

    //Adiciona um registro
    public function add(Request $request)
    {
        //verifica se a request não está vazia
        if (!is_null($request)) {
            //verifica se o arquivo carros.json existe 
            if (!Storage::exists('carros.json')) {
                //cria o arquivo carros.json se não existir
                Storage::put('carros.json', '');
            }
            //recebe os valores do arquivo carros e decodifica para array
            $carros = json_decode(Storage::get('carros.json'), true);
            $id = 0;
            //verifica se o id existe no arquivo. Utilizado para id autoincremental
            if (is_array($carros) && array_key_exists('id', $carros)) {
                $id = $carros['id'];
            }

            //Declara um novo objeto carro
            $carro = new Carro;
            $carro->id = $id + 1;
            $carro->nome = $request->input('nome');
            $carro->marca = $request->input('marca');
            $carro->preco = $request->input('preco');

            //adiciona o carro aos registros de carros
            $carros['carros'][] = $carro;
            //altera o valor do id para o último id cadastrado
            $carros['id'] = $id + 1;

            //altera o valor do arquivo carros.json
            Storage::put('carros.json', json_encode($carros));

            return response()->json('ok', 201);
        }
        return response()->json('request_null', 400);
    }

    //Atualiza um registro pelo id
    public function put(Request $request, $id)
    {
        //verifica se a requisição não está vazia
        if (!is_null($request)) {
            //verifica se o arquivo existe
            if (Storage::exists('carros.json')) {
                //recebe os valores do arquivo
                $carros = json_decode(Storage::get('carros.json'), true);
                //buscar o registro com o id informado
                foreach ($carros['carros'] as $key => $value) {
                    //se encontrar o id, atualiza os valores e insere novamente no arquivo
                    if ($value['id'] == $id) {
                        $carro = new Carro;
                        $carro->id = $id;
                        $carro->nome = $request->input('nome');
                        $carro->marca = $request->input('marca');
                        $carro->preco = $request->input('preco');
                        $carros['carros'][$key] = $carro;

                        Storage::put('carros.json', json_encode($carros));
                        return response()->json('ok', 201);
                    }
                }
                return response()->json('not_found', 404);
            }
            return response()->json('file_not_found', 404);
        }
        return response()->json('request_null', 400);
    }

    //Deleta um registro pelo id
    public function delete(Request $request, $id)
    {
        if (Storage::exists('carros.json')) {
            $carros = json_decode(Storage::get('carros.json'), true);

            //busca o registro com o id informado
            foreach ($carros['carros'] as $key => $value) {
                if ($value['id'] == $id) {
                    //se encontrado, remove o registro do array e insere no arquivo atualizado
                    unset($carros['carros'][$key]);
                    Storage::put('carros.json', json_encode($carros));
                    return response()->json('ok', 200);
                }
            }
            return response()->json('not_found', 404);
        }
        return response()->json('file_not_found', 404);
    }
}

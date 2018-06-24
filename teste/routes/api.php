<?php

use Illuminate\Http\Request;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::group(['middleware' =>['web'], 'namespace' => 'Carro\\'], function(){
    Route::get('carros', 'CarroController@getAll');
    Route::post('carros', 'CarroController@add');
    Route::get('carros/{id}', 'CarroController@get');
    Route::put('carros/{id}', 'CarroController@put');
    Route::delete('carros/{id}', 'CarroController@delete');
});

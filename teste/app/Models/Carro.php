<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Carro extends Model
{
    protected $fillable = ['id', 'nome', 'marca', 'preco'];
}

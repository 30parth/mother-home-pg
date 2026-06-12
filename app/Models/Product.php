<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'price',
        'description',
        'sales_rate',
        'purchase_rate',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'sales_rate' => 'decimal:2',
        'purchase_rate' => 'decimal:2',
    ];
}

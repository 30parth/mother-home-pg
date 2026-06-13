<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    use SoftDeletes;
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

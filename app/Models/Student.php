<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'month_rent',
        'contact_no',
        'due_date',
    ];

    protected $casts = [
        'month_rent' => 'decimal:2',
        'due_date' => 'integer',
    ];
}

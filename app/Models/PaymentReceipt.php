<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;

class PaymentReceipt extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'date',
        'property_id',
        'payment_mode',
        'student_name',
        'room_number',
        'month',
        'security_deposit',
        'electricity_deposit',
        'advance_rent',
        'total',
        'received_by',
    ];

    protected $casts = [
        'date' => 'date',
        'security_deposit' => 'decimal:2',
        'electricity_deposit' => 'decimal:2',
        'advance_rent' => 'decimal:2',
        'total' => 'decimal:2',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class)->withTrashed();
    }
}

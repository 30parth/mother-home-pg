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

    /**
     * Get the total amount in words (Indian numbering system).
     */
    public function getTotalInWordsAttribute(): string
    {
        $number = (float) $this->total;
        if ($number <= 0) {
            return 'Zero Rupees Only';
        }

        $decimal = round($number - ($no = floor($number)), 2) * 100;
        $hundred = null;
        $digits_length = strlen($no);
        $i = 0;
        $str = array();
        $words = array(
            0 => '',
            1 => 'one',
            2 => 'two',
            3 => 'three',
            4 => 'four',
            5 => 'five',
            6 => 'six',
            7 => 'seven',
            8 => 'eight',
            9 => 'nine',
            10 => 'ten',
            11 => 'eleven',
            12 => 'twelve',
            13 => 'thirteen',
            14 => 'fourteen',
            15 => 'fifteen',
            16 => 'sixteen',
            17 => 'seventeen',
            18 => 'eighteen',
            19 => 'nineteen',
            20 => 'twenty',
            30 => 'thirty',
            40 => 'forty',
            50 => 'fifty',
            60 => 'sixty',
            70 => 'seventy',
            80 => 'eighty',
            90 => 'ninety'
        );
        $digits = array('', 'hundred','thousand','lakh', 'crore');
        while( $i < $digits_length ) {
            $divider = ($i == 2) ? 10 : 100;
            $number = floor($no % $divider);
            $no = floor($no / $divider);
            $i += $divider == 10 ? 1 : 2;
            if ($number) {
                $plural = (($counter = count($str)) && $number > 9) ? 's' : null;
                $hundred = ($counter == 1 && $str[0]) ? ' and ' : null;
                $str [] = ($number < 21) ? $words[$number].' '. $digits[$counter]. $plural.' '.$hundred:$words[floor($number / 10) * 10].' '.$words[$number % 10]. ' '.$digits[$counter].$plural.' '.$hundred;
            } else $str[] = null;
        }
        $Rupees = implode('', array_reverse($str));
        $paise = ($decimal > 0) ? " and " . ($words[floor($decimal / 10) * 10] . " " . $words[$decimal % 10]) . ' Paise' : '';
        
        $result = trim(($Rupees ? ucwords($Rupees) . ' Rupees' : '') . ucwords($paise) . ' Only');
        return preg_replace('/\s+/', ' ', $result);
    }
}

<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class Student extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'property_id',
        'name',
        'month_rent',
        'contact_no',
        'due_date',
    ];

    protected $casts = [
        'month_rent' => 'decimal:2',
        'due_date' => 'integer',
    ];

    protected $appends = [
        'days_overdue',
        'amount_due',
    ];

    public function property(): BelongsTo
    {
        return $this->belongsTo(Property::class)->withTrashed();
    }

    public function paymentReceipts(): HasMany
    {
        return $this->hasMany(PaymentReceipt::class);
    }

    /**
     * Scope a query to only include students who are overdue for the current month.
     */
    public function scopeOverdueForCurrentMonth($query)
    {
        $today = Carbon::today();
        $todayDay = $today->day;
        $daysInMonth = $today->daysInMonth;
        $currentMonth = $today->format('F Y');

        return $query->whereNotNull('due_date')
            ->where('due_date', '<', $todayDay)
            ->where('due_date', '<=', $daysInMonth)
            ->whereNotExists(function ($subQuery) use ($currentMonth) {
                $subQuery->select(DB::raw(1))
                    ->from('payment_receipts')
                    ->where('payment_receipts.month', $currentMonth)
                    ->whereNull('payment_receipts.deleted_at')
                    ->where(function ($q) {
                        $q->whereColumn('payment_receipts.student_id', 'students.id')
                          ->orWhere(function ($q2) {
                              $q2->whereNull('payment_receipts.student_id')
                                 ->whereColumn('payment_receipts.student_name', 'students.name');
                          });
                    });
            });
    }

    /**
     * Check if the student is overdue for the current month.
     */
    public function isOverdueForCurrentMonth(): bool
    {
        if ($this->due_date === null) {
            return false;
        }

        $today = Carbon::today();
        $daysInMonth = $today->daysInMonth;
        $clampedDueDate = min($this->due_date, $daysInMonth);

        if ($today->day <= $clampedDueDate) {
            return false;
        }

        $currentMonth = $today->format('F Y');

        return !PaymentReceipt::where('month', $currentMonth)
            ->where(function ($q) {
                $q->where('student_id', $this->id)
                  ->orWhere(function ($q2) {
                      $q2->whereNull('student_id')
                         ->where('student_name', $this->name);
                  });
            })
            ->exists();
    }

    /**
     * Accessor for days_overdue.
     */
    public function getDaysOverdueAttribute(): int
    {
        if (!$this->isOverdueForCurrentMonth()) {
            return 0;
        }

        $today = Carbon::today();
        $clampedDueDate = min($this->due_date, $today->daysInMonth);

        return $today->day - $clampedDueDate;
    }

    /**
     * Accessor for amount_due.
     */
    public function getAmountDueAttribute(): float
    {
        if (!$this->isOverdueForCurrentMonth()) {
            return 0.00;
        }

        return (float) $this->month_rent;
    }
}

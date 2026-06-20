<?php

use App\Models\Student;
use App\Models\Property;
use App\Models\PaymentReceipt;
use Carbon\Carbon;

beforeEach(function () {
    // Set up a mock property
    $this->property = Property::create([
        'name' => 'Test House',
        'address_line_1' => '123 Test St',
        'city' => 'Test City',
        'pincode' => '123456',
    ]);
});

test('a student is overdue if today is strictly after clamped due date and no payment is received', function () {
    // Today is June 20, 2026
    Carbon::setTestNow('2026-06-20');

    // Due date: 15 (strictly less than 20)
    $student = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Overdue Student',
        'month_rent' => 5000.00,
        'contact_no' => '1234567890',
        'due_date' => 15,
    ]);

    expect(Student::overdueForCurrentMonth()->count())->toBe(1);
    expect($student->isOverdueForCurrentMonth())->toBeTrue();
    expect($student->days_overdue)->toBe(5); // 20 - 15 = 5 days
    expect($student->amount_due)->toBe(5000.00);
});

test('a student is not overdue if today is on or before their due date', function () {
    Carbon::setTestNow('2026-06-20');

    // Due date: 20 (today)
    $student1 = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Due Today Student',
        'month_rent' => 5000.00,
        'contact_no' => '1234567890',
        'due_date' => 20,
    ]);

    // Due date: 25 (future)
    $student2 = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Future Due Student',
        'month_rent' => 6000.00,
        'contact_no' => '0987654321',
        'due_date' => 25,
    ]);

    expect(Student::overdueForCurrentMonth()->count())->toBe(0);
    expect($student1->isOverdueForCurrentMonth())->toBeFalse();
    expect($student2->isOverdueForCurrentMonth())->toBeFalse();
    expect($student1->days_overdue)->toBe(0);
    expect($student2->days_overdue)->toBe(0);
    expect($student1->amount_due)->toBe(0.00);
    expect($student2->amount_due)->toBe(0.00);
});

test('due date is clamped to the number of days in the current month', function () {
    // June has 30 days. Let's test a due_date of 31.
    // Clamped due date will be 30.
    // If today is June 30, they should NOT be overdue (since 30 is not strictly greater than clamped 30).
    Carbon::setTestNow('2026-06-30');

    $student = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Clamped Student',
        'month_rent' => 5000.00,
        'contact_no' => '1234567890',
        'due_date' => 31, // Clamps to 30
    ]);

    expect(Student::overdueForCurrentMonth()->count())->toBe(0);
    expect($student->isOverdueForCurrentMonth())->toBeFalse();

    // If today is July 1 (or we mock to a future time/day in next month), but wait,
    // the scope checks the *current month*. So in the current month of June, on June 30 they are not overdue.
    // What if today is June 30 but due_date is 29?
    $student2 = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Overdue Before End of Month',
        'month_rent' => 4500.00,
        'contact_no' => '1234567891',
        'due_date' => 29,
    ]);

    expect(Student::overdueForCurrentMonth()->count())->toBe(1);
    expect($student2->isOverdueForCurrentMonth())->toBeTrue();
    expect($student2->days_overdue)->toBe(1); // 30 - 29 = 1 day
});

test('a student is not overdue if they have a payment receipt for the current month matched by student_id', function () {
    Carbon::setTestNow('2026-06-20');

    $student = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Paid Student',
        'month_rent' => 5000.00,
        'contact_no' => '1234567890',
        'due_date' => 15,
    ]);

    PaymentReceipt::create([
        'date' => '2026-06-18',
        'property_id' => $this->property->id,
        'student_id' => $student->id,
        'student_name' => 'Paid Student',
        'payment_mode' => 'cash',
        'month' => 'June 2026',
        'total' => 5000.00,
    ]);

    expect(Student::overdueForCurrentMonth()->count())->toBe(0);
    expect($student->isOverdueForCurrentMonth())->toBeFalse();
});

test('a student is not overdue if they have a payment receipt for the current month matched by fallback student_name', function () {
    Carbon::setTestNow('2026-06-20');

    $student = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Paid Student via Name Fallback',
        'month_rent' => 5000.00,
        'contact_no' => '1234567890',
        'due_date' => 15,
    ]);

    // Receipt has student_id as NULL, but matches name
    PaymentReceipt::create([
        'date' => '2026-06-18',
        'property_id' => $this->property->id,
        'student_id' => null,
        'student_name' => 'Paid Student via Name Fallback',
        'payment_mode' => 'cash',
        'month' => 'June 2026',
        'total' => 5000.00,
    ]);

    expect(Student::overdueForCurrentMonth()->count())->toBe(0);
    expect($student->isOverdueForCurrentMonth())->toBeFalse();
});

test('a student is still overdue if receipt student_name matches but student_id belongs to another student', function () {
    Carbon::setTestNow('2026-06-20');

    $student1 = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Shared Name',
        'month_rent' => 5000.00,
        'contact_no' => '1234567890',
        'due_date' => 15,
    ]);

    $student2 = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Shared Name',
        'month_rent' => 5000.00,
        'contact_no' => '1234567891',
        'due_date' => 15,
    ]);

    // Payment receipt for student1 (explicit student_id)
    // Even though name is Shared Name, student_id is student1's ID.
    // So student2 is still overdue!
    PaymentReceipt::create([
        'date' => '2026-06-18',
        'property_id' => $this->property->id,
        'student_id' => $student1->id,
        'student_name' => 'Shared Name',
        'payment_mode' => 'cash',
        'month' => 'June 2026',
        'total' => 5000.00,
    ]);

    expect(Student::overdueForCurrentMonth()->pluck('id')->toArray())
        ->toContain($student2->id)
        ->not->toContain($student1->id);

    expect($student1->isOverdueForCurrentMonth())->toBeFalse();
    expect($student2->isOverdueForCurrentMonth())->toBeTrue();
});

test('soft-deleted students must never appear in the overdue list', function () {
    Carbon::setTestNow('2026-06-20');

    $student = Student::create([
        'property_id' => $this->property->id,
        'name' => 'Deleted Student',
        'month_rent' => 5000.00,
        'contact_no' => '1234567890',
        'due_date' => 15,
    ]);

    $student->delete(); // Soft delete

    expect(Student::overdueForCurrentMonth()->count())->toBe(0);
});

<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('payment_receipts', function (Blueprint $table) {
            $table->id();
            $table->date('date');
            $table->foreignId('property_id')->constrained()->onDelete('cascade');
            $table->string('payment_mode'); // cash, online, other
            $table->string('student_name');
            $table->string('room_number')->nullable();
            $table->string('month');
            $table->decimal('security_deposit', 10, 2)->default(0);
            $table->decimal('electricity_deposit', 10, 2)->default(0);
            $table->decimal('advance_rent', 10, 2)->default(0);
            $table->decimal('total', 10, 2)->default(0);
            $table->string('received_by')->default('Ashok Golani');
            $table->softDeletes();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_receipts');
    }
};

<?php

namespace App\Http\Controllers;

use App\Models\PaymentReceipt;
use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PaymentReceiptController extends Controller
{
    /**
     * Show the payment receipts list page.
     */
    public function index(): Response
    {
        $receipts = PaymentReceipt::with('property')->latest()->get();
        $properties = Property::latest()->get();

        return Inertia::render('receipts/index', [
            'receipts' => $receipts,
            'properties' => $properties,
        ]);
    }

    /**
     * Store a new payment receipt in the database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'date' => 'required|date',
            'property_id' => 'required|exists:properties,id',
            'payment_mode' => 'required|string|in:cash,online,other',
            'student_name' => 'required|string|max:255',
            'room_number' => 'nullable|string|max:50',
            'month' => 'required|string|max:50',
            'security_deposit' => 'nullable|numeric|min:0|max:9999999.99',
            'electricity_deposit' => 'nullable|numeric|min:0|max:9999999.99',
            'advance_rent' => 'nullable|numeric|min:0|max:9999999.99',
            'received_by' => 'nullable|string|max:255',
        ]);

        // Default value for received_by if not provided
        if (empty($validated['received_by'])) {
            $validated['received_by'] = 'Ashok Golani';
        }

        // Calculate sum of particulars
        $sec = floatval($validated['security_deposit'] ?? 0);
        $elec = floatval($validated['electricity_deposit'] ?? 0);
        $adv = floatval($validated['advance_rent'] ?? 0);
        $validated['total'] = $sec + $elec + $adv;

        PaymentReceipt::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Payment receipt generated successfully.'),
        ]);

        return to_route('receipts.index');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Property;
use App\Models\Student;
use App\Models\PaymentReceipt;
use Carbon\Carbon;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index(): Response
    {
        $currentMonth = Carbon::today()->format('F Y');

        $totalProperties = Property::count();
        $totalStudents = Student::count();
        
        $overdueStudents = Student::with('property')
            ->overdueForCurrentMonth()
            ->get();
            
        $overdueCount = $overdueStudents->count();

        // Calculate total collections for the current month
        $currentMonthCollections = (float) PaymentReceipt::where('month', $currentMonth)->sum('total');

        // Get 5 most recent payment receipts
        $recentReceipts = PaymentReceipt::with('property')
            ->latest()
            ->take(5)
            ->get();

        return Inertia::render('dashboard', [
            'stats' => [
                'total_properties' => $totalProperties,
                'total_students' => $totalStudents,
                'overdue_count' => $overdueCount,
                'current_month_collections' => $currentMonthCollections,
                'current_month_name' => Carbon::today()->format('F'),
            ],
            'overdue_students' => $overdueStudents,
            'recent_receipts' => $recentReceipts,
        ]);
    }
}

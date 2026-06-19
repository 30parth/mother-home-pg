<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StudentController extends Controller
{
    /**
     * Show the students list page.
     */
    public function index(): Response
    {
        $students = Student::latest()->get();

        return Inertia::render('students/index', [
            'students' => $students,
        ]);
    }

    /**
     * Store a new student in the database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'month_rent' => 'required|numeric|min:0|max:9999999.99',
            'contact_no' => 'required|string|max:255',
            'due_date' => 'required|integer|min:1|max:31',
        ]);

        Student::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Student added successfully.'),
        ]);

        return to_route('students.index');
    }
}

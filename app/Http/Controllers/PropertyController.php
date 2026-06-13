<?php

namespace App\Http\Controllers;

use App\Models\Property;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PropertyController extends Controller
{
    /**
     * Show the properties list page.
     */
    public function index(): Response
    {
        $properties = Property::latest()->get();

        return Inertia::render('properties/index', [
            'properties' => $properties,
        ]);
    }

    /**
     * Store a new property in the database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'address_line_1' => 'required|string|max:255',
            'address_line_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'pincode' => 'required|string|max:20',
        ]);

        Property::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Property added successfully.'),
        ]);

        return to_route('properties.index');
    }
}

<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    /**
     * Show the products list page.
     */
    public function index(): Response
    {
        $products = Product::latest()->get();

        return Inertia::render('products/index', [
            'products' => $products,
        ]);
    }

    /**
     * Store a new product in the database.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric|min:0|max:9999999.99',
            'description' => 'nullable|string',
            'sales_rate' => 'required|numeric|min:0|max:9999999.99',
            'purchase_rate' => 'required|numeric|min:0|max:9999999.99',
        ]);

        Product::create($validated);

        Inertia::flash('toast', [
            'type' => 'success',
            'message' => __('Product added successfully.'),
        ]);

        return to_route('products.index');
    }
}

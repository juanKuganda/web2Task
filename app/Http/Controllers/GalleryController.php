<?php

namespace App\Http\Controllers;

use App\Models\gallery;
use App\Http\Requests\StoregalleryRequest;
use App\Http\Requests\UpdategalleryRequest;
use App\Models\User;
use Illuminate\Support\Facades\DB;
// use Inertia\Inertia;

class GalleryController extends Controller
{

    /**
     * Display a listing of the resource.
     */
    public function index()
    {

        try {
            $galleries = gallery::all();
            return response()->json($galleries);
        } catch (\Exception $e) {
            return response()->json(['message' => $e->getMessage()], 500);
        }
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoregalleryRequest $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB max
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'alt' => 'required|string|max:255',
        ]);


        $image = gallery::create([
            'title' => $request->title,
            'description' => $request->description,
            'alt' => $request->alt,
            'src' => $request->image_url,
            'user_id' => User::where('email', $request->user()->email)->first()->id,
        ]);

        return redirect()->route('dashboard')->with('success', 'Image uploaded successfully');
    }

    /**
     * Display the specified resource.
     */
    public function show(gallery $gallery)
    {
        return response()->json($gallery);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(gallery $gallery)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdategalleryRequest $request, gallery $gallery)
    {
        $request->validate([
            'title' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'alt' => 'sometimes|required|string|max:255',
        ]);

        // Check if there's a new image
        if ($request->filled('image_url')) {
            // Update with new Supabase image URL
            $gallery->src = $request->image_url;
        }

        // Update other fields
        $gallery->title = $request->title ?? $gallery->title;
        $gallery->description = $request->description ?? $gallery->description;
        $gallery->alt = $request->alt ?? $gallery->alt;
        $gallery->save();

        return; 
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(gallery $gallery)
    {
        // No need to delete physical files as they're stored in Supabase

        // Delete from database
        $gallery->delete();

        return;
    }
}
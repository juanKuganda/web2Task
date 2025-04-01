<?php

namespace App\Http\Middleware;

use App\Models\User;
use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;

class Role
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string $role)
    {
        if (!Auth::check()) {
            return redirect()->route('login');
        }

        $userRole = User::where('email', $request->user()->email)->first()->role;

        if ($role === 'admin' && $userRole === 'admin') {
            return $next($request);
        } else if ($role === 'user' && $userRole === 'user') {
            return $next($request); // Allow users to access user-specific routes
        } else {
            abort(403, 'Unauthorized action. You do not have the required role.');
        }
    }
}
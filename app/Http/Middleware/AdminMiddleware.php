<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminMiddleware
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        // 1. On vérifie si l'utilisateur N'EST PAS connecté OU N'EST PAS admin
        if (!auth()->check() || !auth()->user()->is_admin) {
            abort(403, 'Accès réservé aux administrateurs.'); // On bloque
        }
        return $next($request);
    }
}

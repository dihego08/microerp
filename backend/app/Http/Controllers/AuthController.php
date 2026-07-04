<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    /**
     * Get a JWT via given credentials.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function login(Request $request)
    {
        $credentials = $request->only('Usuario', 'password');
        
        // Laravel Auth expects 'password', but our DB uses PasswordHash.
        // We handle this internally. The request sends 'Usuario' and 'password'.
        
        // We will attempt to login using the Auth facade.
        // Note: For Laravel auth with custom column, we need to make sure the provider knows about it.
        // In our Usuario model, getAuthPassword() returns $this->PasswordHash. So this should work automatically.

        if (! $token = Auth::guard('api')->attempt(['Usuario' => $credentials['Usuario'], 'password' => $credentials['password']])) {
            return response()->json([
                'success' => false,
                'message' => 'Credenciales incorrectas',
                'data' => null
            ], 401);
        }

        return $this->respondWithToken($token);
    }

    /**
     * Get the authenticated User.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function me()
    {
        return response()->json([
            'success' => true,
            'message' => 'Usuario autenticado',
            'data' => Auth::guard('api')->user()
        ]);
    }

    /**
     * Log the user out (Invalidate the token).
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function logout()
    {
        Auth::guard('api')->logout();

        return response()->json([
            'success' => true,
            'message' => 'Sesión cerrada correctamente',
            'data' => null
        ]);
    }

    /**
     * Refresh a token.
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function refresh()
    {
        return $this->respondWithToken(Auth::guard('api')->refresh());
    }

    /**
     * Get the token array structure.
     *
     * @param  string $token
     *
     * @return \Illuminate\Http\JsonResponse
     */
    protected function respondWithToken($token)
    {
        return response()->json([
            'success' => true,
            'message' => 'Token generado',
            'data' => [
                'access_token' => $token,
                'token_type' => 'bearer',
                'expires_in' => Auth::guard('api')->factory()->getTTL() * 60,
                'user' => Auth::guard('api')->user()
            ]
        ]);
    }
}

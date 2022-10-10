<?php

namespace App\Exceptions;

use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Symfony\Component\Routing\Exception\RouteNotFoundException;
use Throwable;

class Handler extends ExceptionHandler
{
    /**
     * A list of exception types with their corresponding custom log levels.
     *
     * @var array<class-string<\Throwable>, \Psr\Log\LogLevel::*>
     */
    protected $levels = [
        //
    ];

    /**
     * A list of the exception types that are not reported.
     *
     * @var array<int, class-string<\Throwable>>
     */
    protected $dontReport = [
        //
    ];

    /**
     * A list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     *
     * @return void
     */
    public function register()
    {
        $this->reportable(function (Throwable $e) {
            // if ($this->app->environment('local')) {
            //     $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            //     $this->app->register(TelescopeServiceProvider::class);
            // }

            $response = [
                'success' => false,
                'message' => $e->getMessage(),
                'data'    => [],
                'error' => [
                    'error_code' => 'UNAUTHORIZED',
                    'error_data' => [],
                ],
            ];

            return response()->json($response, 401);
        });
    }

    public function render($request, Throwable $e)
    {
        if ($e instanceof \Illuminate\Auth\AuthenticationException) {
            $response = [
                'success' => false,
                'message' => $e->getMessage(),
                'data'    => [],
                'error' => [
                    'error_code' => 'UNAUTHORIZED',
                    'error_data' => [],
                ],
            ];

            return response()->json($response, 401);
        }

        if ($e instanceof CustomException) {
            $response = [
                'success' => false,
                'message' => $e->getMessage(),
                'data'    => [],
                'error' => [
                    'error_code' => $e->getCode(),
                    'error_data' => [],
                ],
            ];

            return response()->json($response, 400);
        }

        if ($e instanceof RouteNotFoundException) {
            $response = [
                'success' => false,
                'message' => $e->getMessage(),
                'data'    => [],
                'error' => [
                    'error_code' => $e->getCode(),
                    'error_data' => [],
                ],
            ];

            return response()->json($response, 404);
        }

        if ($e instanceof ModelNotFoundException && $request->wantsJson()) {
            $response = [
                'success' => false,
                'message' => $e->getMessage(),
                'data'    => [],
                'error' => [
                    'error_code' => 'NOT FOUND',
                    'error_data' => [],
                ],
            ];

            return response()->json($response, 404);
        }

        return parent::render($request, $e);
    }
}

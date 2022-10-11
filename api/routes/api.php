<?php

use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\APIs\ApiConfigController;
use App\Http\Controllers\APIs\ApiKeyController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Files\FilesController;
use App\Http\Controllers\Files\UploadController;
use App\Http\Controllers\ForgotPassword;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});


Route::prefix('v1')->group(function () {
    Route::prefix('auth')->group(function () {
        Route::post('/register', [AuthController::class, 'register']);
        Route::post('/login', [AuthController::class, 'login']);
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::post('/refresh', [AuthController::class, 'refresh']);
        Route::post('/verify', [AuthController::class, 'verifyEmail']);
        Route::post('/verify/resend', [AuthController::class, 'resendVerif']);
        Route::post('/forgot/send', [ForgotPassword::class, 'send']);
        Route::post('/forgot/reset', [ForgotPassword::class, 'reset']);
    });

    Route::prefix('upload')->group(function () {
        Route::post('/dom.js', [UploadController::class, 'cekapi']);
        Route::post('/link', [UploadController::class, 'singleLink']);
        Route::post('/single', [UploadController::class, 'store'])->name('upload.single');
        Route::post('/multiple', [UploadController::class, 'multipleStore'])->name('upload.multiple');
    });

    Route::prefix('files')->group(function () {
        Route::get('/list', [FilesController::class, 'list']);
        Route::get('/list/filter', [FilesController::class, 'filterList']);
        Route::delete('/delete/{id}', [FilesController::class, 'delete']);
    });

    Route::prefix('keys')->group(function () {
        Route::get('/files/list', [FilesController::class, 'listPerAPI']);
        Route::get('/list', [APIKeyController::class, 'list']);
        Route::get('/get/{id}', [APIKeyController::class, 'get']);
        Route::get('/config/get/{domain}', [ApiConfigController::class, 'getConfig']);
        Route::post('/create', [APIKeyController::class, 'create']);
        Route::post('/config/edit', [ApiConfigController::class, 'editConfig']);

        Route::delete('/delete/{id}', [ApiKeyController::class, 'delete']);
    });

    Route::prefix('admin')->group(function () {
        Route::get('/dashboard', [DashboardController::class, 'home']);

        Route::prefix('user')->group(function () {
            Route::get('/', [DashboardController::class, 'sidebar']);
            Route::get('/me', [UserController::class, 'me']);
            Route::post('/change-password', [UserController::class, 'changePassword']);
            Route::post('/avatar', [UserController::class, 'changeAvatar']);
            Route::post('/edit', [UserController::class, 'editProfile']);
        });
    });
});
<?php

use App\Http\Controllers\Files\DownloadController;
use App\Http\Controllers\Files\ImageController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return ['Laravel' => app()->version()];
// });

Route::get('/images/{name}', [ImageController::class, 'image']);
Route::get('/images/{width}/{name}', [ImageController::class, 'imageWidth']);
Route::get('/get/request', [DownloadController::class, 'requestDownload'])->name('files.request');
Route::get('/download/{url}', [DownloadController::class, 'get'])->name('files.download');

require __DIR__.'/auth.php';

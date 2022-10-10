<?php

namespace App\Providers;

use App\Models\APIs\ApiConfig;
use App\Models\Files;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     *
     * @return void
     */
    public function register()
    {
        //
    }

    /**
     * Bootstrap any application services.
     *
     * @return void
     */
    public function boot()
    {
        Storage::disk('local')->buildTemporaryUrlsUsing(function ($path, $expiration, $options) {
            return URL::temporarySignedRoute(
                'files.request',
                $expiration,
                array_merge($options, ['path' => $path])
            );
        });

        Storage::disk('public')->buildTemporaryUrlsUsing(function ($path, $expiration, $options) {
            return URL::temporarySignedRoute(
                'files.request',
                $expiration,
                array_merge($options, ['path' => $path])
            );
        });

        Storage::disk('ftp')->buildTemporaryUrlsUsing(function ($path, $expiration, $options) {
            $name = explode('/', $path);
            $name = end($name);

            $file = Files::where('name_encrypted', $name)->first();
            $config = ApiConfig::where('storage_id', $file->storage_id)->with('storage')->first();
            return URL::temporarySignedRoute(
                'files.request',
                $expiration,
                array_merge($options, ['path' => $path])
            );
        });
    }
}

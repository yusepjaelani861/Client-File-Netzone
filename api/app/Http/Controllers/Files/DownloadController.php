<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\APIs\ApiConfig;
use App\Models\Files;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class DownloadController extends Controller
{
    public function get($url, Request $request)
    {
        $file = Files::where('url', $url)->first();
        if (!$file) {
            return $this->sendError('File tidak ditemukan', 'File tidak ditemukan', 'NOT_FOUND', 404);
        }

        switch ($file->disk) {
            case 'local':
                $tempUrl = Storage::disk('public')->temporaryUrl($file->path, now()->addHour(3));
                break;
            case 'ftp':
                $tempUrl = Storage::disk('ftp')->temporaryUrl($file->path, now()->addHour(3));
                break;
            case 's3':
                $tempUrl = Storage::disk('s3')->temporaryUrl($file->path, now()->addHour(3));
                break;
        }

        return redirect($tempUrl);
    }

    public function requestDownload(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'path' => 'required|string',
        ], [
            'path.required' => 'Path diperlukan.',
            'path.string' => 'Path harus berupa string.',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Gagal mengunduh file', $validator->errors(), 'VALIDATION_ERROR', 400);
        }

        $path = $request->input('path');

        $name = explode ('/', $path);
        $name = end($name);

        $file = Files::where('name_encrypted', $name)->first();
        $config = ApiConfig::where('storage_id', $file->storage_id)->with('storage')->first();


        if (Storage::disk('public')->exists($path)) {
            return Storage::disk('public')->download($path, $file->name);
        } else if (Storage::createFtpDriver([
            'host' => $config->storage->ftp_host,
            'username' => $config->storage->ftp_username,
            'password' => $config->storage->ftp_password,
            'port' => 21,
            'passive' => true,
            'ssl' => true,
            'timeout' => 3600,
        ])->exists($path)) {
            return Storage::createFtpDriver([
                'host' => $config->storage->ftp_host,
                'username' => $config->storage->ftp_username,
                'password' => $config->storage->ftp_password,
                'port' => 21,
                'passive' => true,
                'ssl' => true,
                'timeout' => 3600,
            ])->download($path, $file->name);
        } else if (Storage::disk('s3')->exists($path)) {
            return Storage::disk('s3')->download($path, $file->name);
        } else {
            return $this->sendError('File tidak ditemukan', 'File tidak ditemukan', 'PROCESS_ERROR', 400);
        }

    }
}

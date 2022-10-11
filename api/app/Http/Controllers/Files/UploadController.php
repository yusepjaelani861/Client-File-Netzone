<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\APIs\ApiConfig;
use App\Models\APIs\ApiKey;
use App\Models\Files;
use finfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $headerApi = $request->header('apikey');
        if (!$headerApi) {
            return $this->sendError('Gagal mengunggah file', 'apikey tidak ditemukan', 'PROCESS_ERROR', 400);
        }

        $validator = Validator::make($request->all(), [
            'file' => 'required|file',
        ], [
            'file.required' => 'File diperlukan.',
            'file.file' => 'File harus berupa file.',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Gagal mengunggah file', $validator->errors(), 'VALIDATION_ERROR', 400);
        }

        $file = $request->file('file');

        $api = ApiKey::where('secret_key', $headerApi)->with('user')->first();
        if (!$api) {
            return $this->sendError('apikey yang dimasukkan salah', new \stdClass, 'PROCESS_ERROR', 400);
        }

        $config = ApiConfig::where('api_key_id', $api->id)->with('storage')->first();

        $size = $request->file('file')->getSize();
        $max_size = $config->max_file_size;
        if ($size > $max_size) {
            return $this->sendError('Ukuran file melebihi batas maksimal upload', 'Ukuran file melebihi batas maksimal', 'PROCESS_ERROR', 400);
        }

        $max_storage = $config->max_storage; 
        $total_usage = $config->total_storage_used;
        if ($max_storage != '0') {
            // if ($total_usage + $size > $max_storage) {
            //     return $this->sendError('Penyimpanan hampir penuh', 'Ukuran file melebihi batas maksimal', 'PROCESS_ERROR', 400);
            // }
        }

        $enc = sha1($file->getClientOriginalName() . Str::random(60));
        switch ($config->storage->primary_storage) {
            case 'local':
                $filesystem = Storage::disk('public');
                break;
            case 'ftp':
                $filesystem = Storage::createFtpDriver([
                    'host' => $config->storage->ftp_host,
                    'username' => $config->storage->ftp_username,
                    'password' => $config->storage->ftp_password,
                    'port' => 21,
                    'passive' => true,
                    'ssl' => true,
                    'timeout' => 30,
                ]);
                break;
            case 'sftp':
                $filesystem = Storage::createSftpDriver([
                    'host' => $config->storage->sftp_host,
                    'username' => $config->storage->sftp_username,
                    'password' => $config->storage->sftp_password,
                    'port' => 22,
                    'timeout' => 30,
                ]);
                break;
            case 's3':
                $filesystem = Storage::createS3Driver([
                    'key' => $config->storage->s3_key,
                    'secret' => $config->storage->s3_secret,
                    'region' => $config->storage->s3_region,
                    'bucket' => $config->storage->s3_bucket,
                ]);
                break;
        }

        $path = $api->user->username . '/' . $api->domain . '/' . $enc;
        $filesystem->put($path, file_get_contents($file));

        $shorturl = substr(md5($enc . Str::random(60) . $file->getClientOriginalExtension()), 0, 15);
        if (Files::where('url', $shorturl)->first()) {
            while (Files::where('url', $shorturl)->first()) {
                $shorturl = substr(md5($enc . Str::random(60) . $file->getClientOriginalExtension()), 0, 15);
            }
        }

        $store = Files::create([
            'user_id' => $api->user_id,
            'storage_id' => $config->storage_id,
            'api_key_id' => $api->id,
            'name' => $file->getClientOriginalName(),
            'name_encrypted' => $enc,
            'path' => $path,
            'extension' => $file->getClientOriginalExtension(),
            'mime_type' => $file->getMimeType(),
            'size' => $file->getSize(),
            'hash' => sha1_file($file->getRealPath()),
            'disk' => $config->storage->primary_storage,
            'url' => $shorturl,
        ]);

        $config->total_storage_used += $file->getSize();
        $config->save();

        return $this->sendResponse([
            'name' => $store->name,
            'extension' => $store->extension,
            'mime_type' => $store->mime_type,
            'size' => $store->size,
            'url' => route('files.download', $store->url),
        ], 'File berhasil diunggah', []);
    }

    public function multipleStore(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'files' => 'required|array',
            'files.*' => 'required|file',
        ], [
            'files.required' => 'File diperlukan.',
            'files.array' => 'File harus berupa array.',
            'files.*.required' => 'File diperlukan.',
            'files.*.file' => 'File harus berupa file.',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Gagal mengunggah file', $validator->errors(), 'VALIDATION_ERROR', 400);
        }

        $headerApi = $request->header('apikey');
        if (!$headerApi) {
            return $this->sendError('Gagal mengunggah file', 'apikey tidak ditemukan', 'PROCESS_ERROR', 400);
        }

        $api = ApiKey::where('secret_key', $headerApi)->with('user')->first();
        if (!$api) {
            return $this->sendError('apikey yang dimasukkan salah', new \stdClass, 'PROCESS_ERROR', 400);
        }

        $config = ApiConfig::where('api_key_id', $api->id)->with('storage')->first();

        $files = $request->file('files');
        $uploaded = [];
        foreach ($files as $file) {
            $size = $file->getSize();
            $max_size = $config->max_file_size;
            if ($size > $max_size) {
                return $this->sendError('Gagal mengunggah file', 'Ukuran file melebihi batas maksimal', 'PROCESS_ERROR', 400);
            }

            $enc = sha1($file->getClientOriginalName() . Str::random(60));
            switch ($config->storage->primary_storage) {
                case 'local':
                    $filesystem = Storage::disk('public');
                    break;
                case 'ftp':
                    $filesystem = Storage::createFtpDriver([
                        'host' => $config->storage->ftp_host,
                        'username' => $config->storage->ftp_username,
                        'password' => $config->storage->ftp_password,
                        'port' => 21,
                        'passive' => true,
                        'ssl' => true,
                        'timeout' => 30,
                    ]);
                    break;
                case 'sftp':
                    $filesystem = Storage::createSftpDriver([
                        'host' => $config->storage->sftp_host,
                        'username' => $config->storage->sftp_username,
                        'password' => $config->storage->sftp_password,
                        'port' => 22,
                        'timeout' => 30,
                    ]);
                    break;
                case 's3':
                    $filesystem = Storage::createS3Driver([
                        'key' => $config->storage->s3_key,
                        'secret' => $config->storage->s3_secret,
                        'region' => $config->storage->s3_region,
                        'bucket' => $config->storage->s3_bucket,
                    ]);
                    break;
            }

            $path = $api->user->username . '/' . $api->domain . '/' . $enc;
            $filesystem->put($path, file_get_contents($file));

            $shorturl = substr(md5($enc . Str::random(60) . $file->getClientOriginalExtension()), 0, 15);
            if (Files::where('url', $shorturl)->first()) {
                while (Files::where('url', $shorturl)->first()) {
                    $shorturl = substr(md5($enc . Str::random(60) . $file->getClientOriginalExtension()), 0, 15);
                }
            }

            $store = Files::create([
                'user_id' => $api->user_id,
                'storage_id' => $config->storage_id,
                'api_key_id' => $api->id,
                'name' => $file->getClientOriginalName(),
                'name_encrypted' => $enc,
                'path' => $path,
                'extension' => $file->getClientOriginalExtension(),
                'mime_type' => $file->getMimeType(),
                'size' => $file->getSize(),
                'hash' => sha1_file($file->getRealPath()),
                'disk' => $config->storage->primary_storage,
                'url' => $shorturl,
            ]);

            $config->total_storage_used += $file->getSize();
            $config->save();

            $uploaded[] = [
                'name' => $store->name,
                'extension' => $store->extension,
                'mime_type' => $store->mime_type,
                'size' => $store->size,
                'url' => route('files.download', $store->url),
            ];
        }

        return $this->sendResponse($uploaded, 'File berhasil diunggah', []);
    }

    public function cekapi(Request $request)
    {
        $api = ApiKey::where('secret_key', $request->header('apikey'))->first();
        if (!$api) {
            return $this->sendError('apikey yang dimasukkan salah', new \stdClass, 'PROCESS_ERROR', 400);
        }

        return $this->sendResponse([
            'public_key' => $api->public_key,
        ], 'apikey ditemukan', []);
    }

    public function singleLink(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'url' => 'required_without:file|url',
        ], [
            'url.required_without' => 'URL diperlukan.',
            'url.url' => 'URL tidak valid.',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Gagal mengunggah file', $validator->errors(), 'VALIDATION_ERROR', 400);
        }

        $headerApi = $request->header('apikey');
        if (!$headerApi) {
            return $this->sendError('Gagal mengunggah file', 'apikey tidak ditemukan', 'PROCESS_ERROR', 400);
        }

        $api = ApiKey::where('secret_key', $headerApi)->with('user')->first();
        if (!$api) {
            return $this->sendError('apikey yang dimasukkan salah', new \stdClass, 'PROCESS_ERROR', 400);
        }

        $config = ApiConfig::where('api_key_id', $api->id)->with('storage')->first();

        $url = $request->url;
        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $file = file_get_contents($url);

        $size = strlen($file);
        $max_size = $config->max_file_size;
        if ($size > $max_size) {
            return $this->sendError('Gagal mengunggah file', 'Ukuran file melebihi batas maksimal', 'PROCESS_ERROR', 400);
        }

        $enc = sha1($url . Str::random(60));
        switch ($config->storage->primary_storage) {
            case 'local':
                $filesystem = Storage::disk('public');
                break;
            case 'ftp':
                $filesystem = Storage::createFtpDriver([
                    'host' => $config->storage->ftp_host,
                    'username' => $config->storage->ftp_username,
                    'password' => $config->storage->ftp_password,
                    'port' => 21,
                    'passive' => true,
                    'ssl' => true,
                    'timeout' => 30,
                ]);
                break;
            case 'sftp':
                $filesystem = Storage::createSftpDriver([
                    'host' => $config->storage->sftp_host,
                    'username' => $config->storage->sftp_username,
                    'password' => $config->storage->sftp_password,
                    'port' => 22,
                    'timeout' => 30,
                ]);
                break;
            case 's3':
                $filesystem = Storage::createS3Driver([
                    'key' => $config->storage->s3_key,
                    'secret' => $config->storage->s3_secret,
                    'region' => $config->storage->s3_region,
                    'bucket' => $config->storage->s3_bucket,
                ]);
                break;
        }

        $path = $api->user->username . '/' . $api->domain . '/' . $enc;
        $filesystem->put($path, $file);

        $shorturl = substr(md5($enc . Str::random(60) . pathinfo($url, PATHINFO_EXTENSION)), 0, 15);
        if (Files::where('url', $shorturl)->first()) {
            while (Files::where('url', $shorturl)->first()) {
                $shorturl = substr(md5($enc . Str::random(60) . pathinfo($url, PATHINFO_EXTENSION)), 0, 15);
            }
        }

        try {
            $store = Files::create([
                'user_id' => $api->user_id,
                'storage_id' => $config->storage_id,
                'api_key_id' => $api->id,
                'name' => pathinfo($url, PATHINFO_BASENAME),
                'name_encrypted' => $enc,
                'path' => $path,
                'extension' => pathinfo($url, PATHINFO_EXTENSION),
                'mime_type' => $finfo->buffer($file),
                'size' => $size,
                'hash' => sha1($file),
                'disk' => $config->storage->primary_storage,
                'url' => $shorturl,
            ]);
    
            $config->total_storage_used += $size;
            $config->save();
    
            return $this->sendResponse([
                'name' => $store->name,
                'extension' => $store->extension,
                'mime_type' => $store->mime_type,
                'size' => $store->size,
                'url' => route('files.download', $store->url),
            ], 'File berhasil diunggah', []);
        } catch (\Exception $e) {
            return $this->sendError('Gagal mengunggah file', $e->getMessage(), 'PROCESS_ERROR', 400);
        }
    }
}

<?php

namespace App\Http\Controllers\APIs;

use App\Http\Controllers\Controller;
use App\Models\APIs\ApiConfig;
use App\Models\APIs\ApiKey;
use App\Models\APIs\Storage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ApiConfigController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function getConfig($domain)
    {
        $api = ApiKey::where('domain', $domain)->where('user_id', Auth::user()->id)->first();
        if (!$api) {
            return $this->sendError('API_KEY tidak ditemukan', new \stdClass, 'PROCESS_ERROR', 400);
        }

        $api->config->storage->max_file_size = $api->config->max_file_size;
        $api->config->storage->max_files_per_request = $api->config->max_files_per_request;

        // change if value null to ''
        $api->config->storage->ftp_host = $api->config->storage->ftp_host ?? '';
        $api->config->storage->ftp_port = $api->config->storage->ftp_port ?? '';
        $api->config->storage->ftp_username = $api->config->storage->ftp_username ?? '';
        $api->config->storage->ftp_password = $api->config->storage->ftp_password ?? '';
        $api->config->storage->sftp_host = $api->config->storage->sftp_host ?? '';
        $api->config->storage->sftp_port = $api->config->storage->sftp_port ?? '';
        $api->config->storage->sftp_username = $api->config->storage->sftp_username ?? '';
        $api->config->storage->sftp_password = $api->config->storage->sftp_password ?? '';
        $api->config->storage->s3_key = $api->config->storage->s3_key ?? '';
        $api->config->storage->s3_secret = $api->config->storage->s3_secret ?? '';
        $api->config->storage->s3_region = $api->config->storage->s3_region ?? '';
        $api->config->storage->s3_bucket = $api->config->storage->s3_bucket ?? '';
        $api->config->storage->s3_endpoint = $api->config->storage->s3_endpoint ?? '';


        $response = [
            'api' => [
                'domain' => $api->domain,
                'secret_key' => $api->secret_key,
                'public_key' => $api->file_key,
                'file_key' => $api->file_key,
                'max_file_size' => $api->config->max_file_size,
                'max_files_per_request' => $api->config->max_files_per_request,
                'total_storage_used' => $api->config->total_storage_used,
                'max_storage' => $api->config->max_storage,
                'created_at' => $api->created_at,
            ],
            'config' => $api->config->storage
        ];

        return $this->sendResponse($response, 'Berhasil mendapatkan konfigurasi API', []);
    }

    public function editConfig(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|integer',
            'max_file_size' => 'required|numeric',
            'max_files_per_request' => 'required|integer',
            'primary_storage' => 'required|string|in:local,ftp,sftp,s3',
            'ftp_host' => 'nullable|string|required_if:primary_storage,ftp',
            'ftp_port' => 'nullable|integer|required_if:primary_storage,ftp',
            'ftp_username' => 'nullable|string|required_if:primary_storage,ftp',
            'ftp_password' => 'nullable|string|required_if:primary_storage,ftp',
            'sftp_host' => 'nullable|string|required_if:primary_storage,sftp',
            'sftp_port' => 'nullable|integer|required_if:primary_storage,sftp',
            'sftp_username' => 'nullable|string|required_if:primary_storage,sftp',
            'sftp_password' => 'nullable|string|required_if:primary_storage,sftp',
            's3_key' => 'nullable|string|required_if:primary_storage,s3',
            's3_secret' => 'nullable|string|required_if:primary_storage,s3',
            's3_region' => 'nullable|string|required_if:primary_storage,s3',
            's3_bucket' => 'nullable|string|required_if:primary_storage,s3',
            's3_endpoint' => 'nullable|string|required_if:primary_storage,s3',
        ], [
            'id.required' => 'ID API_KEY tidak boleh kosong',
            'id.integer' => 'ID API_KEY harus berupa angka',
            'max_file_size.required' => 'Ukuran maksimal file tidak boleh kosong',
            'max_file_size.numeric' => 'Ukuran maksimal file harus berupa angka',
            'max_files_per_request.required' => 'Jumlah maksimal file per request tidak boleh kosong',
            'max_files_per_request.integer' => 'Jumlah maksimal file per request harus berupa angka',
            'primary_storage.required' => 'Storage utama tidak boleh kosong',
            'primary_storage.string' => 'Storage utama harus berupa string',
            'primary_storage.in' => 'Storage utama tidak valid',
            'ftp_host.required_if' => 'Host FTP tidak boleh kosong',
            'ftp_host.string' => 'Host FTP harus berupa string',
            'ftp_port.required_if' => 'Port FTP tidak boleh kosong',
            'ftp_port.integer' => 'Port FTP harus berupa angka',
            'ftp_username.required_if' => 'Username FTP tidak boleh kosong',
            'ftp_username.string' => 'Username FTP harus berupa string',
            'ftp_password.required_if' => 'Password FTP tidak boleh kosong',
            'ftp_password.string' => 'Password FTP harus berupa string',
            'sftp_host.required_if' => 'Host SFTP tidak boleh kosong',
            'sftp_host.string' => 'Host SFTP harus berupa string',
            'sftp_port.required_if' => 'Port SFTP tidak boleh kosong',
            'sftp_port.integer' => 'Port SFTP harus berupa angka',
            'sftp_username.required_if' => 'Username SFTP tidak boleh kosong',
            'sftp_username.string' => 'Username SFTP harus berupa string',
            'sftp_password.required_if' => 'Password SFTP tidak boleh kosong',
            'sftp_password.string' => 'Password SFTP harus berupa string',
            's3_key.required_if' => 'Key S3 tidak boleh kosong',
            's3_key.string ' => 'Key S3 harus berupa string',
            's3_secret.required_if' => 'Secret S3 tidak boleh kosong',
            's3_secret.string' => 'Secret S3 harus berupa string',
            's3_region.required_if' => 'Region S3 tidak boleh kosong',
            's3_region.string' => 'Region S3 harus berupa string',
            's3_bucket.required_if' => 'Bucket S3 tidak boleh kosong',
            's3_bucket.string' => 'Bucket S3 harus berupa string',
            's3_endpoint.required_if' => 'Endpoint S3 tidak boleh kosong',
            's3_endpoint.string' => 'Endpoint S3 harus berupa string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validasi gagal', $validator->errors(), 'PROCESS_ERROR', 400);
        }

        try {
            DB::beginTransaction();

            $config = ApiConfig::where([
                'id' => $request->id,
            ])->first();

            if (!$config) {
                return $this->sendError('Konfigurasi tidak ditemukan', null, 'PROCESS_ERROR', 400);
            }

            $api = ApiKey::where([
                'id' => $config->api_key_id,
                'user_id' => Auth::user()->id,
            ])->first();

            if (!$api) {
                return $this->sendError('Konfigurasi tidak ditemukan', null, 'PROCESS_ERROR', 400);
            }

            ApiConfig::where('id', $request->id)->update([
                'max_file_size' => $request->max_file_size ?? $config->max_file_size,
                'max_files_per_request' => $request->max_files_per_request ?? $config->max_files_per_request,
            ]);

            Storage::where('api_config_id', $config->id)->update([
                'primary_storage' => $request->primary_storage ?? $config->primary_storage,
                'ftp_host' => $request->ftp_host ?? $config->ftp_host ?? null,
                'ftp_port' => $request->ftp_port ?? $config->ftp_port ?? null,
                'ftp_username' => $request->ftp_username ?? $config->ftp_username ?? null,
                'ftp_password' => $request->ftp_password ?? $config->ftp_password ?? null,
                'sftp_host' => $request->sftp_host ?? $config->sftp_host ?? null,
                'sftp_port' => $request->sftp_port ?? $config->sftp_port ?? null,
                'sftp_username' => $request->sftp_username ?? $config->sftp_username ?? null,
                'sftp_password' => $request->sftp_password ?? $config->sftp_password ?? null,
                's3_key' => $request->s3_key ?? $config->s3_key ?? null,
                's3_secret' => $request->s3_secret ?? $config->s3_secret ?? null,
                's3_region' => $request->s3_region ?? $config->s3_region ?? null,
                's3_bucket' => $request->s3_bucket ?? $config->s3_bucket ?? null,
                's3_endpoint' => $request->S3_ENDPOINT ?? $config->s3_endpoint ?? null,
            ]);

            DB::commit();

            return $this->sendResponse([], 'Konfigurasi berhasil diperbarui', []);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Terjadi kesalahan', $e->getMessage(), 'PROCESS_ERROR', 500);
        }
    }
}

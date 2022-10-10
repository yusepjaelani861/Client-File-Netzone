<?php

namespace App\Http\Controllers;

use App\Models\APIs\ApiConfig;
use App\Models\APIs\ApiKey;
use App\Models\APIs\Storage;
use App\Models\UserInformation;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Foundation\Bus\DispatchesJobs;
use Illuminate\Foundation\Validation\ValidatesRequests;
use Illuminate\Routing\Controller as BaseController;

class Controller extends BaseController
{
    use AuthorizesRequests, DispatchesJobs, ValidatesRequests;

    public function sendResponse($data = [], $message = 'Success getting data.', $pagination = [])
    {
        $response = [
            'success' => true,
            'message' => $message,
            'data'    => $data,
            'error' => [
                'error_code' => '',
                'error_data' => [],
            ],
        ];

        $response['pagination'] = $pagination;

        // if (count($pagination) > 0) {
        //     $response['pagination'] = $pagination;
        // }

        return response()->json($response, 200);
    }

    public function sendError($message, $error_data = new \stdClass, $error_code = 'PROCESS_ERROR', $status_code = 400)
    {
        $response = [
            'success' => false,
            'message' => $message,
            'data' => [],
            'error' => [
                'error_code' => $error_code,
                'error_data' => $error_data,
            ],
        ];


        return response()->json($response, $status_code);
    }

    public function autoPagination($data)
    {
        $pagination = [
            'total' => $data->total(),
            'per_page' => $data->perPage(),
            'current_page' => $data->currentPage(),
            'last_page' => $data->lastPage(),
            'first_page_url' => $data->url(1),
            'last_page_url' => $data->url($data->lastPage()),
            'next_page_url' => $data->nextPageUrl(),
            'prev_page_url' => $data->previousPageUrl(),
            'from' => $data->firstItem(),
            'to' => $data->lastItem(),
        ];

        return $pagination;
    }

    public function additionalData($user)
    {
        try {
            $generateKey = substr(md5($user->id . 'file_key' . time()), 0, 10);
            $i = 1;
            while (ApiKey::where('file_key', $generateKey)->first()) {
                $generateKey = substr(md5($user->id . 'file_key' . time() . $i) . $i * 1111, 0, 10);
                $i++;
            }
            $apikey = ApiKey::create([
                'user_id' => $user->id,
                'domain' => 'Default',
                'secret_key' => md5($user->id . 'secret_key' . md5($user->id . md5($user->id))),
                'public_key' => md5($user->id . 'public_key' . md5($user->id . md5($user->id))),
                'file_key' => $generateKey,
            ]);

            $information = UserInformation::create([
                'user_id' => $user->id
            ]);
    
            $config = ApiConfig::create([
                'api_key_id' => $apikey->id,
            ]);

            $storage = Storage::create([
                'api_config_id' => $config->id,
            ]);

            ApiConfig::where('id', $config->id)->update([
                'storage_id' => $storage->id,
            ]);

            $this->createScriptFile($apikey);

            return true;
        } catch (\Exception $e) {
            return $this->sendError($e->getMessage(), $e->getTrace(), 'PROCESS_ERROR', 400);
        }
    }

    public function createKey($user, $name)
    {
        $generateKey = substr(md5($user->id . 'file_key' . $name . time()), 0, 10);
            $i = 1;
            while (ApiKey::where('file_key', $generateKey)->first()) {
                $generateKey = substr(md5($user->id . 'file_key' , $name . time() . $i) . $i * 1111, 0, 10);
                $i++;
            }
        $apikey = ApiKey::create([
            'user_id' => $user->id,
            'domain' => $name,
            'secret_key' => md5($user->id . 'secret_key' . $name . md5($user->id . $name . md5($user->id . $name))),
            'public_key' => md5($user->id . 'public_key' . $name . md5($user->id . $name . md5($user->id . $name))),
            'file_key' => $generateKey,
        ]);

        $config = ApiConfig::create([
            'api_key_id' => $apikey->id,
        ]);

        $storage = Storage::create([
            'api_config_id' => $config->id,
        ]);

        ApiConfig::where('id', $config->id)->update([
            'storage_id' => $storage->id,
        ]);

        $this->createScriptFile($apikey);

        return true;
    }

    public function createScriptFile($apikey)
    {
        $public_key = $apikey->public_key;
        $api = $apikey->secret_key;
        $url = url('/');
        $script = fopen(storage_path('app/js/upload.js'), 'r');
        $script = fread($script, filesize(storage_path('app/js/upload.js')));
        $script = str_replace("const api = '';", "const api = '" . $api . "';", $script);
        $script = str_replace("const url = '';", "const url = '" . $url . "';", $script);

        if (!file_exists(public_path('data/assets/js'))) {
            mkdir(public_path('data/assets/js'), 0777, true);
        }
        $file = fopen(public_path('data/assets/js/' . $apikey->file_key . '.js'), 'w');
        fwrite($file, $script);
        fclose($file);

        // return response($script)->header('Content-Type', 'text/javascript');
        return true;
    }
}

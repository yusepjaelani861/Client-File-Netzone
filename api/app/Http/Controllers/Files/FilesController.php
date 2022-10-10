<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use App\Models\APIs\ApiKey;
use App\Models\Files;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FilesController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['listPerAPI']]);
    }

    public function list()
    {
        $files = Files::where('user_id', Auth::user()->id)->with('api')->orderBy('created_at', 'desc')->paginate(10);

        $api = ApiKey::where([
            'user_id' => Auth::user()->id,
            'domain' => 'Default'
        ])->first();

        return $this->sendResponse([
            'files' => $files->items(),
            'upload' => $api->file_key
    ], 'Berhasil mendapatkan daftar file', $this->autoPagination($files));
    }

    public function listPerAPI(Request $request)
    {
        $apiHeader = $request->header('apikey');
        if (!$apiHeader) {
            return $this->sendError('apikey tidak ditemukan', new \stdClass, 'PROCESS_ERROR', 400);
        }

        $api = ApiKey::where('secret_key', $apiHeader)->first();
        if (!$api) {
            return $this->sendError('apikey tidak ditemukan', new \stdClass, 'PROCESS_ERROR', 400);
        }

        $files = Files::where('api_key_id', $api->id)->paginate(10);

        return $this->sendResponse($files->items(), 'Berhasil mendapatkan daftar file', $this->autoPagination($files));
    }

    public function filterList(Request $request)
    {
        $files = Files::where('user_id', Auth::user()->id);
        $files->where(function ($query) use ($request) {
            $query->where('name', 'like', '%' . $request->keyword . '%')
                ->orWhere('mime_type', 'like', '%' . $request->keyword . '%')
                ->orWhere('size', 'like', '%' . $request->keyword . '%');
        });

        $files = $files->paginate(10);

        return $this->sendResponse($files->items(), 'Berhasil mendapatkan daftar file ' . $request->keyword, $this->autoPagination($files));
    }

    public function delete(int $id)
    {
        try {
            DB::beginTransaction();
            $file = Files::where([
                'id' => $id,
                'user_id' => Auth::user()->id,
            ])->first();

            if (!$file) {
                return $this->sendError('File tidak ditemukan', new \stdClass, 'PROCESS_ERROR', 400);
            }

            $file->delete();

            DB::commit();

            return $this->sendResponse(new \stdClass, 'Berhasil menghapus file', []);
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->sendError('Gagal menghapus file', $th->getMessage(), 'PROCESS_ERROR', 400);
        }
    }
}

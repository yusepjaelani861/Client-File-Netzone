<?php

namespace App\Http\Controllers\APIs;

use App\Http\Controllers\Controller;
use App\Models\APIs\ApiKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class ApiKeyController extends Controller
{
    public function __construct() 
    {
        $this->middleware('auth:api');
    }

    public function list()
    {
        $api = ApiKey::where('user_id', Auth::user()->id)->orderBy('created_at', 'desc')->paginate(10);
        // $api->public_key = $api->file_key;
        $api->getCollection()->transform(function ($item) {
            $item->public_key = $item->file_key;
            return $item;
        });

        return $this->sendResponse($api->items(), 'Berhasil mendapatkan daftar API', $this->autoPagination($api));
    }

    public function search(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'nullable|string',
        ], [
            'name.string' => 'Kata kunci harus berupa string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validasi gagal', $validator->errors(), 'PROCESS_ERROR', 400);
        }

        $api = ApiKey::where('user_id', Auth::user()->id)
            ->where(function ($query) use ($request) {
                $query->where('domain', 'like', '%' . $request->name . '%')
                ->orWhere('secret_key', 'like', '%' . $request->name . '%')
                ->orWhere('file_key', 'like', '%' . $request->name . '%');
            })
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        $api->appends($request->all());

        return $this->sendResponse($api->items(), 'Berhasil mendapatkan daftar API', $this->autoPagination($api));
    }

    public function get(int $id)
    {
        $api = ApiKey::where('id', $id)->with('storage')->first();
        if (!$api) {
            return $this->sendError('API_KEY tidak ditemukan', new \stdClass, 'PROCESS_ERROR', 400);
        }

        return $this->sendResponse($api, 'API_KEY ditemukan', []);
    }

    public function create(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string',
        ], [
            'name.required' => 'Nama tidak boleh kosong',
            'name.string' => 'Nama harus berupa string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Validasi gagal', $validator->errors(), 'PROCESS_ERROR', 400);
        }

        if (ApiKey::where([
            'user_id' => Auth::user()->id,
            'domain' => $request->name
        ])->exists()) {
            return $this->sendError('Nama API sudah digunakan', null, 'PROCESS_ERROR', 400);
        }

        try {
            DB::beginTransaction();
            $this->createKey(Auth::user(), $request->name);

            DB::commit();

            return $this->sendResponse([], 'API berhasil dibuat', null, []);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Terjadi kesalahan', $e->getMessage(), 'PROCESS_ERROR', 500);
        }
    }

    public function delete(int $id)
    {
        $api = ApiKey::where([
            'user_id' => Auth::user()->id,
            'id' => $id
        ])->first();

        if (!$api) {
            return $this->sendError('API tidak ditemukan', null, 'PROCESS_ERROR', 400);
        }

        if ($api->domain == 'Default') {
            return $this->sendError('API Default tidak bisa dihapus', null, 'PROCESS_ERROR', 400);
        }

        try {
            DB::beginTransaction();
            ApiKey::where([
                'user_id' => Auth::user()->id,
                'id' => $id
            ])->delete();

            DB::commit();

            return $this->sendResponse('API berhasil dihapus', null, []);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->sendError('Terjadi kesalahan', $e->getMessage(), 'PROCESS_ERROR', 500);
        }
    }
}

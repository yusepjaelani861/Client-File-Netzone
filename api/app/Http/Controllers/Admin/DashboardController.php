<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\APIs\ApiKey;
use App\Models\Files;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function home()
    {
        $total = 0;
        $total_storage_used = ApiKey::where('user_id', Auth::user()->id)->with('storage');
        $total_storage_used->get()->each(function ($item) use (&$total) {
            $total += $item->storage->total_storage_used;
        });

        $total_api = $total_storage_used->count();
        $api = $total_storage_used->limit(5)->get();

        $total_files = Files::where('user_id', Auth::user()->id)->count();
        $users = User::count();
        $files = Files::where('user_id', Auth::user()->id)->orderBy('created_at', 'desc')->with('api')->limit(5)->get();
        

        return $this->sendResponse([
            'total_files' => $total_files,
            'total_users' => $users,
            'total_usage' => $total,
            'total_api' => $total_api,
            'files' => $files,
            'api' => $api,
        ], 'Success getting data.', []);

    }

    public function listFiles()
    {
        $files = Files::where('user_id', Auth::user()->id)->orderBy('created_at', 'desc')->with('api')->paginate(10);

        return $this->sendResponse($files->items(), 'Success getting data.', $this->autoPagination($files));
    }
}

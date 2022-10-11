<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\UserInformation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }

    public function me()
    {
        $user = User::where('id', Auth::user()->id)->with('role', 'information')->first();
        $user->information->first_name = $user->information->first_name ?? '';
        $user->information->last_name = $user->information->last_name ?? '';
        $user->information->address = $user->information->address ?? '';
        $user->information->city = $user->information->city ?? '';
        $user->information->country = $user->information->country ?? '';
        $user->information->postal_code = $user->information->postal_code ?? '';
        $user->information->phone_number = $user->information->phone_number ?? '';
        $user->information->additional_information = $user->information->additional_information ?? '';

        return $this->sendResponse($user, 'Success getting data.', []);
    }

    public function changePassword(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'password' => 'required|string|min:6',
            'new_password' => 'required|string|min:6|confirmed',
        ], [
            'password.required' => 'Password diperlukan',
            'password.min' => 'Password minimal 6 karakter',
            'new_password.required' => 'Password baru diperlukan',
            'new_password.min' => 'Password baru minimal 6 karakter',
            'new_password.confirmed' => 'Password baru tidak sama',
        ]);

        
        if ($validator->fails()) {
            return $this->sendError('Validasi error', $validator->errors(), 'PROCESS_ERROR', 400);
        }
        
        try {
            DB::beginTransaction();
            $user = User::where('id', Auth::user()->id)->first();

            if (!Hash::check($request->password, $user->password)) {
                return $this->sendError('Password yang dimasukkan tidak sesuai', ['password' => 'Password lama tidak sesuai'], 'PROCESS_ERROR', 400);
            }

            $user->password = Hash::make($request->new_password);
            $user->save();

            DB::commit();

            return $this->sendResponse($user, 'Success changing password.', []);
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->sendError('Error perubahan password', $th->getMessage(), 'PROCESS_ERROR', 400);
        }
    }

    public function changeAvatar(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'avatar' => 'required|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
        ], [
            'avatar.required' => 'Avatar diperlukan',
            'avatar.image' => 'Avatar harus berupa gambar',
            'avatar.mimes' => 'Avatar harus berupa gambar dengan format jpeg, png, jpg, gif, svg',
            'avatar.max' => 'Avatar maksimal 2MB',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error validation', $validator->errors(), 'PROCESS_ERROR', 400);
        }

        $file = $request->file('avatar');
        
        $name = sha1($file->getClientOriginalName() . time() . uniqid());

        $store = Storage::disk('public')->put('images/' . $name, file_get_contents($file));
        if ($store) {
            try {
                DB::beginTransaction();
                $user = User::where('id', Auth::user()->id)->first();
                $user->avatar = $name . '.webp';
                $user->save();

                DB::commit();

                return $this->sendResponse($user, 'Success changing avatar.', []);
            } catch (\Throwable $th) {
                DB::rollBack();
                return $this->sendError('Error mengubah avatar', $th->getMessage(), 'PROCESS_ERROR', 400);
            }
        } else {
            return $this->sendError('Error mengubah avatar', 'Error upload avatar', 'PROCESS_ERROR', 400);
        }
    }

    public function editProfile(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'first_name' => 'nullable|string',
            'last_name' => 'nullable|string',
            'address' => 'nullable|string',
            'city' => 'nullable|string',
            'country' => 'nullable|string',
            'postal_code' => 'nullable|string',
            'phone_number' => 'nullable|string',
            'additional_information' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Error validation', $validator->errors(), 'PROCESS_ERROR', 400);
        }

        try {
            DB::beginTransaction();
            UserInformation::where('user_id', Auth::user()->id)->update([
                'first_name' => $request->first_name,
                'last_name' => $request->last_name,
                'address' => $request->address,
                'city' => $request->city,
                'country' => $request->country,
                'postal_code' => $request->postal_code,
                'phone_number' => $request->phone_number,
                'additional_information' => $request->additional_information,
            ]);

            DB::commit();

            return $this->sendResponse([], 'Success edit profile.', []);
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->sendError('Error edit profile', $th->getMessage(), 'PROCESS_ERROR', 400);
        }
    }
}

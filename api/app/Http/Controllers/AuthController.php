<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api', ['except' => ['login', 'register', 'verifyEmail']]);
    }

    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'username' => 'required|string|between:2,100|alpha_dash|unique:users',
            'email' => 'required|string|email|max:100|unique:users',
            'password' => 'required|string|confirmed|min:6',
        ], [
            'username.required' => 'Username dibutuhkan',
            'username.string' => 'Username harus berupa string',
            'username.between' => 'Username harus antara 2 sampai 100 karakter',
            'username.alpha_dash' => 'Username hanya boleh berisi huruf, angka, strip, dan garis bawah',
            'username.unique' => 'Username sudah terdaftar',
            'email.required' => 'Email dibutuhkan',
            'email.string' => 'Email harus berupa string',
            'email.email' => 'Email tidak valid',
            'email.max' => 'Email maksimal 100 karakter',
            'email.unique' => 'Email sudah terdaftar',
            'password.required' => 'Password dibutuhkan',
            'password.string' => 'Password harus berupa string',
            'password.confirmed' => 'Password tidak sama',
            'password.min' => 'Password minimal 6 karakter',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Gagal mendaftar', $validator->errors(), 'VALIDATION_ERROR', 400);
        }

        try {
            DB::beginTransaction();
            $user = User::create([
                'role_id' => 1,
                'name' => $request->username,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // avatar
            $name = sha1($request->username . md5(Str::random(60)));
            if (!file_exists(storage_path('app/public/images'))) {
                mkdir(storage_path('app/public/images'), 0777, true);
            }
            file_put_contents(storage_path('app/public/images/' . $name), file_get_contents('https://ui-avatars.com/api/?name=' . $request->username));
            $url = $name . '.webp';

            $id = $user->id;
            $user = User::where('id', $user->id)->update([
                'avatar' => $url,
            ]);

            $user = User::where('id', $id)->first();

            $this->additionalData($user);

            $token = Str::random(60);
            DB::table('email_verifications')->insert([
                'user_id' => $user->id,
                'token' => $token,
                'expires_at' => now()->addMinutes(30),
            ]);

            if (!$token = auth()->login($user)) {
                DB::rollBack();
                return $this->sendError('Gagal mendaftar', 'Gagal membuat token', 'TOKEN_ERROR', 500);
            }

            $response = [
                'user' => $user,
                'token' => $token,
                'expired_at' => auth()->factory()->getTTL() * 60,
            ];

            DB::commit();
            return $this->sendResponse($response, 'Berhasil mendaftar', []);
        } catch (\Throwable $th) {
            DB::rollBack();
            return $this->sendError($th->getMessage(), $th->getTrace(), 'PROCESS_ERROR', 400);
        }
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user' => 'required|string|between:2,100',
            'password' => 'required|string|min:6',
        ], [
            'user.required' => 'Username atau email dibutuhkan',
            'user.string' => 'Username atau email harus berupa string',
            'user.between' => 'Username atau email harus antara 2 sampai 100 karakter',
            'password.required' => 'Password dibutuhkan',
            'password.string' => 'Password harus berupa string',
            'password.min' => 'Password minimal 6 karakter',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Gagal masuk', $validator->errors(), 'VALIDATION_ERROR', 400);
        }

        $user = User::where('username', $request->user)->orWhere('email', $request->user)->first();
        if (!$user) {
            return $this->sendError('Gagal masuk', 'Username atau email tidak ditemukan', 'UNAUTHORIZED', 400);
        }

        if (!Hash::check($request->password, $user->password)) {
            return $this->sendError('Gagal masuk', 'Username atau password salah', 'UNAUTHORIZED', 400);
        }

        $credentials = [
            'email' => $user->email,
            'password' => $request->password,
        ];

        if (!$token = auth()->attempt($credentials)) {
            return $this->sendError('Gagal masuk', 'Username atau password salah', 'UNAUTHORIZED', 400);
        }

        return $this->sendResponse([
            'user' => $user,
            'token' => $token,
            'expired_at' => auth()->factory()->getTTL() * 60,
        ], 'Berhasil masuk');
    }

    public function verifyEmail(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
        ], [
            'token.required' => 'Token dibutuhkan',
            'token.string' => 'Token harus berupa string',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Gagal memverifikasi email', $validator->errors(), 'VALIDATION_ERROR', 400);
        }

        $emailVerification = DB::table('email_verifications')->where('token', $request->token)->first();

        if (!$emailVerification) {
            return $this->sendError('Gagal memverifikasi email', 'Token tidak ditemukan', 'NOT_FOUND', 400);
        }

        if (now()->gt($emailVerification->expires_at)) {
            return $this->sendError('Gagal memverifikasi email', 'Token kadaluarsa', 'EXPIRED', 400);
        }

        User::where('id', $emailVerification->user_id)->update([
            'email_verified_at' => now(),
        ]);

        DB::table('email_verifications')->where('token', $request->token)->delete();

        return $this->sendResponse([], 'Berhasil memverifikasi email');
    }

    public function resendVerif()
    {
        $user = auth()->user();

        if ($user->email_verified_at) {
            return $this->sendError('Gagal mengirim ulang verifikasi email', 'Email sudah diverifikasi', 'PROCESS_ERROR', 400);
        }

        $token = Str::random(60);
        DB::table('email_verifications')->insert([
            'user_id' => $user->id,
            'token' => $token,
            'expires_at' => now()->addMinutes(30),
        ]);

        return $this->sendResponse([
            // 'token' => $token,
        ], 'Berhasil mengirim ulang verifikasi email');
    }

    public function logout()
    {
        auth()->logout();
        return $this->sendResponse([], 'Berhasil keluar');
    }

    public function refresh()
    {
        return $this->sendResponse([
            'token' => auth()->refresh(),
        ], 'Berhasil merefresh token');
    }
}

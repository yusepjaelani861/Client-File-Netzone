<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class ForgotPassword extends Controller
{
    public function send(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'user' => 'required|string',
        ], [
            'user.required' => 'User diperlukan.',
            'user.string' => 'User harus berupa string.',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Gagal mengirim email', $validator->errors(), 'VALIDATION_ERROR', 400);
        }

        $user = User::where('email', $request->user)->orWhere('username', $request->user)->first();

        if (!$user) {
            return $this->sendError('Gagal mengirim email', 'User tidak ditemukan', 'PROCESS_ERROR', 400);
        }
        
        $token = Str::random(30);
        DB::table('password_resets')->insert([
            'email' => $user->email,
            'token' => $token,
            'created_at' => now(),
        ]);

        return $this->sendResponse([], 'Berhasil mengirim email reset password');
    }

    public function reset(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'token' => 'required|string',
            'password' => 'required|string|min:6|confirmed',
        ], [
            'token.required' => 'Token diperlukan.',
            'token.string' => 'Token harus berupa string.',
            'password.required' => 'Password diperlukan.',
            'password.string' => 'Password harus berupa string.',
            'password.min' => 'Password minimal 6 karakter.',
            'password.confirmed' => 'Konfirmasi password tidak cocok.',
        ]);

        if ($validator->fails()) {
            return $this->sendError('Gagal mereset password', $validator->errors(), 'VALIDATION_ERROR', 400);
        }

        $passwordReset = DB::table('password_resets')->where('token', $request->token)->first();

        if (!$passwordReset) {
            return $this->sendError('Gagal mereset password', 'Token tidak ditemukan', 'PROCESS_ERROR', 400);
        }

        $user = User::where('email', $passwordReset->email)->first();

        if (!$user) {
            return $this->sendError('Gagal mereset password', 'User tidak ditemukan', 'PROCESS_ERROR', 400);
        }

        $user->password = Hash::make($request->password);
        $user->save();

        DB::table('password_resets')->where('email', $user->email)->delete();

        return $this->sendResponse([], 'Berhasil mereset password');
    }
}

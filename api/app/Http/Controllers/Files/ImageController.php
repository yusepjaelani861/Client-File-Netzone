<?php

namespace App\Http\Controllers\Files;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Intervention\Image\Facades\Image;

class ImageController extends Controller
{
    public function image($name)
    {
        $name = str_replace('.webp', '', $name);

        $filePath = storage_path('app/public/images/' . $name);
        $cek = public_path('images/' . $name . '.webp');
        
        if (!file_exists(public_path('images'))) {
            mkdir(public_path('images'), 0777, true);
        }

        $img = Image::make($filePath);
        $img->encode('webp', 80)->save($cek);

        $file = public_path('images/' . $name);

        return redirect()->to(url('/') . '/images/' . $name . '.webp');
    }

    public function imageWidth($width, $name)
    {
        $name = str_replace('.webp', '', $name);

        $filePath = storage_path('app/public/images/' . $name);

        if (!file_exists(public_path('images/' . $width))) {
            mkdir(public_path('images/' . $width), 0777, true);
        }

        $cek = public_path('images/' . $width . '/' . $name . '.webp');

        $img = Image::make($filePath)->resize($width, null, function ($constraint) {
            $constraint->aspectRatio();
        });

        $img->encode('webp', 80)->save($cek);

        $file = public_path('images/' . $width . '/' . $name . '.webp');

        return redirect()->to(url('/') . 'images/' . $width . '/' . $name . 'webp');
    }
}

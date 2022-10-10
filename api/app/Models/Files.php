<?php

namespace App\Models;

use App\Models\APIs\ApiKey;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Files extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'storage_id',
        'api_key_id',
        'name',
        'name_encrypted',
        'path',
        'extension',
        'mime_type',
        'size',
        'hash',
        'disk',
        'url',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function api()
    {
        return $this->belongsTo(ApiKey::class, 'api_key_id', 'id')->select('id', 'domain');
    }
}

<?php

namespace App\Models\APIs;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiKey extends Model
{
    use HasFactory;
    
    protected $fillable = [
        'user_id',
        'domain',
        'secret_key',
        'public_key',
        'file_key',
    ];

    public function config()
    {
        return $this->hasOne(ApiConfig::class)->with('storage');
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function storage()
    {
        return $this->hasOne(ApiConfig::class)->select('id', 'api_key_id', 'total_storage_used', 'max_storage');
    }
}

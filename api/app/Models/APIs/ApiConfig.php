<?php

namespace App\Models\APIs;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ApiConfig extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_key_id',
        'max_file_size',
        'max_files_per_request',
        'total_storage_used',
        'max_storage',
        'storage_id',
    ];

    public function storage()
    {
        return $this->belongsTo(Storage::class);
    }
}

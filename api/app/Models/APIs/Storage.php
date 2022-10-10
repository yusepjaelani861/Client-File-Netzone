<?php

namespace App\Models\APIs;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Storage extends Model
{
    use HasFactory;

    protected $fillable = [
        'api_config_id',
        'primary_storage',
        'ftp_host',
        'ftp_port',
        'ftp_username',
        'ftp_password',
        'sftp_host',
        'sftp_port',
        'sftp_username',
        'sftp_password',
        'S3_KEY',
        's3_secret',
        's3_region',
        's3_bucket',
        's3_url',
        's3_endpoint',
    ];
}

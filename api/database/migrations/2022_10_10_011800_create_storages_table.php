<?php

use App\Models\APIs\ApiConfig;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('storages', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ApiConfig::class);
            $table->enum('primary_storage', ['local', 'ftp', 'sftp', 's3'])->default('local');
            $table->string('ftp_host')->nullable();
            $table->string('ftp_port')->nullable();
            $table->string('ftp_username')->nullable();
            $table->string('ftp_password')->nullable();
            $table->string('sftp_host')->nullable();
            $table->string('sftp_port')->nullable();
            $table->string('sftp_username')->nullable();
            $table->string('sftp_password')->nullable();
            $table->string('s3_key')->nullable();
            $table->string('s3_secret')->nullable();
            $table->string('s3_region')->nullable();
            $table->string('s3_bucket')->nullable();
            $table->string('s3_endpoint')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('storages');
    }
};

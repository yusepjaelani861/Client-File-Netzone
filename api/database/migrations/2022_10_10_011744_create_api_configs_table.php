<?php

use App\Models\APIs\ApiKey;
use App\Models\APIs\Storage;
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
        Schema::create('api_configs', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(ApiKey::class);
            $table->foreignIdFor(Storage::class)->nullable();
            $table->string('max_file_size')->default('102400');
            $table->string('max_files_per_request')->default('10');
            $table->longText('total_storage_used')->default('0');
            $table->longText('max_storage')->default('16106127360');
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
        Schema::dropIfExists('api_configs');
    }
};

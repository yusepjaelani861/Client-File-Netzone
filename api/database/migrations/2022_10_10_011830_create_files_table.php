<?php

use App\Models\APIs\ApiKey;
use App\Models\APIs\Storage;
use App\Models\User;
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
        Schema::create('files', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(User::class);
            $table->foreignIdFor(Storage::class);
            $table->foreignIdFor(ApiKey::class);
            $table->string('name');
            $table->string('name_encrypted');
            $table->string('path');
            $table->string('extension');
            $table->string('mime_type');
            $table->string('size');
            $table->string('hash');
            $table->string('disk');
            $table->string('url')->nullable()->unique();
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
        Schema::dropIfExists('files');
    }
};

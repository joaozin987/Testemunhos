<?php

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
    public function up(): void
    {
        Schema::create('depoimentos', function (Blueprint $table) {
            $table->id();
            $table->text('experiencia');
            $table->string('imagem_url')->nullable();
            $table->string('movimento', 100); 
            $table->timestamp('data_criacao')->useCurrent();
            $table->string('nome_autor', 100)->nullable(); 
            $table->integer('idade_autor')->nullable();
            $table->foreignId('usuario_id')->nullable()->constrained('users')->onDelete('set null'); // Aponta para a tabela 'users'
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
        Schema::dropIfExists('depoimentos');
    }
};
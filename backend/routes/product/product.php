<?php

use App\Http\Controllers\Product\ProductController;
use Illuminate\Support\Facades\Route;

Route::prefix('products')->middleware('auth:api')->group(function () {
    Route::post('/import-products', [ProductController::class, 'import']);
    Route::get('/', [ProductController::class, 'index']);
});

<?php

namespace App\Http\Controllers\Product;

use App\Http\Controllers\Controller;
use App\Http\Requests\Product\ProductCSVFileUploadRequest;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;


class ProductController extends Controller
{

    public function import(ProductCSVFileUploadRequest $request)
    {

        $path = $request->file('file')->store('temp');
        $fullPath = storage_path('app/' . $path);

        $userId = Auth::id();

        $handle = fopen($fullPath, 'r');
        if (!$handle) {
            return response()->json(['error' => 'Unable to open file.'], 500);
        }

        $header = fgetcsv($handle);
        if (!$header || count($header) < 4) {
            fclose($handle);
            Storage::delete($path);
            return response()->json(['error' => 'Invalid CSV header format. Expected 4 columns: name, price, sku, description'], 422);
        }

        $batchSize = 1000;
        $batch = [];
        $rowCount = 0;
        $errors = [];

        DB::beginTransaction();

        try {
            while (($data = fgetcsv($handle)) !== false) {
                $rowCount++;

                if (count($data) < 4) {
                    $errors[] = "Row {$rowCount} has missing columns.";
                    continue;
                }

                [$name, $price, $sku, $description] = $data;

                // Basic validation
                if (empty($name) || empty($sku) || !is_numeric($price)) {
                    $errors[] = "Row {$rowCount} has invalid data.";
                    continue;
                }

                $batch[] = [
                    'name' => $name,
                    'price' => (float) $price,
                    'sku' => $sku,
                    'description' => $description,
                    'user_id' => $userId,
                    'created_at' => now(),
                    'updated_at' => now(),
                ];

                if (count($batch) === $batchSize) {
                    DB::table('products')->insert($batch);
                    $batch = [];
                }
            }

            if (!empty($batch)) {
                DB::table('products')->insert($batch);
            }

            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            fclose($handle);
            Storage::delete($path);
            return response()->json(['error' => 'Import failed,Please check your file for Duplications or Errors'], 500);
        }

        fclose($handle);
        Storage::delete($path);

        return response()->json([
            'message' => "Import completed with $rowCount rows processed.",
            'errors' => $errors,
        ]);
    }


    public function index(Request $request)
    {
        $query = Auth::user()->products();

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('sku', 'like', "%{$search}%")
                    ->orWhere('description', 'like', "%{$search}%");
            });
        }

        $products = $query->paginate(10);

        return response()->json($products);
    }
}

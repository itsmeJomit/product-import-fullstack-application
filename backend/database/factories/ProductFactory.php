<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $user = User::inRandomOrder()->first();

        if (!$user) {
            throw new \Exception('No users found in the database.');
        }

        $sku = 'SKU-' . $user->id . '-' . $this->faker->unique()->numberBetween(1000, 9999);

        return [
            'name' => $this->faker->word(),
            'price' => $this->faker->randomFloat(2, 5, 100),
            'sku' => $sku,
            'description' => $this->faker->sentence(10),
            'user_id' => $user->id,
        ];
    }
}

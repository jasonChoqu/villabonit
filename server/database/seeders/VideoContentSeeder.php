<?php

namespace Database\Seeders;

use App\Models\VideoContent;
use Illuminate\Database\Seeder;

class VideoContentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        VideoContent::create([
            'title' => 'Video Institucional',
            'description' => 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maceenas accumsan lacus vel facilisis.',
            'video_url' => 'https://www.youtube.com/watch?v=KtSnNuf9zdw',
            'is_active' => true,
            'order' => 1
        ]);
    }
}
<?php

namespace App\Policies;

use App\Models\ConversionJob;
use App\Models\User;

class ConversionJobPolicy
{
    public function view(User $user, ConversionJob $conversionJob): bool
    {
        return $user->is_admin || $conversionJob->user_id === $user->id;
    }

    public function delete(User $user, ConversionJob $conversionJob): bool
    {
        return $user->is_admin || $conversionJob->user_id === $user->id;
    }
}


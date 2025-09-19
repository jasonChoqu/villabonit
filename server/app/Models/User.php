<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Passport\HasApiTokens;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Casts\Attribute;
class User extends Authenticatable
{
    use HasApiTokens, HasFactory, Notifiable, SoftDeletes, HasRoles;

    protected $guard_name = 'api';
    protected $fillable = [
        'name',
        'first_name',
        'last_name',
        'email',
        'password',
        'ci',
        'registration_code',
        'address',
        'mobile_number',
        'phone_number',
        'college_affiliation_date',
        'linkedin_url',
        'portfolio_url',
        'professional_summary',
        'travel_availability',
        'has_driving_license',
        'driving_license_category',
        'edit_profile',
        'created_id',
        'updated_id',
        'deleted_id',
        'restored_id',
        'created_at',
        'updated_at',
        'deleted_at',
        'restored_at',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

     protected static function boot()
    {
        parent::boot();

        static::creating(function ($user) {
            if (empty($user->name)) {
                $firstName = $user->first_name ? ucfirst(strtolower($user->first_name)) : '';
                $lastName = $user->last_name ? ucfirst(strtolower($user->last_name)) : '';
                $user->name = trim("{$firstName} {$lastName}");
            }
        });

        static::updating(function ($user) {
            if ($user->isDirty(['first_name', 'last_name'])) {
                $firstName = $user->first_name ? ucfirst(strtolower($user->first_name)) : '';
                $lastName = $user->last_name ? ucfirst(strtolower($user->last_name)) : '';
                $user->name = trim("{$firstName} {$lastName}");
            }
        });
    }
    
    protected function firstName(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => ucfirst(strtolower($value)),
        );
    }

    protected function lastName(): Attribute
    {
        return Attribute::make(
            set: fn (string $value) => ucfirst(strtolower($value)),
        );
    }

    
    protected function fullName(): Attribute
    {
        return Attribute::make(
            get: fn (?string $value) => $value ?? trim($this->first_name . ' ' . $this->last_name),
            set: function (?string $value) {
                if ($value !== null) {
                    return $value;
                }
                
                $firstName = $this->first_name ? ucfirst(strtolower($this->first_name)) : '';
                $lastName = $this->last_name ? ucfirst(strtolower($this->last_name)) : '';
                
                return trim("{$firstName} {$lastName}");
            },
        );
    }

    public function scopeSearch(Builder $query, ?string $search): Builder
    {
        if (!$search) {
            return $query;
        }

        return $query->where(function($q) use ($search) {
            $q->whereRaw('LOWER(name) LIKE ?', ['%' . strtolower($search) . '%'])
                ->orWhereRaw('LOWER(email) LIKE ?', ['%' . strtolower($search) . '%']);
        });
    }

    public function scopeFilterByRole(Builder $query, ?string $role): Builder
    {
        if (!$role) {
            return $query;
        }

        return $query->whereHas('roles', function($q) use ($role) {
            $q->where('name', $role);
        });
    }

    public function scopeSort(Builder $query, string $sortBy = 'id', string $sortDir = 'asc'): Builder
    {
        return $query->orderBy($sortBy, $sortDir);
    }

    public function scopeExcludeAdmin(Builder $query): Builder
    {
        return $query->where('email', '!=', 'admin@ctb.com.bo');
    }

    public function scopeWithRolesAndPermissions(Builder $query): Builder
    {
        return $query->with(['roles', 'permissions']);
    }

    public function academicTrainings()
    {
        return $this->hasMany(AcademicTraining::class);
    }

    public function workExperiences()
    {
        return $this->hasMany(WorkExperience::class);
    }

    public function technicalSkills()
    {
        return $this->hasMany(TechnicalSkill::class);
    }

     public function workReferences()
    {
        return $this->hasMany(WorkReference::class);
    }
}

<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\V1\{
    AnnouncementController,
    Auth\AuthController,
    Auth\ProfileController,
    Auth\AcademicTrainingController,
    Auth\TechnicalSkillController,
    Auth\WorkExperienceController,
    Auth\WorkReferenceController,
    BeginningController,
    ContactController,
    DirectivityController,
    MoralValueController,
    CourseController,
    ClientController,
    EventController,
    EventTypeController,
    HistoryController,
    PermissionController,
    RequirementController,
    AgreementController,
    NewsletterController,
    FaqController,
    BannerController,
    PaymentController,
    SocialNetworkController,
    RoleController,
    RolePermissionController,
    UserController,
    UserRoleController,
    CertificationController,
    CertificationTemplateController,
    ResourceBeginController,
    GalleryController
};

Route::prefix('api')                 // <- asegura /api/...
    ->name('api.')
    ->middleware('throttle:api')     // rate limit de la API
    ->group(function () {

    Route::prefix('v1')->name('v1.')->group(function () {

        // --- Healthcheck / Ping ---
        Route::get('health', fn () => response()->json(['ok' => true]));

        // --- Autenticación (público) ---
        Route::post('login',        [AuthController::class, 'login'])->name('auth.login');

        // --- Endpoints públicos / lectura ---
        // Nota: idealmente usa index con ?per_page=-1 en vez de /all, pero dejamos alias por compatibilidad.
        Route::apiResource('agreements', AgreementController::class)->only(['index','show']);
        Route::get('agreements/all',        [AgreementController::class, 'all'])->name('agreements.all');

        Route::apiResource('histories',     HistoryController::class)->only(['index','show']);
        Route::get('histories/all',         [HistoryController::class, 'all'])->name('histories.all');

        Route::apiResource('resource-begin', ResourceBeginController::class)->only(['index','show'])
              ->parameters(['resource-begin' => 'resourceBegin']); // slug legible

        Route::get('beginnings/all',        [BeginningController::class, 'all'])->name('beginnings.all');
        Route::get('contacts/all',          [ContactController::class, 'all'])->name('contacts.all');
        Route::get('clients/all',           [ClientController::class, 'all'])->name('clients.all');
        Route::get('courses/all',           [CourseController::class, 'all'])->name('courses.all');
        Route::get('directivities/all',     [DirectivityController::class, 'all'])->name('directivities.all');
        Route::get('events/all',            [EventController::class, 'all'])->name('events.all');
        Route::get('faqs/all',              [FaqController::class, 'all'])->name('faqs.all');
        Route::get('gallery/all',           [GalleryController::class, 'all'])->name('gallery.all');
        Route::get('banners/all',           [BannerController::class, 'all'])->name('banners.all');
        Route::get('moral-values/all',      [MoralValueController::class, 'all'])->name('moral_values.all');
        Route::get('requirements/all',      [RequirementController::class, 'all'])->name('requirements.all');
        Route::get('social-networks/all',   [SocialNetworkController::class, 'all'])->name('social_networks.all');

        Route::post('newsletters/send',     [NewsletterController::class, 'send'])->name('newsletters.send');

        // --- Protegido ---
        Route::middleware('auth:api')->group(function () {

            // Perfil / sesión
            Route::post('me',               [AuthController::class, 'me'])->name('auth.me');
            Route::post('logout',           [AuthController::class, 'logout'])->name('auth.logout');
            Route::post('profile',          [ProfileController::class, 'profile'])->name('profile.show');
            Route::put('profile/{id}',      [ProfileController::class, 'update'])->name('profile.update');
            Route::put('profile/{id}/personal-information',
                       [ProfileController::class, 'updatePersonalInformation'])->name('profile.personal_information');

            // Usuarios y anidados
            Route::get('users/all',         [UserController::class, 'all'])->name('users.all');
            Route::apiResource('users', UserController::class);

            // anidados (usar slugs y shallow para URLs más limpias)
            Route::apiResource('users.academic-trainings', AcademicTrainingController::class)->shallow();
            Route::apiResource('users.work-experiences',  WorkExperienceController::class)->shallow();
            Route::apiResource('users.work-references',   WorkReferenceController::class)->shallow();
            Route::apiResource('users.technical-skills',  TechnicalSkillController::class)->shallow();

            // Roles & permisos
            Route::get('roles/all',         [RoleController::class, 'all'])->name('roles.all');
            Route::apiResource('roles',     RoleController::class);

            Route::get('permissions/all',   [PermissionController::class, 'all'])->name('permissions.all');
            Route::apiResource('permissions', PermissionController::class)->only(['index','show']);

            Route::prefix('roles/{role}/permissions')->group(function () {
                Route::get('/',    [RolePermissionController::class, 'rolePermissions'])->name('roles.permissions.index');
                Route::post('/sync',[RolePermissionController::class, 'syncPermissions'])->name('roles.permissions.sync');
            });

            Route::prefix('users/{user}/roles')->group(function () {
                Route::get('/',    [UserRoleController::class, 'userRoles'])->name('users.roles.index');
                Route::post('/sync',[UserRoleController::class, 'syncRoles'])->name('users.roles.sync');
            });

            // Catálogos administrables
            Route::apiResource('event-types', EventTypeController::class);
            Route::apiResource('events',      EventController::class);
            Route::apiResource('announcements', AnnouncementController::class);
            Route::apiResource('courses',     CourseController::class);
            Route::apiResource('contacts',    ContactController::class);
            Route::apiResource('clients',     ClientController::class);
            Route::apiResource('beginnings',  BeginningController::class);
            Route::apiResource('moral-values',MoralValueController::class);
            Route::apiResource('directivities', DirectivityController::class);
            Route::apiResource('requirements',  RequirementController::class);
            Route::apiResource('newsletters',   NewsletterController::class);
            Route::apiResource('faqs',          FaqController::class);
            Route::apiResource('social-networks', SocialNetworkController::class);
            Route::apiResource('payment',       PaymentController::class);
            Route::apiResource('gallery',       GalleryController::class);
            Route::apiResource('banners',       BannerController::class);

            // Certifications (ejemplo con prefijo propio)
            Route::prefix('certifications')->group(function () {
                Route::apiResource('/', CertificationController::class)
                     ->parameters(['' => 'certification']);
            });
            // Route::apiResource('certification-templates', CertificationTemplateController::class);
        });

        // 404 JSON homogéneo para API
        Route::fallback(fn() => response()->json(['message' => 'Not Found'], 404));
    });
});

<?php
/**
 * Конфигурация приложения
 * Загружает переменные из .env файла
 */

// Загрузка .env файла
function loadEnv($path) {
    if (!file_exists($path)) {
        return false;
    }

    $lines = file($path, FILE_IGNORE_NEW_LINES | FILE_SKIP_EMPTY_LINES);
    foreach ($lines as $line) {
        // Пропускаем комментарии
        if (strpos(trim($line), '#') === 0) {
            continue;
        }

        // Парсим KEY=value
        if (strpos($line, '=') !== false) {
            list($key, $value) = explode('=', $line, 2);
            $key = trim($key);
            $value = trim($value);

            // Убираем кавычки если есть
            $value = trim($value, '"\'');

            // Устанавливаем переменную окружения
            putenv("$key=$value");
            $_ENV[$key] = $value;
        }
    }
    return true;
}

// Загружаем .env из корня проекта
$envPath = dirname(__DIR__) . '/.env';
loadEnv($envPath);

// Хелпер для получения переменных с дефолтным значением
function env($key, $default = null) {
    $value = getenv($key);
    if ($value === false) {
        return $default;
    }

    // Конвертируем строковые булевы значения
    if (strtolower($value) === 'true') return true;
    if (strtolower($value) === 'false') return false;

    return $value;
}

// ===== КОНФИГУРАЦИЯ =====

// Безопасность
define('ADMIN_PASSWORD', env('ADMIN_PASSWORD', 'CHANGE_ME_IMMEDIATELY'));
define('CSRF_SECRET', env('CSRF_SECRET', 'default_csrf_secret_change_me'));

// Пути
define('UPLOADS_DIR', env('UPLOADS_DIR', 'uploads'));
define('EVENTS_JSON', env('EVENTS_JSON', 'events.json'));
define('BOXES_JSON', env('BOXES_JSON', 'boxes.json'));

// API
define('CORS_ALLOWED_ORIGINS', env('CORS_ALLOWED_ORIGINS', '*'));
define('SITE_URL', env('SITE_URL', 'http://localhost:8000'));

// Загрузка файлов
define('MAX_UPLOAD_SIZE', (int) env('MAX_UPLOAD_SIZE', 10485760));
define('ALLOWED_EXTENSIONS', explode(',', env('ALLOWED_EXTENSIONS', 'jpg,jpeg,png,gif,webp')));

// Режим разработки
define('DEBUG_MODE', env('DEBUG_MODE', false));
define('DISPLAY_ERRORS', env('DISPLAY_ERRORS', false));

// Настройка отображения ошибок
if (DEBUG_MODE) {
    error_reporting(E_ALL);
    ini_set('display_errors', DISPLAY_ERRORS ? '1' : '0');
} else {
    error_reporting(0);
    ini_set('display_errors', '0');
}

// ===== ХЕЛПЕРЫ БЕЗОПАСНОСТИ =====

/**
 * Генерация CSRF-токена
 */
function generateCsrfToken() {
    if (empty($_SESSION['csrf_token'])) {
        $_SESSION['csrf_token'] = bin2hex(random_bytes(32));
    }
    return $_SESSION['csrf_token'];
}

/**
 * Проверка CSRF-токена
 */
function verifyCsrfToken($token) {
    return isset($_SESSION['csrf_token']) && hash_equals($_SESSION['csrf_token'], $token);
}

/**
 * Проверка пароля
 */
function verifyPassword($password) {
    // TODO: В продакшене использовать password_hash/password_verify
    return $password === ADMIN_PASSWORD;
}

/**
 * Проверка разрешённого расширения файла
 */
function isAllowedExtension($filename) {
    $ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));
    return in_array($ext, ALLOWED_EXTENSIONS);
}

/**
 * Настройка CORS-заголовков
 */
function setCorsHeaders() {
    $origin = $_SERVER['HTTP_ORIGIN'] ?? '*';

    if (CORS_ALLOWED_ORIGINS === '*') {
        header('Access-Control-Allow-Origin: *');
    } else {
        $allowed = explode(',', CORS_ALLOWED_ORIGINS);
        if (in_array($origin, $allowed)) {
            header("Access-Control-Allow-Origin: $origin");
        }
    }

    header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
    header('Access-Control-Allow-Headers: Content-Type');
}

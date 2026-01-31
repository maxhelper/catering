<?php
session_start();
if (!isset($_SESSION['auth'])) {
    header('Location: login.php');
    exit;
}

$jsonFile = 'boxes.json';
if (!file_exists($jsonFile)) {
    file_put_contents($jsonFile, '{}');
}
$data = json_decode(file_get_contents($jsonFile), true);
if (!is_array($data)) {
    $data = [];
}

// Обработка удаления фотографии
if (isset($_POST['delete_photo'])) {
    $boxId = $_POST['box_id'];
    $photoField = $_POST['photo_field'];
    if (isset($data[$boxId][$photoField])) {
        $photoPath = $data[$boxId][$photoField];
        if (file_exists($photoPath)) {
            unlink($photoPath);
        }
        $data[$boxId][$photoField] = '';
        file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    }
    header('Content-Type: application/json');
    echo json_encode(['success' => true]);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' && !isset($_POST['delete_photo'])) {
    // Добавляем отладку
    error_log("POST request received");
    error_log("POST data: " . print_r($_POST, true));
    
    $id = $_POST['id'] ?? uniqid();
    
    // Если редактируем существующий бокс, сохраняем текущие фотографии
    $existingPhotos = isset($data[$id]) ? [
        'photo1' => $data[$id]['photo1'] ?? '',
        'photo2' => $data[$id]['photo2'] ?? '',
        'photo3' => $data[$id]['photo3'] ?? ''
    ] : ['photo1' => '', 'photo2' => '', 'photo3' => ''];
    
    $data[$id] = [
        'name' => $_POST['name'] ?? '',
        'short_description' => $_POST['short_description'] ?? '',
        'price' => $_POST['price'] ?? '',
        'photo1' => $existingPhotos['photo1'],
        'photo2' => $existingPhotos['photo2'],
        'photo3' => $existingPhotos['photo3'],
        'badge1' => $_POST['badge1'] ?? '',
        'badge2' => $_POST['badge2'] ?? '',
        'detailed_description' => $_POST['detailed_description'] ?? '',
        'whats_inside' => $_POST['whats_inside'] ?? '',
        'goes_with' => $_POST['goes_with'] ?? ''
    ];

    if (!file_exists('uploads')) mkdir('uploads');

    // Обработка загрузки фотографий
    for ($i = 1; $i <= 3; $i++) {
        $photoField = "photo{$i}";
        if (!empty($_FILES[$photoField]['name'])) {
            $ext = pathinfo($_FILES[$photoField]['name'], PATHINFO_EXTENSION);
            $filename = 'uploads/' . time() . "_box_{$i}." . $ext;
            if (move_uploaded_file($_FILES[$photoField]['tmp_name'], $filename)) {
                // Удаляем старое фото если было
                if (!empty($existingPhotos[$photoField]) && file_exists($existingPhotos[$photoField])) {
                    unlink($existingPhotos[$photoField]);
                }
                $data[$id][$photoField] = $filename;
            }
        }
    }

    // Отладка перед сохранением
    error_log("Data to save: " . print_r($data, true));
    
    $result = file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    error_log("File write result: " . ($result ? "SUCCESS" : "FAILED"));
    
    header("Location: boxes.php");
    exit;
}

if (isset($_GET['delete'])) {
    $id = $_GET['delete'];
    // Удаляем фотографии
    if (isset($data[$id])) {
        for ($i = 1; $i <= 3; $i++) {
            $photoField = "photo{$i}";
            if (!empty($data[$id][$photoField]) && file_exists($data[$id][$photoField])) {
                unlink($data[$id][$photoField]);
            }
        }
    }
    unset($data[$id]);
    file_put_contents($jsonFile, json_encode($data, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE));
    header("Location: boxes.php");
    exit;
}

// Получаем данные для редактирования
$editId = $_GET['edit'] ?? null;
$editData = $editId ? ($data[$editId] ?? null) : null;
?>

<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Управление боксами - Админка</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet">
    <style>
        body { font-family: 'Inter', sans-serif; }
        .dropzone { border: 2px dashed hsl(var(--border)); }
        .dropzone.dragover { border-color: hsl(var(--primary)); background: hsl(var(--secondary)); }
        
        :root {
            --background: 0 0% 100%;
            --foreground: 240 10% 3.9%;
            --card: 0 0% 100%;
            --card-foreground: 240 10% 3.9%;
            --popover: 0 0% 100%;
            --popover-foreground: 240 10% 3.9%;
            --primary: 222.2 47.4% 11.2%;
            --primary-foreground: 210 40% 98%;
            --secondary: 240 4.8% 95.9%;
            --secondary-foreground: 240 5.9% 10%;
            --muted: 240 4.8% 95.9%;
            --muted-foreground: 240 3.8% 46.1%;
            --accent: 240 4.8% 95.9%;
            --accent-foreground: 240 5.9% 10%;
            --destructive: 0 84.2% 60.2%;
            --destructive-foreground: 0 0% 98%;
            --border: 240 5.9% 90%;
            --input: 240 5.9% 90%;
            --ring: 240 5.9% 10%;
            --radius: 0.5rem;
        }

        .dark {
            --background: 240 10% 3.9%;
            --foreground: 0 0% 98%;
            --card: 240 10% 3.9%;
            --card-foreground: 0 0% 98%;
            --popover: 240 10% 3.9%;
            --popover-foreground: 0 0% 98%;
            --primary: 217.2 91.2% 59.8%;
            --primary-foreground: 222.2 47.4% 11.2%;
            --secondary: 240 3.7% 15.9%;
            --secondary-foreground: 0 0% 98%;
            --muted: 240 3.7% 15.9%;
            --muted-foreground: 240 5% 64.9%;
            --accent: 240 3.7% 15.9%;
            --accent-foreground: 0 0% 98%;
            --destructive: 0 62.8% 30.6%;
            --destructive-foreground: 0 0% 98%;
            --border: 240 3.7% 15.9%;
            --input: 240 3.7% 15.9%;
            --ring: 240 4.9% 83.9%;
        }
    </style>
    <script>
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        border: "hsl(var(--border))",
                        input: "hsl(var(--input))",
                        ring: "hsl(var(--ring))",
                        background: "hsl(var(--background))",
                        foreground: "hsl(var(--foreground))",
                        primary: "hsl(var(--primary))",
                        secondary: "hsl(var(--secondary))",
                        destructive: "hsl(var(--destructive))",
                        muted: "hsl(var(--muted))",
                    },
                    borderRadius: {
                        lg: "var(--radius)",
                        md: "calc(var(--radius) - 2px)",
                        sm: "calc(var(--radius) - 4px)",
                    },
                }
            }
        }
    </script>
</head>
<body class="min-h-screen bg-background text-foreground">
    <div class="flex min-h-screen">
        <!-- Мобильное меню -->
        <div id="mobile-menu" class="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 lg:hidden hidden">
            <div class="fixed inset-y-0 left-0 w-3/4 bg-card border-r border-border p-6">
                <div class="flex items-center justify-between mb-8">
                    <div class="flex items-center gap-2">
                        <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
                        </svg>
                        <h1 class="text-xl font-semibold">Админ-панель</h1>
                    </div>
                    <button id="close-menu" class="p-2 text-muted-foreground hover:text-foreground">
                        <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>
                </div>
                <nav class="space-y-2">
                    <a href="index.php" class="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-secondary text-muted-foreground hover:text-secondary-foreground">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                        </svg>
                        Мероприятия
                    </a>
                    <a href="boxes.php" class="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                        </svg>
                        Кейтеринг боксы
                    </a>
                    <a href="logout.php" class="flex items-center gap-2 px-4 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                        </svg>
                        Выйти
                    </a>
                </nav>
            </div>
        </div>

        <!-- Боковая панель (десктоп) -->
        <div class="hidden lg:block fixed inset-y-0 left-0 w-64 bg-card border-r border-border px-6 py-8">
            <div class="flex items-center justify-between mb-8">
                <div class="flex items-center gap-2">
                    <svg class="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16m-7 6h7"/>
                    </svg>
                    <h1 class="text-xl font-semibold">Админ-панель</h1>
                </div>
                <button id="theme-toggle" class="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <svg id="sun-icon" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <svg id="moon-icon" class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>
            </div>
            <nav class="space-y-2">
                <a href="index.php" class="flex items-center gap-2 px-4 py-2 text-sm rounded-lg hover:bg-secondary text-muted-foreground hover:text-secondary-foreground">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"/>
                    </svg>
                    Мероприятия
                </a>
                <a href="boxes.php" class="flex items-center gap-2 px-4 py-2 text-sm rounded-lg bg-secondary text-secondary-foreground">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    Кейтеринг боксы
                </a>
                <a href="logout.php" class="flex items-center gap-2 px-4 py-2 text-sm text-destructive rounded-lg hover:bg-destructive/10">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                    </svg>
                    Выйти
                </a>
            </nav>
        </div>

        <!-- Основной контент -->
        <div class="flex-1 lg:ml-64 p-4 lg:p-8">
            <!-- Мобильный хедер -->
            <div class="lg:hidden flex items-center justify-between mb-6">
                <button id="open-menu" class="p-2 -ml-2 text-muted-foreground hover:text-foreground">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>
                    </svg>
                </button>
                <button id="theme-toggle-mobile" class="p-2 rounded-lg bg-secondary text-secondary-foreground hover:bg-secondary/80">
                    <svg id="sun-icon-mobile" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                    <svg id="moon-icon-mobile" class="w-5 h-5 hidden" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                    </svg>
                </button>
            </div>

            <div class="max-w-5xl mx-auto">
                <!-- Форма добавления/редактирования бокса -->
                <div class="bg-card rounded-xl shadow-sm border border-border p-4 lg:p-6 mb-6">
                    <h2 class="text-lg font-semibold mb-6"><?= $editData ? 'Редактировать бокс' : 'Добавить новый бокс' ?></h2>
                    <form method="POST" enctype="multipart/form-data" class="space-y-6">
                        <?php if ($editData): ?>
                        <input type="hidden" name="id" value="<?= htmlspecialchars($editId) ?>">
                        <?php endif; ?>
                        
                        <!-- Основная информация -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Название бокса *</label>
                                <input name="name" required value="<?= htmlspecialchars($editData['name'] ?? '') ?>"
                                    class="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:border-ring">
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Цена *</label>
                                <input name="price" type="number" required value="<?= htmlspecialchars($editData['price'] ?? '') ?>"
                                    class="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:border-ring">
                            </div>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium">Краткое описание</label>
                            <textarea name="short_description" rows="3"
                                class="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:border-ring"><?= htmlspecialchars($editData['short_description'] ?? '') ?></textarea>
                        </div>

                        <!-- Фотографии -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <?php for ($i = 1; $i <= 3; $i++): ?>
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Фото <?= $i ?></label>
                                <?php if (!empty($editData["photo{$i}"])): ?>
                                <div class="relative">
                                    <img src="<?= htmlspecialchars($editData["photo{$i}"]) ?>" class="w-full h-32 object-cover rounded-md border">
                                    <button type="button" onclick="deletePhoto('<?= $editId ?>', 'photo<?= $i ?>')" 
                                        class="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1">
                                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
                                        </svg>
                                    </button>
                                </div>
                                <?php endif; ?>
                                <input type="file" name="photo<?= $i ?>" accept="image/*"
                                    class="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:border-ring">
                            </div>
                            <?php endfor; ?>
                        </div>

                        <!-- Бейджи -->
                        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Текст бейджа 1</label>
                                <input name="badge1" value="<?= htmlspecialchars($editData['badge1'] ?? '') ?>"
                                    class="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:border-ring">
                            </div>
                            <div class="space-y-2">
                                <label class="text-sm font-medium">Текст бейджа 2</label>
                                <input name="badge2" value="<?= htmlspecialchars($editData['badge2'] ?? '') ?>"
                                    class="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:border-ring">
                            </div>
                        </div>

                        <!-- Подробные описания -->
                        <div class="space-y-2">
                            <label class="text-sm font-medium">Подробное описание</label>
                            <textarea name="detailed_description" rows="4"
                                class="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:border-ring"><?= htmlspecialchars($editData['detailed_description'] ?? '') ?></textarea>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium">Что внутри</label>
                            <textarea name="whats_inside" rows="4"
                                class="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:border-ring"><?= htmlspecialchars($editData['whats_inside'] ?? '') ?></textarea>
                        </div>

                        <div class="space-y-2">
                            <label class="text-sm font-medium">С чем сочетается</label>
                            <textarea name="goes_with" rows="4"
                                class="w-full px-3 py-2 bg-background border border-input rounded-md shadow-sm focus:ring-2 focus:ring-ring focus:border-ring"><?= htmlspecialchars($editData['goes_with'] ?? '') ?></textarea>
                        </div>

                        <div class="flex justify-end gap-4">
                            <?php if ($editData): ?>
                            <a href="boxes.php" class="px-4 py-2 text-sm font-medium rounded-md border border-input bg-background hover:bg-secondary">
                                Отмена
                            </a>
                            <?php endif; ?>
                            <button type="submit"
                                class="px-4 py-2 text-sm font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-ring ring-offset-2 ring-offset-background"
                                style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border: none;">
                                <?= $editData ? 'Сохранить изменения' : 'Создать бокс' ?>
                            </button>
                        </div>
                    </form>
                </div>

                <!-- Список боксов -->
                <div class="bg-card rounded-xl shadow-sm border border-border p-4 lg:p-6">
                    <h2 class="text-lg font-semibold mb-6">Список кейтеринг боксов</h2>
                    <div class="space-y-4 lg:space-y-6">
                        <?php if (empty($data)): ?>
                        <div class="text-center py-12 text-muted-foreground">
                            <svg class="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                            </svg>
                            <p>Боксы еще не добавлены</p>
                        </div>
                        <?php else: ?>
                        <?php foreach ($data as $id => $item): ?>
                        <div class="flex flex-col lg:flex-row items-start gap-4 p-4 rounded-lg border border-border bg-background">
                            <div class="flex-shrink-0 w-full lg:w-auto">
                                <?php if (!empty($item['photo1'])): ?>
                                <img src="<?= htmlspecialchars($item['photo1']) ?>" class="w-full lg:w-32 h-48 lg:h-32 object-cover rounded-md">
                                <?php else: ?>
                                <div class="w-full lg:w-32 h-48 lg:h-32 bg-muted rounded-md flex items-center justify-center">
                                    <svg class="w-8 h-8 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                                    </svg>
                                </div>
                                <?php endif; ?>
                            </div>
                            <div class="flex-1 min-w-0 w-full">
                                <div class="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                    <div class="flex-1">
                                        <div class="flex items-start gap-4">
                                            <div class="flex-1">
                                                <h3 class="text-lg font-medium mb-1"><?= htmlspecialchars($item['name']) ?></h3>
                                                <p class="text-sm text-muted-foreground mb-2"><?= htmlspecialchars($item['short_description']) ?></p>
                                                <div class="flex flex-wrap gap-2 mb-3">
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary text-primary-foreground">
                                                        <?= htmlspecialchars($item['price']) ?> ₽
                                                    </span>
                                                    <?php if (!empty($item['badge1'])): ?>
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary text-secondary-foreground">
                                                        <?= htmlspecialchars($item['badge1']) ?>
                                                    </span>
                                                    <?php endif; ?>
                                                    <?php if (!empty($item['badge2'])): ?>
                                                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-accent text-accent-foreground">
                                                        <?= htmlspecialchars($item['badge2']) ?>
                                                    </span>
                                                    <?php endif; ?>
                                                </div>
                                            </div>
                                            <div class="flex items-center gap-2 flex-shrink-0">
                                                <a href="?edit=<?= $id ?>" 
                                                    class="inline-flex items-center p-2 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-md">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
                                                    </svg>
                                                </a>
                                                <a href="?delete=<?= $id ?>" onclick="return confirm('Удалить бокс?')"
                                                    class="inline-flex items-center p-2 text-destructive hover:bg-destructive/10 rounded-md">
                                                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" 
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                                                    </svg>
                                                </a>
                                            </div>
                                        </div>
                                        
                                        <!-- Дополнительные фотографии -->
                                        <?php 
                                        $additionalPhotos = array_filter([
                                            $item['photo2'] ?? '',
                                            $item['photo3'] ?? ''
                                        ]);
                                        if (!empty($additionalPhotos)): 
                                        ?>
                                        <div class="mt-4 flex gap-2 overflow-x-auto pb-2">
                                            <?php foreach ($additionalPhotos as $photo): ?>
                                            <img src="<?= htmlspecialchars($photo) ?>" class="h-16 w-16 object-cover rounded-md flex-shrink-0">
                                            <?php endforeach; ?>
                                        </div>
                                        <?php endif; ?>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <?php endforeach; ?>
                        <?php endif; ?>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script>
        // Theme switching functionality
        const themeToggle = document.getElementById('theme-toggle');
        const sunIcon = document.getElementById('sun-icon');
        const moonIcon = document.getElementById('moon-icon');

        // Check for saved theme preference, otherwise use system preference
        const theme = localStorage.getItem('theme') || 
            (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        
        // Apply the initial theme
        document.documentElement.classList.toggle('dark', theme === 'dark');
        updateIcons(theme === 'dark');

        // Listen for theme toggle clicks
        themeToggle.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcons(isDark);
        });

        // Update the visible icon
        function updateIcons(isDark) {
            sunIcon.classList.toggle('hidden', isDark);
            moonIcon.classList.toggle('hidden', !isDark);
        }

        // Listen for system theme changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
            if (!localStorage.getItem('theme')) {
                const isDark = e.matches;
                document.documentElement.classList.toggle('dark', isDark);
                updateIcons(isDark);
            }
        });

        // Mobile menu functionality
        const mobileMenu = document.getElementById('mobile-menu');
        const openMenuBtn = document.getElementById('open-menu');
        const closeMenuBtn = document.getElementById('close-menu');
        const themeToggleMobile = document.getElementById('theme-toggle-mobile');
        const sunIconMobile = document.getElementById('sun-icon-mobile');
        const moonIconMobile = document.getElementById('moon-icon-mobile');

        // Initialize mobile theme icons
        updateMobileIcons(theme === 'dark');

        function updateMobileIcons(isDark) {
            sunIconMobile.classList.toggle('hidden', isDark);
            moonIconMobile.classList.toggle('hidden', !isDark);
        }

        // Mobile theme toggle
        themeToggleMobile.addEventListener('click', () => {
            const isDark = document.documentElement.classList.toggle('dark');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            updateIcons(isDark);
            updateMobileIcons(isDark);
        });

        // Mobile menu toggle
        function toggleMobileMenu(show) {
            mobileMenu.classList.toggle('hidden', !show);
            document.body.style.overflow = show ? 'hidden' : '';
        }

        openMenuBtn.addEventListener('click', () => toggleMobileMenu(true));
        closeMenuBtn.addEventListener('click', () => toggleMobileMenu(false));
        mobileMenu.addEventListener('click', (e) => {
            if (e.target === mobileMenu) {
                toggleMobileMenu(false);
            }
        });

        // Delete photo function
        function deletePhoto(boxId, photoField) {
            if (confirm('Удалить фотографию?')) {
                fetch('boxes.php', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: `delete_photo=1&box_id=${boxId}&photo_field=${photoField}`
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        location.reload();
                    }
                });
            }
        }
    </script>
</body>
</html>

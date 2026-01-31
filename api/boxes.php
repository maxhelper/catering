<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$jsonFile = __DIR__ . '/admin/boxes.json';
if (!file_exists($jsonFile)) {
    echo json_encode(['error' => 'Data file not found']);
    exit;
}

$data = json_decode(file_get_contents($jsonFile), true);
if (!is_array($data)) {
    $data = [];
}

// Получить все боксы или конкретный бокс по ID
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    if (isset($data[$id])) {
        // Добавляем ID к объекту для удобства
        $box = $data[$id];
        $box['id'] = $id;
        
        // Преобразуем относительные пути в абсолютные URL
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/admin/';
        
        for ($i = 1; $i <= 3; $i++) {
            $photoField = "photo{$i}";
            if (!empty($box[$photoField])) {
                $box[$photoField] = $baseUrl . $box[$photoField];
            }
        }
        
        echo json_encode($box, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['error' => 'Box not found']);
    }
} else {
    // Возвращаем все боксы
    $boxes = [];
    $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/admin/';
    
    foreach ($data as $id => $box) {
        $box['id'] = $id;
        
        // Преобразуем относительные пути в абсолютные URL
        for ($i = 1; $i <= 3; $i++) {
            $photoField = "photo{$i}";
            if (!empty($box[$photoField])) {
                $box[$photoField] = $baseUrl . $box[$photoField];
            }
        }
        
        $boxes[] = $box;
    }
    
    echo json_encode($boxes, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>

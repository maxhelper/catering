<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

$jsonFile = __DIR__ . '/admin/events.json';
if (!file_exists($jsonFile)) {
    echo json_encode(['error' => 'Data file not found']);
    exit;
}

$data = json_decode(file_get_contents($jsonFile), true);
if (!is_array($data)) {
    $data = [];
}

// Получить все мероприятия или конкретное мероприятие по ID
if (isset($_GET['id'])) {
    $id = $_GET['id'];
    if (isset($data[$id])) {
        // Добавляем ID к объекту для удобства
        $event = $data[$id];
        $event['id'] = $id;
        
        // Преобразуем относительные пути в абсолютные URL
        $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/admin/';
        
        if (!empty($event['photos'])) {
            $event['photos'] = array_map(function($photo) use ($baseUrl) {
                return $baseUrl . $photo;
            }, $event['photos']);
        }
        
        echo json_encode($event, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
    } else {
        echo json_encode(['error' => 'Event not found']);
    }
} else {
    // Возвращаем все мероприятия
    $events = [];
    $baseUrl = (isset($_SERVER['HTTPS']) && $_SERVER['HTTPS'] === 'on' ? "https" : "http") . "://" . $_SERVER['HTTP_HOST'] . dirname($_SERVER['REQUEST_URI']) . '/admin/';
    
    foreach ($data as $id => $event) {
        $event['id'] = $id;
        
        // Преобразуем относительные пути в абсолютные URL
        if (!empty($event['photos'])) {
            $event['photos'] = array_map(function($photo) use ($baseUrl) {
                return $baseUrl . $photo;
            }, $event['photos']);
        }
        
        $events[] = $event;
    }
    
    echo json_encode($events, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE);
}
?>

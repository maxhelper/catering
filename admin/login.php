<?php
session_start();
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    if ($_POST['password'] === 'max') {
        $_SESSION['auth'] = true;
        header('Location: index.php');
        exit;
    }
    $error = "Неверный пароль";
}
?>
<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="UTF-8">
  <title>Вход</title>
  <style>
    :root {
      --background: 0 0% 100%;
      --foreground: 240 10% 3.9%;
      --primary: 222.2 47.4% 11.2%;
      --primary-foreground: 210 40% 98%;
    }

    .dark {
      --background: 240 10% 3.9%;
      --foreground: 0 0% 98%;
      --primary: 217.2 91.2% 59.8%;
      --primary-foreground: 222.2 47.4% 11.2%;
    }

    .btn-primary {
      background-color: hsl(var(--primary)) !important;
      color: hsl(var(--primary-foreground)) !important;
      border: none !important;
      transition: background-color 0.2s ease-in-out !important;
    }

    .btn-primary:hover {
      background-color: hsl(var(--primary) / 0.9) !important;
    }

    .btn-primary:focus {
      box-shadow: 0 0 0 2px hsl(var(--background)), 0 0 0 4px hsl(var(--primary)) !important;
      outline: none !important;
    }
  </style>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
</head>
<body class="bg-light d-flex align-items-center" style="height:100vh">
<div class="container text-center">
    <form method="POST" class="card p-4 mx-auto shadow-sm" style="max-width: 400px;">
        <h2 class="mb-3">Вход</h2>
        <input type="password" name="password" placeholder="Пароль" class="form-control mb-3" required>
        <button type="submit" class="btn btn-primary w-100">Войти</button>
        <?php if (isset($error)) echo "<p class='text-danger mt-2'>$error</p>"; ?>
    </form>
</div>
</body>
</html>

<?php
ob_start();

include 'config.php';
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
ob_clean();

if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if ($data === null) {
            throw new Exception('Invalid JSON data: ' . json_last_error_msg());
        }

        $user_id = $_SESSION['user_id'];
        $name = trim($data['name'] ?? '');
        if (empty($name)) {
            throw new Exception('Name is required');
        }

        $description = trim($data['description'] ?? '');
        $price = floatval($data['price'] ?? 0);
        if ($price < 0) {
            throw new Exception('Price cannot be negative');
        }

        $category = trim($data['category'] ?? '');
        if (empty($category)) {
            throw new Exception('Category is required');
        }

        $priority = trim($data['priority'] ?? 'Medium');
        $image_url = trim($data['image_url'] ?? '');
        $item_link = trim($data['item_link'] ?? '');

        $query = "INSERT INTO wishes (user_id, name, description, price, category, priority, image_url, item_link) 
                  VALUES (?, ?, ?, ?, ?, ?, ?, ?)";

        $stmt = $conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Database prepare error: " . $conn->error);
        }

        $stmt->bind_param("issdssss", $user_id, $name, $description, $price, $category, $priority, $image_url, $item_link);

        if (!$stmt->execute()) {
            throw new Exception("Database execution error: " . $stmt->error);
        }

        $wish_id = $conn->insert_id;
        ob_clean();

        echo json_encode([
            'success' => true,
            'message' => 'Wish added successfully',
            'id' => $wish_id
        ]);

        $stmt->close();
    } catch (Exception $e) {
        ob_clean();

        echo json_encode([
            'success' => false,
            'message' => $e->getMessage()
        ]);
    }
} else {
    echo json_encode([
        'success' => false,
        'message' => 'Invalid request method'
    ]);
}

$conn->close();
ob_end_flush();

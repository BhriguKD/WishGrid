<?php
ob_start();
include 'config.php';
session_start();
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];
if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    try {
        $json = file_get_contents('php://input');
        $data = json_decode($json, true);

        if ($data === null) {
            throw new Exception('Invalid JSON data: ' . json_last_error_msg());
        }
        $id = isset($data['id']) ? intval($data['id']) : 0;

        if (!$id) {
            throw new Exception('Wish ID is required');
        }
        $verify_query = "SELECT id FROM wishes WHERE id = ? AND user_id = ?";
        $verify_stmt = $conn->prepare($verify_query);
        if (!$verify_stmt) {
            throw new Exception('Database prepare error: ' . $conn->error);
        }

        $verify_stmt->bind_param("ii", $id, $user_id);
        $verify_stmt->execute();
        $verify_result = $verify_stmt->get_result();

        if ($verify_result->num_rows === 0) {
            throw new Exception('No wish found with ID: ' . $id);
        }
        $verify_stmt->close();
        $name = trim($data['name'] ?? '');
        if (empty($name)) {
            throw new Exception('Name is required');
        }

        $description = trim($data['description'] ?? '');
        $price = floatval($data['price'] ?? 0);
        $category = trim($data['category'] ?? '');
        $priority = trim($data['priority'] ?? 'Medium');
        $image_url = trim($data['image_url'] ?? '');
        $item_link = trim($data['item_link'] ?? '');
        $status = isset($data['status']) ? trim($data['status']) : null;
        $query = "UPDATE wishes SET name = ?, description = ?, price = ?, 
                  category = ?, priority = ?, image_url = ?, item_link = ?";
        $params = [$name, $description, $price, $category, $priority, $image_url, $item_link];
        $types = "ssdssss";
        if ($status !== null) {
            $query .= ", status = ?";
            $params[] = $status;
            $types .= "s";
        }
        $query .= " WHERE id = ? AND user_id = ?";
        $params[] = $id;
        $params[] = $user_id;
        $types .= "ii";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception('Database prepare error: ' . $conn->error);
        }

        $stmt->bind_param($types, ...$params);

        if (!$stmt->execute()) {
            throw new Exception('Database execution error: ' . $stmt->error);
        }

        if ($stmt->affected_rows === 0) {
            throw new Exception('No changes were made to the wish');
        }

        echo json_encode([
            'success' => true,
            'message' => 'Wish updated successfully',
            'affected_rows' => $stmt->affected_rows
        ]);

        $stmt->close();
    } catch (Exception $e) {
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

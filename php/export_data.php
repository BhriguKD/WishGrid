<?php
session_start();
include 'config.php';
if (!isset($_SESSION['user_id'])) {
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    $query = "SELECT name, description, price, category, priority, status, created_at 
              FROM wishes 
              WHERE user_id = ? 
              ORDER BY created_at DESC";

    $stmt = $conn->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $result = $stmt->get_result();

    header('Content-Type: text/csv');
    header('Content-Disposition: attachment; filename="wishgrid_export_' . date('Y-m-d') . '.csv"');
    $output = fopen('php://output', 'w');
    fputcsv($output, ['Name', 'Description', 'Price', 'Category', 'Priority', 'Status', 'Created At']);
    while ($row = $result->fetch_assoc()) {
        $row['price'] = number_format($row['price'], 2);
        $row['created_at'] = date('Y-m-d H:i:s', strtotime($row['created_at']));
        fputcsv($output, $row);
    }

    fclose($output);
    exit;
} catch (Exception $e) {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'Error exporting data: ' . $e->getMessage()
    ]);
}

<?php
include 'config.php';
session_start();
header('Content-Type: application/json');
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['error' => 'Not authenticated']);
    exit;
}

$user_id = $_SESSION['user_id'];

try {
    if (isset($_GET['id'])) {
        $wish_id = intval($_GET['id']);
        $query = "SELECT * FROM wishes WHERE id = ? AND user_id = ?";
        $stmt = $conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("ii", $wish_id, $user_id);
    } else {
        $status = isset($_GET['status']) ? $_GET['status'] : 'pending';
        $query = "SELECT * FROM wishes WHERE user_id = ? AND status = ? ORDER BY created_at DESC";
        $stmt = $conn->prepare($query);

        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("is", $user_id, $status);
    }

    $stmt->execute();
    $result = $stmt->get_result();
    $wishes = array();

    if ($result->num_rows > 0) {
        while ($row = $result->fetch_assoc()) {
            $wishes[] = $row;
        }
    }

    echo json_encode($wishes);
} catch (Exception $e) {
    echo json_encode(['error' => 'Database error: ' . $e->getMessage()]);
} finally {
    if (isset($stmt)) {
        $stmt->close();
    }
    $conn->close();
}

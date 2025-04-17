<?php
session_start();
include 'config.php';

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
  header('Content-Type: application/json');
  echo json_encode(['success' => false, 'message' => 'Not authenticated']);
  exit;
}

$user_id = $_SESSION['user_id'];

try {
  // Delete all wishes for the user
  $query = "DELETE FROM wishes WHERE user_id = ?";
  $stmt = $conn->prepare($query);
  $stmt->bind_param("i", $user_id);

  if ($stmt->execute()) {
    echo json_encode([
      'success' => true,
      'message' => 'All wishes deleted successfully'
    ]);
  } else {
    throw new Exception('Failed to delete wishes');
  }

  $stmt->close();
} catch (Exception $e) {
  header('Content-Type: application/json');
  echo json_encode([
    'success' => false,
    'message' => 'Error clearing data: ' . $e->getMessage()
  ]);
}

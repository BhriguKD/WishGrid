<?php
// Start session
session_start();

// Set proper JSON header
header('Content-Type: application/json');

// Check if user is logged in
if (!isset($_SESSION['user_id'])) {
    echo json_encode(['logged_in' => false]);
    exit;
}

// Return user data if logged in
echo json_encode([
    'logged_in' => true,
    'user_id' => $_SESSION['user_id'],
    'email' => $_SESSION['user_email'] ?? null,
    'username' => $_SESSION['username'] ?? null
]);
exit;

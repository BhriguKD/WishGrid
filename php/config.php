<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start();

$host = 'localhost';
$username = 'root'; // Default XAMPP username
$password = ''; // Default XAMPP password
$database = 'wishgrid_db';

try {
    $conn = new mysqli($host, $username, $password);
    if ($conn->connect_error) {
        throw new Exception("Connection failed: " . $conn->connect_error);
    }

    $sql = "CREATE DATABASE IF NOT EXISTS $database";
    if (!$conn->query($sql)) {
        throw new Exception("Error creating database: " . $conn->error);
    }
    if (!$conn->select_db($database)) {
        throw new Exception("Error selecting database: " . $conn->error);
    }
    if (!$conn->set_charset("utf8mb4")) {
        throw new Exception("Error setting charset: " . $conn->error);
    }
    ob_clean();
} catch (Exception $e) {
    error_log("Database Error: " . $e->getMessage());
    ob_clean();
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'message' => 'Database connection failed']);
    exit;
}
function handleDBError($error)
{
    error_log("Database Error: " . $error);
    return ['success' => false, 'message' => 'A database error occurred. Please try again later.'];
}

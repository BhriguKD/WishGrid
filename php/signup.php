<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
ob_start();

include 'config.php';
session_start();
header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $email = filter_input(INPUT_POST, 'email', FILTER_SANITIZE_EMAIL);
    $username = filter_input(INPUT_POST, 'username', FILTER_SANITIZE_STRING);
    $password = $_POST['password'];

    if (empty($email) || empty($password) || empty($username)) {
        echo json_encode(['success' => false, 'message' => 'Please fill all fields']);
        exit;
    }

    try {
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);

        $stmt = $conn->prepare("INSERT INTO users (email, username, password) VALUES (?, ?, ?)");
        $stmt->bind_param("sss", $email, $username, $hashed_password);

        if ($stmt->execute()) {
            $user_id = $conn->insert_id;
            $_SESSION['user_id'] = $user_id;
            $_SESSION['user_email'] = $email;
            $_SESSION['username'] = $username;

            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Registration failed']);
        }
    } catch (mysqli_sql_exception $e) {
        if ($e->getCode() === 1062) {
            if (strpos($e->getMessage(), 'email') !== false) {
                echo json_encode(['success' => false, 'message' => 'Email already exists']);
            } else if (strpos($e->getMessage(), 'username') !== false) {
                echo json_encode(['success' => false, 'message' => 'Username already exists']);
            } else {
                echo json_encode(['success' => false, 'message' => 'Database error occurred']);
            }
        } else {
            echo json_encode(['success' => false, 'message' => 'Database error occurred']);
        }
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request method']);
}
ob_end_clean();
exit;

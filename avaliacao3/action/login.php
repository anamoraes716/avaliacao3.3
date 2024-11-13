<?php 
include('../db/conexao.php');
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST['email'];
    $senha = md5($_POST['senha']);

    $sql = "SELECT id FROM usuarios WHERE email = '$email' AND senha = '$senha'";
    $result = $conn->query($sql);

    if ($result->num_rows > 0) {
        $_SESSION['usuario_id'] = $result->fetch_assoc()['id'];
        header("Location: ../views/dashboard.php");
    } else {
        echo "Email ou senha incorretos.";

    }
}
?>
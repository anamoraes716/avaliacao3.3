<?php 
include('../db/conexao.php');
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $nome = $_POST['nome'];
    $email = $_POST['email'];
    $senha = $_POST['senha'];
    $senha_hashed = md5($senha);


    $sql = "INSERT INTO usuarios (nome, email, senha) VALUES ('$nome', '$email', '$senha_hashed')";

    if ($conn->query($sql) === TRUE) {
        header("Location: ../views/login.html");
    } else {
        echo "Email ao cadastrar usuário: " . $conn->error;

    }
}
?>
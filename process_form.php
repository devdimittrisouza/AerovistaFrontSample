<?php
// Habilitar a exibição de erros para debug
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// credenciais da Database
$servername = "devweb3sql.mysql.dbaas.com.br"; //substitua pelo seu host
$username = "devweb3sql"; //substitua pelo seu username
$password = "h2023_FaTEC#$"; //substitua pela sua senha
$dbname = "devweb3sql"; //substitua pelo nome do seu db

// criar conexao
$conn = new mysqli($servername, $username, $password, $dbname);

// checar conexao
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// pegar dados do forms do site
$nome = $_POST['inputName'];
$senha = sha1($_POST['inputPassword4']);
$email = $_POST['inputEmail4'];
$celular = $_POST['inputCel'];
$cpf = $_POST['inputCPF'];

// fazer a query no banco
$sql = "INSERT INTO Cadastro (Nome, Email, Cpf, Senha, Celular) VALUES ('$nome', '$email', '$cpf', '$senha', '$celular')";

if ($conn->query($sql) === TRUE) {
    // Iniciar a sessão e salvar dados na sessão
    session_start();
    $_SESSION['user_email'] = $email;
    $_SESSION['user_celular'] = $celular;

    echo '<script>alert("Cadastro Realizado!"); window.location.href="logado.html";</script>';
} else {
 // mensagem de erro
    echo "Error: " . $sql . "<br>" . $conn->error;
}

$conn->close();
?>

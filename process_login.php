<?php
// Habilitar a exibição de erros
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
$email = $_POST['inputEmail4'];
$senha = sha1($_POST['inputPassword4']);

// fazer a query no banco usando prepared statements para segurança
$stmt = $conn->prepare("SELECT id, Email, Celular FROM Cadastro WHERE Email = ? AND Senha = ?");
$stmt->bind_param("ss", $email, $senha);
$stmt->execute();

// Vincular as variáveis de resultado
$stmt->bind_result($userId, $userEmail, $userCelular);

// Verificar se há resultados
if ($stmt->fetch()) {
    // login com sucesso
    session_start(); //inicia sessao
    $_SESSION['user_id'] = $userId; // passa id para variavel de sessao
    $_SESSION['user_email'] = $userEmail; //passa email para variavel de sessao
    $_SESSION['user_celular'] = $userCelular; //passa cel para variavel de sessao

    header('Location: logado.html'); // redireciona para area logada
    exit;
} else {
    // mensagem login invalido
     echo '<script>alert("Email ou senha errados"); window.location.href="login.html";</script>';
}

$stmt->close();
$conn->close();
?>

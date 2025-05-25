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

session_start();

if (isset($_SESSION['user_email']) && isset($_SESSION['user_celular'])) { //vai pegar as variaveis da sessao
    $email = $_SESSION['user_email'];
    $celular = $_SESSION['user_celular'];


    // pegar dados do forms do site
    $evento = $_POST['inputEvento'];
    $dataInicio = $_POST['DataInicio'];
    $dataFim = $_POST['DataFim'];
    $detalhes = $_POST['detalhes'];

    // fazer a query no banco usando prepared statements
    $stmt = $conn->prepare("INSERT INTO Orcamento (Email, Celular, TipoEvento, DataInicio, DataFim, Detalhes) VALUES (?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssss", $email, $celular, $evento, $dataInicio, $dataFim, $detalhes);

    if ($stmt->execute()) {
    echo '<script>alert("Orcamento enviado com sucesso! Entraremos em contato em breve."); window.location.href="index.html";</script>';
    } else {
        echo "Error: " . $stmt->error;
    }

    $stmt->close();
} else {
    echo "Erro: dados de sessão não encontrados.";
}

$conn->close();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>HELLO</h1>
</body>
</html>
<?php
$servername="localhost";
$username="root";
$password="";
$database="movie";
// if($_SERVER["REQUEST_METHOD"]=="POST"){
// $email=$_POST['email'];
// $movie=$_POST['name'];
// }
$email=$_POST['email'];
$movie=$_POST['name'];

$conn=mysqli_connect($servername,$username,$password,$database);

if($conn)
{
   
    echo "succesfull created data base";
}
else{
    echo "not created";
}
$sql="INSERT INTO `ticket2` (`moviename`, `price`, `seats`, `email`, `date`) VALUES ('$movie', '220', '1', '$email', '2023-01-10')";
$result=mysqli_query($conn,$sql);
$sql="SELECT * FROM `ticket2`";//it sorts with the name
$result=mysqli_query($conn,$sql);
$t=mysqli_fetch_assoc($result);
$to_email=$email;
$subject="Ticketname";
$body="MovieName :".$movie." \n Email : ".$email."\n Prices".$t['price']."\n Seats ".$t['seats'];
echo "<br>MovieName :".$movie;
echo " <br> Email : ".$email;
echo "<br> Prices".$t['price'];
echo "<br> Seats ".$t['seats'];
$headers="From: nakkasaikrishna35@gmail.com";
if(mail($to_email,$subject,$body,$headers))
{
    echo "Email has sended succeessfully";
}
else{
    echo "no";
}
?>

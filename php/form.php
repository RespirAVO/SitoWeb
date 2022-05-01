<?php
$name = $_POST['name'];
$visitor_email = $_POST['email'];
$subject = $_POST['subject'];
$message = $_POST['message'];

$email_from = 'info@respiravo.com';

$email_subject = 'Nuova email da RespirAVO'

$email_body = "User name: $name.\n".
              "User email: $visitor_email.\n".
              "Subject: $subject.\n".
              "User message: $message.\n";

$to = 'Respir.avo@gmail.com';

$headers = "From: $email_from \r\n"

$header .= "Reply-To: $visitor_email \r\n";

mail($to,$email_subject,$email_body,$headers);

header("Location: contacts.html");

?>
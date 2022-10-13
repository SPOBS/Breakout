<?php
// TODO add high scores and save them to the score board
$json = file_get_contents("../json/scoreboard.json");
$scoreboard = json_decode($json);
$response = new stdClass();
$response->code = "error";

if(!array_key_exists('name', $_GET)){
    $response->message = "Invalid name";
    exit (json_encode($response)); 
} else {
    $name = $_GET['name'];
    if(strlen($name) < 3 || strlen($name) > 6){
        $response->message = "Invalid name";
        exit (json_encode($response)); 
    }
}

if(!array_key_exists('score', $_GET)){
    $response->message = "Invalid score";
    exit (json_encode($response));  
} else {
    $score = $_GET['score'];
    if($score <= 0){
        $response->message = "Invalid score";
        exit (json_encode($response)); 
    }
}


if($json == null){
    $response->message = "Scoreboard not found";
    exit (json_encode($response));
} else {
    $response->code = "success";
    // sort from highest to lowest
    $response->message = "Score added to scoreboard";
    exit (json_encode($response));
}


?>
<?php
// TODO retreive the top high scores and display on screen
$json = file_get_contents("../json/scoreboard.json");
$scoreboard = json_decode($json);
$response = new stdClass();
$response->code = "error";

if($json == null){
    $response->message = "Scoreboard not found";
    exit (json_encode($response));
} else {
    $response->code = "success";
    // sort from highest to lowest
    usort($scoreboard, 'sortScores');
    $response->scoreboard = $scoreboard;
    exit (json_encode($response));
}


function sortScores($score1, $score2){
    return $score1->score < $score2->score;
}

?>
// the jquery to hide and then show the results of the visualization
// and leaderboard for the tweet we're searching 
$(function () {
  $('#showToSearch_form').on('submit', function () {
    $.post("/searchTweets", $('#showToSearch_form').serialize());
    $('#d3_visualization').show();
    $('#leaderboard').show();
    return false;
  })
 })
// the jquery to hide and then show the results of the visualization
// and leaderboard for the tweet we're searching 
 $(function () {
  $('#showToSearch_form').on('submit', function () {
    $.post("/searchTweets", $('#showToSearch_form').serialize(), function(html, flag, xhr){
    	console.log("THe HTML IS: ", html);
    	$("#results_row").html(html);
    	$('#d3_visualization').show();
    	$('#leaderboard').show();
    });
    //$('#d3_visualization').show();
    //$('#leaderboard').show();
    return false;
  })
 })
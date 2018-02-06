// console.log('yo')

$.getJSON("/articles", (data) => {
  for (let i = 0; i < data.length; i++) {
    $("#articleHere").prepend(`<p id="article" data-id=${data[i]._id}> ${data[i].title} <br/> <a href=${data[i].link}>${data[i].link}</a> </p>
    <hr>`);
  }
});

$(document).on("click", "#article", function () {
  $("#commentHere").empty();
  var thisId = $(this).attr("data-id")
  console.log(thisId);
  $.ajax({
      method: "GET",
      url: `/articles/${thisId}`
    })
    .then((data) => {
      console.log(data);
      $("#commentHere").append(`<h2>${data.title}</h2>`);
      $("#commentHere").append("<input id='username' name='username' placeholder='Your name...' >");
      $("#commentHere").append("<textarea id='commentBody' name='body' placeholder='Your comment...' ></textarea>");
      $("#commentHere").append(`<button data-id='${data._id}' id='postComment'> Save Comment </button>`);

      if (data.Comment) {
        $("#username").val(data.comment.name);
        $("#commentBody").val(data.comment.body);
        console.log('if' + data.comment.name)
      }
    })
});
$(document).on('click', '#postComment', function(){
  var username = $('#username').val()
  var comment = $('#commentBody').val()
  var articleId = $('#postComment').attr('data-id')
  var userComment = {
    username,
    comment
  }
  console.log(userComment);
  console.log(articleId);
  $.post(`/comments/${articleId}`, userComment).then(
    
  )

})
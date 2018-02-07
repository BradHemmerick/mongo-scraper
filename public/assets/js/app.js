// console.log('yo')

if (location.pathname === "/saved") {

  $.getJSON("/articles?saved=true", (data) => {
    if (data.length === 0) {
      return $("#savedArticlesHere").text("You have no saved articles. Visit the home page to save articles.")
    }
    for (let i = 0; i < data.length; i++) {
      $("#savedArticlesHere").prepend(`<p class="article" data-id=${data[i]._id}> ${data[i].title} <br/> <a href=${data[i].link}>${data[i].link}</a> <br> <button class='saveBtn'> Save${data[i].saved ? "d" : ""} </button> </p>
      <hr>`);
    }
  });
} else {

  $.getJSON("/articles", (data) => {
    for (let i = 0; i < data.length; i++) {
      $("#articleHere").prepend(`<p class="article" data-id=${data[i]._id}> ${data[i].title} <br/> <a href=${data[i].link}>${data[i].link}</a> <br> <button class='saveBtn'> Save${data[i].saved ? "d" : ""} </button> </p>
      <hr>`);
    }
  });
}


$(document).on("click", ".article", function () {
  // Remove the selected class
  $(".article").removeClass("selected")
  // Select the currenct (clicked) article
  $(this).addClass("selected")

  $("#commentHere").empty();
  var thisId = $(this).attr("data-id")
  console.log(thisId);
  $.ajax({
      method: "GET",
      url: `/articles/${thisId}`
    })
    .then( function(data) {
      console.log(data);
      $("#commentHere").append(`<h2>${data.title}</h2>`);
      $("#commentHere").append("<input id='username' name='username' placeholder='Your name...' >");
      $("#commentHere").append("<textarea id='commentBody' name='body' placeholder='Your comment...' ></textarea>");
      $("#commentHere").append(`<button data-id='${data._id}' id='postComment'> Save Comment </button>`);
      $("#commentHere").append(`<hr/>`);
      $("#commentHere").append(data.comment.reverse().map(function (currentComment) {
          var $comment = $("<div class='comment-item'>")
          $comment.append([
            $("<strong>", { text: currentComment.username }),
            $("<p>", { text: currentComment.comment }),
            $('<button class=delete> Delete </button>')
          ])
          return $comment;
      }))
    })
});

$(document).on('click', '.delete', function() {
  
})

$(document).on('click', '#postComment', function(){
  var username = $('#username').val()
  var comment = $('#commentBody').val()
  var articleId = $('#postComment').attr('data-id')
  var userComment = {
    username,
    comment
  }
  console.log(userComment);
  // console.log(articleId);
  $.post(`/comments/${articleId}`, userComment).then(function () {
    $(".article.selected").click()
  })

})

 $(document).on('click', '.saveBtn', function() {
  var articleId = $(this).closest("[data-id]").data('id')
  var $btn = $(this)
  $.post(`/articles/${articleId}/toggle-save`).then(function () {
    $btn.text($btn.text().trim() === "Save" ? "Saved" : "Save")
  })
  return false;
 })


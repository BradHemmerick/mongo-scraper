// console.log('yo')

$.getJSON("/articles", (data) => {
  for (let i = 0; i < data.length; i++) {
    $("#articleHere").prepend(`<p data-id=${data[i]._id}> ${data[i].title} <br/> <a href=${data[i].link}>${data[i].link}</a> </p>`);
  }
});

$(document).on("click", "p", () => {
  $("#commentHere").empty();
  var thisId = $(this).attr("data-id");
  $.ajax({
      method: "GET",
      url: `/articles/${thisId}`
    })
    .then((data) => {
      // console.log(data);
      $("#commentHere").append(`<h2>${data.title}</h2>`);
      $("#commentHere").append("<input id='username' name='username' >");
      $("#commentHere").append("<textarea id='commentBody' name='body'></textarea>");
      $("#commentHere").append(`<button data-id='${data._id}' id='savenote'> Save Comment </button>`);
    });
});
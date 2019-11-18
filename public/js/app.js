  $.when(
    $.ajax("/scrape"),
    )
    .done(function(){
      $.getJSON("/articles", function(data) {
        for (var i = 0; i < data.length; i++) {
          $("#articles").append("<h2 data-id='" + data[i]._id + "'>" + data[i].headline + 
          "</h2><br />" + "<p><a href='"+ data[i].link +"'>" + "External Link" + "</a>" + "<br />" + "Summary: " 
          +  data[i].summary + "</p><p class='notes' data-id='" + data[i]._id + "'>Notes (Click to view)</p>");
        }
      })
    })
    .fail(function(){
        console.log("oops")
    });

    $(document).on("click", ".notes", function() {
      
      var thisId = $(this).attr("data-id");

    $(".modal-body2").append('<button type="button" class="btn btn-secondary submitNote" data-id="' + thisId + '">Add Note</button>');
      $.ajax({
        method: "GET",
        url: "/articles/" + thisId
      })

        .then(function(data) {
          for (var i = 0; i < data.length; i++) {
            $("#notes").append("<li>" + data[i].body + "</li>");
            
          }
          $("#results").modal("toggle");


        });
    });

    $(document).on("click", ".submitNote", function() {
      var thisId = $(this).attr("data-id");
      $.ajax({
        method: "POST",
        url: "/articles/" + thisId,
        data: {
          headlineId: thisId,
          body: $("#noteinput").val(),

        }
      })
        .then(function(data) {
      
          $("#notes").append("<li>" + data.body + "</li>");
       
        
        });
    
      $("#noteinput").val("");
    });

    $(document).on("click", ".closeBtn", function() {
      $("#notes").empty();
      $(".submitNote").remove();
    });


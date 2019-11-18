var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app) {
  app.get("/scrape", function(req, res) {

    axios.get("https://sonicstate.com/synth/").then(function(response) {
      var $ = cheerio.load(response.data);
      $(".item").each(function(i, element) {
        var result = {};
        result.headline = $(this)
        .children('div:nth-child(2)')
        .children("h3")
          .children("a")
          .text();
        result.link = "https://sonicstate.com" + 
        $(this)
        .children('div:nth-child(2)')
        .children("h3")
          .children("a")
          .attr("href");
        result.summary = $(this)
        .children('div:nth-child(2)')
        .text();

        db.Article.create(result)
          .then(function(dbArticle) {
            console.log(dbArticle);
          })
          .catch(function(err) {
            console.log(err);
          });
      });

      res.send("Scrape Complete");
    });
  });


  app.get("/articles", function(req, res) {

    db.Article.find({})
      .then(function(dbArticle) {
        
        res.json(dbArticle);
      })
      .catch(function(err) {

        res.json(err);
      });

  });
  
  app.post("/articles/:id", function(req, res) {

    db.Note.create(req.body)

      .then(function(dbArticle) {

        res.json(dbArticle);
      })
      .catch(function(err) {

        res.json(err);
      });
  });
  
  app.get("/articles/:id", function(req, res) {

    db.Note.find({ headlineId: req.params.id })
     .populate("note")
      .then(function(dbArticle) {
        console.log(dbArticle);
      })
      .catch(function(err) {
        res.json(err);
      });
  });



};
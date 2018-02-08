const mongoose = require('mongoose')
const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const cheerio = require('cheerio')
const request = require('request')

const db = mongoose.connection

mongoose.Promise = Promise;

var uristring = process.env.MONGOLAB_URI || process.env.MONGOHQ_URL || 'mongodb://localhost/mongo-scrape';

mongoose.connect(uristring)

db.on('err', (err) => {
	console.log(`Failed to connect due to error message: ${err}`)
})

var app = express();

var PORT = process.env.PORT || 3000

//serve static pages
app.use(express.static("public"));

app.use(bodyParser.urlencoded({
	extended: false
}));
//set view engine
app.engine("handlebars", exphbs({
	defaultLayout: "main"
}));
app.set("view engine", "handlebars");

app.get('/', (req, res) => {
	res.render('index')
})

const Article = require('./models/Article')
const Comment = require('./models/Comment')

app.get('/scrape', (req, res) => {
	request('https://www.reddit.com/r/Broadway/', (error, response, html) => {
		var $ = cheerio.load(html);
		$('p.title').each((i, element) => {

			var result = {};

			result.title = $(element).children().text();
			result.link = $(element).children().attr('href');
			var scrapedInfro = new Article(result);

			scrapedInfro.save((err, result) => {
				if (err) {
					console.log(err);
				} else {
					console.log(result);
				}
			});


		});
	});
	console.log("Scrape Complete");
	res.redirect("/");
})

app.get('/saved', (req,res) => {
	res.render('saved')
})

app.get('/articles', (req, res) => {
	var query = {}

	if (req.query.saved) {
		query.saved = true
	}
	
	Article.find(query, (err, result) => {
		if (err) {
			console.log(err);
		} else {
			res.json(result);
		}
	});
});

app.get("/articles/:id", (req, res) => {
	// console.log(req.params.id, "this is our param id");
	Article.findOne({
			_id: req.params.id
		})
		.populate("comment")
		.then((Article) => {
			// console.log(Article, 'this is our article data')
			res.json(Article);
		})
		.catch((err) => {
			res.json(err);
		});
});

app.post("/comments/:id", (req, res) => {
	var newComment = new Comment(req.body);
	// console.log(req.params.id, "this is our param id");
	newComment.save((error, comment) => {
		if (error) {
			console.log(error);
		} else {
			console.log(`Comment ${comment}`);
			Article.findOneAndUpdate({
				"_id": req.params.id
			}, {
				$push: {
					"comment": comment._id
				}
			}, {
				new: true
			}, (err, comment) => {
				if (err) {
					console.log(err);
				} else {
					res.render(`index`);
				}
			});
		}
	});
});
app.post("/articles/:id/toggle-save", (req, res, next) => {
	Article.findOne({
		"_id": req.params.id
	}, (err, article) => {
		if (err) { return next(err) }
		article.set("saved", !article.get("saved"))

		article.save((err) => {
			if (err) { return next(err) }
			res.json({ succes: true })
		})
	})
})
app.get("/comments/:id", (req, res) => {
	console.log("This is the req.params: " + req.params.id);
	Article.find({
			"_id": req.params.id
		}).populate("comments")
		.exec((error, comment) => {
			if (error) {
				console.log(error);
			} else {
				var commentObj = {
					Article: comment
				}
				res.send(comment)
				console.log(commentObj);
				res.render("index", commentObj);
			}
		});
});

db.once('open', () => {
	console.log('connected with mongoose')
	app.listen(PORT, () => {
		console.log(`Server up at ${PORT}`)
	})
})
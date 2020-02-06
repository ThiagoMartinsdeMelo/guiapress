const express = require("express");
const router = express.Router();
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify = require("slugify");
const adminAuth = require("../middleware/adminAuth");

router.get("/admin/articles", adminAuth, (req, res) => {
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles: articles});
    });
    //res.render("admin/articles/index");
});

router.get("/admin/articles/new", adminAuth, (req, res) => {
    Category.findAll({order: [['title', 'ASC']], attributes: ['id', 'title'], raw: true}).then(categories => {
        res.render("admin/articles/new", {categories: categories});
    });
});

router.post("/articles/save", adminAuth, (req, res) => {
    var  title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    Article.create({
        title: title,
        slug: slugify(title).toLowerCase(),
        body: body,
        categoryId: category
    }).then(() => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/delete", adminAuth, (req, res) => {
    var id = req.body.id;
    if (id != undefined) {
        if (!isNaN(id)) {
            Article.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/articles");
            });
        } else { // Se id não for número
            res.redirect("/admin/articles");
        }
    } else { // se for null
        res.redirect("/admin/articles");
    }
});

router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var  id = req.params.id;
    if (isNaN(id)) { // se não for um número redirec
        res.redirect("/admin/articles");  
    }
    Article.findByPk(id).then(article => {
        if (article != undefined) {

            Category.findAll().then(categories => {
                res.render("admin/articles/edit", {article: article, categories: categories});
            });

            
        } else {
            res.redirect("/admin/articles");   
        }
    }).catch(erro => {
        res.redirect("/admin/articles");
    });
});

router.post("/articles/update", adminAuth, (req, res) => {
    var id = req.body.id;
    var  title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    Article.update({
        title: title,
        slug: slugify(title).toLowerCase(),
        body: body,
        categoryId: category
    }, {
        where: {
            id: id
        }
    }
    ).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");
    });
});

router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;
    if (isNaN(page) || page == 1) {
        offset = 0;
    } else {
        offset = (parseInt(page) - 1) * 4;
    }
    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']
        ]
    }).then(articles => {
        if (offset + 4 >= articles.count) {
            next = false;
        } else {
            next = true;
        }
        var result = {
            page: parseInt(page),
            next: next,
            articles: articles
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page", {result: result, categories: categories});
        });

        //res.json(result);
    });
});

module.exports = router;
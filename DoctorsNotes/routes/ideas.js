const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//Load Idea Model
require('../models/Idea');
const Idea = mongoose.model('ideas');

//Idea Index  Page
router.get('/',(req,res)=>{
  var today = new Date();
var dd = today.getDate();
var mm = today.getMonth() + 1; //January is 0!
var yyyy = today.getFullYear();

if (dd < 10) {
  dd = '0' + dd;
}

if (mm < 10) {
  mm = '0' + mm;
}

today = mm + '/' + dd + '/' + yyyy;
  Idea.find({}).sort({date:'desc'}).then(ideas=>{
    res.render('ideas/index',{
      ideas:ideas,
      date:today
      
    });
  });
});
//Add Idea Route
router.get('/add',(req,res)=>{
  const title = 'Ideas'
  res.render('ideas/add')
})

//Edit Idea Route
router.get('/edit/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    res.render('/edit', {
      idea:idea
    });
  });
});

//Edit form process

router.put('/:id', (req, res) => {
  Idea.findOne({
    _id: req.params.id
  })
  .then(idea => {
    // new values
    idea.title = req.body.title;
    idea.details = req.body.details;

    idea.save()
      .then(idea => {
        res.redirect('/ideas');
      })
  });
});

//Process Form + Server Side Validation
router.post('/',(req,res)=>{
  let errors = [];

  if(!req.body.title){
    errors.push({text:'Please add a title'});
  }
  if(!req.body.details){
    errors.push({text:'Please add some details'});
  }

  if(errors.length > 0){
    res.render('ideas/add', {
      errors: errors,
      title: req.body.title,
      details: req.body.details
    });
  } else {
    const newUser = {title:req.body.title,details:req.body.details}
    new Idea(newUser).save().then(idea =>{
      req.flash('success_msg','You have added another entry to your repository');

      res.redirect('/ideas');
    })
  }
});
//Delete idea


router.delete('/:id',(req,res)=>{
  Idea.remove({_id: req.params.id})
    .then(()=>{
      req.flash('success_msg','Entry Deleted')
      res.redirect('/ideas');
    });
});


module.exports = router
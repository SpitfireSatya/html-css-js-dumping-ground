//new comment

/*
	Digitude_event.findById(req.body.eventID, function(err, digitude_event){
		if(err)
		{
			console.log(err.stack);
		}
		if(digitude_event)
		{
			var commentnew = new Comment({
				value : req.body.value,
				date : new Date(),
				comment_creator : req.user._id,
				comment_event : req.body.eventID
			});
			commentnew.save(function(err){
				if(err)
				{
					console.log(err)
				}
			});
			digitude_event.comment_count++;
			digitude_event.save(function(err){
				if(err)
				{
					console.log(err)
				}
				res.redirect('/events/show?eventID='+req.body.eventID);
			});
		}

	});
*/



// update comment

/*
	Comment.findOne({_id : req.body.commentID}, function(err, comment){
		if(err)
		{
			console.log(err.stack);
		}
		if(comment)
		{
			if(req.user._id.equals(comment.comment_creator.toString()))
			{
				comment.value = req.body.value;
				comment.save(function(err){
					if(err)
					{
						console.log(err.stack);
					}
					res.redirect('/events/show?eventID='+req.body.eventID);
				});
			}
			else
			{
				res.redirect('/events/show?eventID='+req.body.eventID);
			}
		}
		else
		{
			res.redirect('/events/show?eventID='+req.body.eventID);
		}
	});
*/



//Delete comment

/*
	Comment.findOne({_id : req.body.commentID}, function(err, comment){
		if(err)
		{
			console.log(err.stack);
		}
		if(comment)
		{
			Digitude_event.findById(comment.comment_event, function(err, digitude_event){
			if(err)
			{
				console.log(err.stack);
			}
			if(digitude_event)
			{
				if(req.user._id.equals(comment.comment_creator.toString()))
				{
					Comment.remove({_id : req.body.commentID}, function(err){
						if(err)
						{
							console.log(err);
						}
			
						digitude_event.comment_count--;
						digitude_event.save(function(err){
							if(err)
							{
								console.log(err)
							}
							res.redirect('/events/show?eventID='+comment.comment_event.toString());
						});
					});
				}
				else
				{
					res.redirect('/events/show?eventID='+comment.comment_event.toString());				
				}
			}
			else
			{
				res.redirect('/events/show?eventID='+comment.comment_event.toString());
			}
			});
		}
	});
*/



//Contact US

/*
	var contactnew = new Contact({
		name : req.body.name,
		email : req.body.email,
		subject : req.body.subject,
		description : req.body.description
	});

	contactnew.save(function(err){
		if(err)
		{
			console.log(err.stack);
		}
		res.send('saved');
	});
*/


//All comments and likes for events

/*
	Digitude_event.findById(req.query.eventID, function(err,digitude_event){
		if(err)
		{
			console.log(err);
		}
		if(digitude_event)
		{
			data.push(digitude_event);
		}

		var query = Like.find({});
		query.and([{liked_event : req.query.eventID}, {value : "true"}]).exec(function(err,likes){
			if(err)
			{
				console.log(err);
			}
			if(likes)
			{
				likes.forEach(function(like){
					data.push(like);
				});
			}
		

			Comment.find({comment_event : req.query.eventID}, function(err,comments){
				if(err)
				{
					console.log(err);
				}
				if(comments)
				{
					comments.forEach(function(comment){
						data.push(comment);
					});
					res.send(data);
				}
				data  = [];
			});
		});
	});
*/



//Show all events

/*
	Digitude_event.find({}, function(err, digitude_events){
		if(err)
		{
			console.log(err.stack);
		}
		if(digitude_events)
		{
			digitude_events.forEach(function(digitude_event){
				data.push(digitude_event);
			});
			res.send(data);
		}
		data = [];
	});
*/



//Update Likes

/*
	Digitude_event.findById(req.body.eventID, function(err, digitude_event){
		if(err)
		{
			console.log(err.stack);
		}
		if(digitude_event)
		{
			var query = Like.findOne({});
			query.and([{like_creator : req.user._id}, {liked_event : req.body.eventID}]).exec(function(err, like){
				if(err)
				{
					console.log(err.stack);
				}
				if(like)
				{
					like.value = !(like.value);
	
					if(like.value.toString() == "true")
					{
						digitude_event.like_count++; 
					}
					if(like.value.toString() == "false")
					{
						digitude_event.like_count--;
					}
					like.save(function(err){
						if(err)
						{
							console.log(err.stack);
						}
					});

					digitude_event.save(function(err){
						if(err)
						{
							console.log(err)
						}
					});
				}
				else
				{
					var likenew = new Like({
						value : true,
						like_creator : req.user._id,
						liked_event : req.body.eventID
					});
					likenew.save(function(err){
						if(err)
						{
							console.log(err.stack);
						}
					});
					digitude_event.like_count++;
					digitude_event.save(function(err){
						if(err)
						{
							console.log(err)
						}
					});
				}
				res.redirect('/events/show?eventID='+req.body.eventID);
			});
		}	
	});
*/
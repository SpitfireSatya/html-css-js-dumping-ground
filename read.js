var jsonfile = require('jsonfile');

var file = 'output.json';
jsonfile.readFile(file, function(err, obj) {
	if(err)
	{
		console.log(err)
	}
	else
	{
  		console.dir(obj)
  	}
})
var fs = require('fs');

//data that came from the user someway or another
var json = {
  image: {
    src: "Images/Sun.png",
    name: "sun1",
    hOffset: 250,
    vOffset: 250,
    alignment: "center"
  }
};
var requestedPath = 'db/pig/fish/image.json';

//helper fn
function stripLast(pathStrOrArr) {
  var arr = typeof pathStrOrArr === 'string' ? pathStrOrArr.split('/') : pathStrOrArr.slice();
  arr.pop();
  return arr;
}

//actual post request fn
function postRequest(data, path) {
  var directoryArr = stripLast(path);
  var directoryStr = directoryArr.join('/');

  function findMissingDirectory(err, pathArr, number) {
    if (number > pathArr.length) {saveFile(); return;}
    var topLevelDir = pathArr.slice(0, number).join('/');
    fs.access(topLevelDir, function(err) {
      if (err) {
        number++;
        fs.mkdir(topLevelDir, findMissingDirectory.bind(null, err, pathArr, number));
      } else {
        number++;
        findMissingDirectory(null, pathArr, number);
      }
    });
  };

  function saveFile(err) {
    // if file path doesn't exist
    if (err) {
      findMissingDirectory(null, directoryArr, 1);
      return;

    // if exists, save the file
    } else {
      fs.writeFile(requestedPath, JSON.stringify(json), function(err) {
        if (err) {console.log(err)}
        else console.log('it saved!');
        return;
      })
    }
  }
  // check if the file path exists: start it off!
  fs.access(directoryStr, saveFile)
}

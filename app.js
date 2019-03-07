var childProcess = require('child_process');

function runScript(scriptPath, callback) {

  // keep track of whether callback has been invoked to prevent multiple invocations
  var invoked = false;

  var process = childProcess.fork(scriptPath);

  // listen for errors as they may prevent the exit event from firing
  process.on('error', function (err) {
    if (invoked) return;
    invoked = true;
    callback(err);
  });

  // execute the callback once the process has finished running
  process.on('exit', function (code) {
    if (invoked) return;
    invoked = true;
    var err = code === 0 ? null : new Error('exit code ' + code);
    callback(err);
  });

}

// Now we can run a script and invoke a callback when complete, e.g.
runScript('/home/pi/code/rpi-mjpeg-server/node_modules/raspberry-pi-mjpeg-server/raspberry-pi-mjpeg-server.js -w 640 -l 480 -p 3005 -t 80', function (err) {
  if (err) throw err;
  console.log('finished running some-script.js');
});

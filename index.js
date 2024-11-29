
const { spawn } = require('child_process');
const path = require('path');

// Function to start the child process
function start() {
    const args = [path.join(__dirname, 'plugins.js'), ...process.argv.slice(2)];
    console.log(Starting bot with args: ${args.join(' ')});

    const childProcess = spawn(process.argv[0], args, {
        stdio: ['inherit', 'inherit', 'inherit', 'ipc'],
    });

    childProcess.on('message', (data) => {
        if (data === 'reset') {
            console.log('Restarting Bot...');
            childProcess.kill();
            start();
        }
    });

    childProcess.on('exit', (code) => {
        console.error(Child process exited with code: ${code});
        if ([0, 1].includes(code)) {
            console.log('Restarting due to exit code...');
            start();
        }
    });

    childProcess.on('close', () => {
        console.log('Child process closed. Cleaning up...');
    });
}

start();

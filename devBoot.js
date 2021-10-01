require('dotenv').config(); // Import env variables

console.log('\nNebula DashLab | (c) Tristan Gauci, 2021\n');

global.drivers = {
    stats: require('./system/drivers/stats.driver'),
    hue: require('./system/drivers/hue/hue.driver'),
    obs: require('./system/drivers/obs.driver'),
    wifi: require('./system/drivers/wifi.driver')
};

/* function testShellExec() {

    console.log('Spawning shell script process...');

    const ls = spawn("ls", ["-la"]);

    ls.stdout.on("data", data => {
        console.log(`stdout: ${data}`);
    });
    
    ls.stderr.on("data", data => {
        console.log(`stderr: ${data}`);
    });
    
    ls.on('error', (error) => {
        console.log(`error: ${error.message}`);
    });
    
    ls.on("close", code => {
        console.log(`child process exited with code ${code}`);
    });

} */
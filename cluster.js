const cluster = require('cluster');
const http = require('http');
const numCPUs = require('os').cpus().length;

console.log('cpu length is:', numCPUs);
console.log(cluster.isWorker);
if(cluster.isMaster) {
    console.log(`主进程${process.pid} 正在运行`);
    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }
    cluster.on('exit', (worker, code, signal) => {
        console.log(`工作进程${worker.process.pid} 已退出`)
    });
    cluster.on('listening', (worker, address) => {
        console.log(`工作进程连接到${address.address}: ${address.port}`)
    })
} else {
    http.createServer((req, res) => {
        console.log(cluster.worker.id);
        res.writeHead(200);
        res.end('hello world\n');
    }).listen(8000);
    console.log(`工作进程${process.pid} 已启动`);
}

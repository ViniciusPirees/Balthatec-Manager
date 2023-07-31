import {Service} from 'node-windows'

var svc = new Service({
 name:'Server Balthatec',
 description: 'Conexão Balthatec ao banco de dados.',
 script: 'C:\\Users\\vinic\\Desktop\\BalthaTec-Projeto\\balthatec-manager\\server.js'
});

svc.on('install',function(){
 svc.start();
});

svc.install();
import { Service } from 'node-windows'

var svc = new Service({
 name:'Balthatec Manager',
 description:'Inicializar o Balthatec Manager.',
 script: 'C:\\Users\\vinic\\Desktop\\BalthaTec-Projeto\\balthatec-manager\\init.js'
});

svc.on('uninstall',function(){
 console.log('Desinstalou service')
});

svc.uninstall();
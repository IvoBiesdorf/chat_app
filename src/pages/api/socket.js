

import { Server } from "socket.io";

export default function SocketHandler(req, res) {
    let users = [];
    
    if (res.socket.server.io) {
        console.log("Already set up");
        res.end();
        return;
    }
   // const io = new Server(res.socket.server);
    const io = new Server(httpServer, {
        cors: {
          origin: ["https://chat-app-ivobiesdorf.vercel.app/"],
          credentials: false
        }
      });
    res.socket.server.io = io;

    io.on("connection", function(socket){
        socket.on("nome_usuario", function(dados){
            console.log('Entrou o ', dados.nome);
            users = [...users, {nome:dados.nome, id:socket.id}]
            io.emit('usuarios', {users})
        });
        socket.on("createdMessage", function(msg){
            socket.to(msg.to).emit("newIncomingMessage", msg);
            console.log('Nova mensagem');
        });
        socket.on("lista_usuarios", function(){
            io.emit('usuarios', {users})
        })
        socket.on('disconnect', function(){
            users.map((id, i) =>{
                if(socket.id == id.id){
                    users.splice(i, 1);
                    console.log('Saiu o ',id.nome);
                }
            })
            io.emit('usuarios', {users})
        })
    });
  

  console.log("Setting up socket");
  res.end();
}

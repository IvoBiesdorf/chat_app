import io from "socket.io-client";
import styles from '../styles/home.module.css'
import { useState, useEffect } from "react";

let socket = io();

export default function Home() {
    const [username, setUsername] = useState("");
    const [userchat, setUserchat] = useState(["",""]);
    const [chosenUsername, setChosenUsername] = useState("");
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([])
    const [lastMsg, setLastMsg] = useState([])
    
    useEffect(() => {
        fetch("/api/socket");

        socket.on("newIncomingMessage", (msg) => {
            setMessages((currentMsg) => [
                ...currentMsg,
                { author: msg.author, message: msg.message, to: userchat[1], from : msg.from, lido: false},
            ]); 
            setLastMsg([msg.from,msg.message])
        });
        socket.on("usuarios", (lista) => {
            const usuarios = lista.users;
            let aux = [];
            usuarios.map(usr=>{
                aux = [...aux, { nome: usr.nome, id: usr.id }]
                setUsers( aux )            
            })
        });
    }, []);

    function logar(username){
        if(username){
            socket.emit("nome_usuario", {
                nome:username
            })
        }else{
            {alert("Identifique-se por favor!")}
        }
    }

    const sendMessage = async () => {
        if(message){
            socket.emit("createdMessage", { 
                author: chosenUsername, 
                message, 
                to:userchat[1],
                from : socket.id
            });
            setMessages((currentMsg) => [
                ...currentMsg,
                { author: chosenUsername, message, to: userchat[1], from : socket.id, lido:true},
            ]);
            setMessage("");
        }
    };

    function msgNova(){
        return true;
    }
    const handleKeypress = (e) => {
        if (e.keyCode === 13) {
            if(chosenUsername){
                if(message){
                    sendMessage();
                }
            }else{
                setChosenUsername(username);
                logar(username);
            }
        }
    };

    return (
        <main className={styles.home}>
            {!chosenUsername ? (
                <div className={styles.login}>
                    <h3 className={styles.title}>Quem é você?</h3>
                    <input type="text" className={styles.input} placeholder="Alto lá, identifique-se..."
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        onKeyUp={(e)=>handleKeypress(e)}
                    />
                    <button className={styles.btn} 
                        onClick={() => {
                            setChosenUsername(username);
                            logar(username);
                        }}
                    >Entrar!</button>
                </div>
            ) : (
            <div className={styles.chat}>
                <div className={styles.cabecalho}>
                    Seja bem vindo(a) {username}!
                </div>
                <div className={styles.corpo}>
                    <div className={styles.lista}>
                        <h3><i className="fa fa-users" aria-hidden="true"> &nbsp;</i> Usuários online</h3>
                        <div className={styles.users}>
                            { users.filter(user => user.id !== socket.id).map((usr, i) => (
                                <div key={i}  className={styles.pp}>
                                    <div className={`${styles.user}`} 
                                        onClick={()=>{
                                            setUserchat([usr.nome, usr.id]);
                                        }}>
                                        <div><i className="fa fa-3x fa-user-circle-o" aria-hidden="true"></i></div>
                                        <div className={styles.boxUsr}>
                                            <div className={styles.usr}>{usr.nome}</div> 
                                            <div className={styles.firstMsg}>{ messages.filter(msg=>msg.from === usr.id || msg.to === usr.id).reduce((mf, mi) => { return(mi.message)},'...')}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    {!!userchat[0] ? (<div className={styles.cardMessages}>
                        <div className={styles.userchat}><i className="fa fa-user-o" aria-hidden="true"> &nbsp;{userchat[0]}</i><span className={styles.close} onClick={()=>setUserchat(["",""])}><i className="fa fa-close" aria-hidden="true"></i></span></div> 
                        <div className={styles.messageBox}>
                            {messages.filter(msg => msg.to === userchat[1] || msg.from === userchat[1]).map((msg, i) => (
                                <div className={styles.msg} key={i} >
                                    {msg.author === username ? (
                                        <div className={styles.msgRight}>{msg.message}</div>
                                    ):(
                                        <div className={styles.msgLeft}>{msg.message}</div>
                                    )}
                                    
                                </div>
                            ))}
                        </div>
                        <div className={styles.inputMsg}>
                            <input
                                type="text"
                                placeholder="Nova mensagem..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyUp={handleKeypress}
                            />
                            <button onClick={() => {sendMessage()}}>Enviar</button>
                        </div>
                    </div>
                    ):(
                        <div className={styles.voidCard}>
                            <i className="fa fa-5x fa-comments-o" aria-hidden="true"></i>
                            <span>ChatApp!</span>
                        </div>
                    )}
                </div>
            </div>
            )}
        </main>
    );
}

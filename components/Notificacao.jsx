import { useState } from "react"

export default function notificacao(props){
    
    return(
        <div>
            {props.exibir ? 'Notific':''}
        </div>
    )
}
import React from 'react'

import io from 'socket.io-client';


/*


    msg{
      from: 'user',
      msg: 'hello',
      topic: 'general'
    }


    state {

      general: [
      {msg, msg, msg}
      ],

      topic2: [
        {msg, msg, msg}
      ]

    }


*/


export const ctx = React.createContext();


const initState = {
  Bilderberg: [
    {from: 'Koch', msg: 'Hello1'},
    {from: 'Soros', msg: 'Hello2'}
  ],
  Davos: [
    {from: 'Gates', msg: 'Hello3'},
    {from: 'Lagarde', msg: 'Hello4'}
  ]
}

function reducer(state, action) {
  const {from, msg, topic} = action.payload;
  switch(action.type) {
    case 'Receive Message':
      return {
        ...state, 
        [topic]: [
          ...state[topic], 
          {from, msg}
        ]
      }
    default:
      return state
  }
}





let socket;


function sendChatAction(value) {
  socket.emit('chat message', value);
}



export default function Store(props) {

  const [allChats, dispatch] = React.useReducer(reducer, initState)



  if (!socket) {
    socket = io(':3001')
    socket.on('chat message', function(msg){
      dispatch({type:'Receive Message', payload: msg})
    });
  }

  const user = 'You';




  return (
    <ctx.Provider value={{allChats, sendChatAction, user}}>
      {props.children}
    </ctx.Provider>
  )
}
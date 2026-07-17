"use client";

import { useState } from "react";

export default function ProfilePanel() {

  const [nickname, setNickname] = useState("");

  const [bornCountry, setBornCountry] = useState("");

  const [bornCity, setBornCity] = useState("");

  const [liveCountry, setLiveCountry] = useState("");

  const [liveCity, setLiveCity] = useState("");

  const [hand, setHand] =
    useState<"left" | "right">("right");

  return (

    <div

      style={{

        position:"absolute",

        top:20,

        left:20,

        width:340,

        padding:20,

        borderRadius:18,

        background:"rgba(18,24,35,.88)",

        border:"1px solid rgba(255,255,255,.12)",

        color:"#fff",

        backdropFilter:"blur(14px)",

        zIndex:1000

      }}

    >

      <h2
        style={{
          marginTop:0
        }}
      >
        🌍 Добавить себя на карту
      </h2>

      <input

        value={nickname}

        onChange={(e)=>
          setNickname(e.target.value)
        }

        placeholder="Ваш ник"

        style={inputStyle}

      />



      <input

        value={bornCountry}

        onChange={(e)=>
          setBornCountry(e.target.value)
        }

        placeholder="Страна рождения"

        style={inputStyle}

      />



      <input

        value={bornCity}

        onChange={(e)=>
          setBornCity(e.target.value)
        }

        placeholder="Город рождения"

        style={inputStyle}

      />



      <input

        value={liveCountry}

        onChange={(e)=>
          setLiveCountry(e.target.value)
        }

        placeholder="Где сейчас живёте"

        style={inputStyle}

      />



      <input

        value={liveCity}

        onChange={(e)=>
          setLiveCity(e.target.value)
        }

        placeholder="Текущий город"

        style={inputStyle}

      />



      <div
        style={{
          marginTop:16,
          marginBottom:8
        }}
      >

        Ведущая рука

      </div>

      <label>

        <input

          type="radio"

          checked={hand==="left"}

          onChange={()=>
            setHand("left")
          }

        />

        Левша

      </label>

      <br/>

      <label>

        <input

          type="radio"

          checked={hand==="right"}

          onChange={()=>
            setHand("right")
          }

        />

        Правша

      </label>





      <button

        style={{

          marginTop:22,

          width:"100%",

          padding:14,

          borderRadius:10,

          border:"none",

          background:"#2f87ff",

          color:"#fff",

          fontWeight:700,

          cursor:"pointer"

        }}

      >

        Добавить себя

      </button>

    </div>

  );

}



const inputStyle={

  width:"100%",

  padding:"11px",

  marginTop:10,

  borderRadius:8,

  border:"none",

  outline:"none",

  fontSize:15

} as const;
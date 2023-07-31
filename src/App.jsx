import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import Retorno from "./pages/Retorno";
import Dana from "./assets/logo-dana.png";
import Balthatec from "./assets/navlogo-baltha.png";
import moment from "moment";
import { useEffect, useState } from "react";

function App() {
  const [tempo, setTempo] = useState("");

  useEffect(() => {
    setInterval(() => {
      var tempo2 = moment().format("DD/MM/YY HH:mm:ss");
      setTempo(tempo2);
    }, 1000);
  }, [tempo]);

  return (
    <>
      <div className="w-full h-16">
        <div className="float-left">
          <img className="w-24 ml-6 mt-1 mr-4" src={Dana}></img>
        </div>
        <div>
          <img className="w-48 mt-8 " src={Balthatec}></img>
        </div>
        <h1 className="text-slate-50 text-lg font-bold left-36 absolute">{tempo}</h1>
      </div>
      <Retorno></Retorno>
    </>
  );
}

export default App;

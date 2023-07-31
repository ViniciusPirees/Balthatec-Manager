import axios from "axios";
import React, { useState, useEffect, useRef } from "react";
import Grafico from "../components/Grafico";
import useScanDetection from "use-scan-detection";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Retorno() {
  const [nSerie, setnSerie] = useState("");
  const [nCLP, setnCLP] = useState("");

  const sendDataPLC = async (code) => {
    try {
      const res = await axios.get(
        `http://${import.meta.env.VITE_IP}:8800/PLCConn`,
        {
          params: code,
        }
      );
      if (res?.data == 'Sucesso') {
      toast.success("Número de série enviado ao CLP com sucesso!", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      } else {
        toast.error("Erro ao enviar o Número de série para o CLP!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "colored",
        });
      }
      
    } catch (err) {
      console.log(err);
    }
  };

  useScanDetection({
    onComplete: (code) => {
      setnSerie(code), sendDataPLC([code]);
      console.log(code);
    },
    minLength: 7,
    averageWaitTime: 20,
  });

  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        closeOnClick={true}
        pauseOnHover={true}
        draggable={true}
        progress={undefined}
        theme="colored"
      />
      <div className="ml-16 mt-5">
        <div className="">
          <h2 className="text-white ml-1 mb-1 font-semibold text-lg">
            Máquina:
          </h2>
          <input
            className="relative text-xl p-2 border-2 bg-[#222831] text-white rounded-md w-48 focus:outline-none"
            value={nCLP}
            onChange={(e) => setnCLP(e.target.value)}
            name="num-clp"
            placeholder="Máquina"
          />
        </div>

        <div className="mt-4 mb-5">
          <h2 className="text-white ml-1 mb-1 font-semibold text-lg">
            Nº de Série:
          </h2>
          <input
            className="relative text-xl p-2 border-2 bg-[#222831] text-white rounded-md w-48 focus:outline-none"
            value={nSerie}
            onChange={(e) => setnSerie(e.target.value)}
            name="num-serie"
            placeholder="Número de Série"
          />
        </div>
      </div>

      <div className="ml-16">
        {<Grafico nSerie={nSerie} nCLP={nCLP}></Grafico>}
      </div>
    </div>
  );
}

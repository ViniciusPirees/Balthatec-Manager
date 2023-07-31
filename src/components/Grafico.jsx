import React, { useEffect, useRef, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Chart } from "react-chartjs-2";
import axios from "axios";
import Excel from "./excel";
import { FaFileExcel } from "react-icons/fa6";
import { FaArrowsRotate } from "react-icons/fa6";
import moment from "moment";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const Grafico = (props) => {
  const [valores, setValores] = useState([]);
  const [errormessage, setErrorMessage] = useState(false);
  const [errorSerie, setErrorSerie] = useState(false);
  const [aprovacao, setAprovacao] = useState("");
  const [styleApr, setStyleApr] = useState("");
  const [live, setLive] = useState(false);
  const [ultimo, setUltimo] = useState(false);
  const [automatico, setAutomatico] = useState(false);
  const [titulo, setTitulo] = useState("");
  const [rodar, setRodar] = useState(false);
  const handleChange = (value) => {
    setAprovacao("");
    setUltimo(false);
    setValores([]);
    setAutomatico(value);
    startAuto();
  };

  useEffect(() => {
    if (props.nCLP.length == 0) {
      setAutomatico(false);
    }
  }, [props.nCLP]);

  const handleClick = () => {
    setAprovacao("");
    setAutomatico(false);
    setUltimo(false);
    setValores([]);
    fetchAll();
  };

  const fetchAll = async () => {
    try {
      const res = await axios.get(
        `http://${import.meta.env.VITE_IP}:8800/PLCData`,
        {
          params: props,
        }
      );

      if ("code" in res.data) {
        setErrorMessage(true);
        setValores([]);
      } else {
        if (res.data.length == 0) {
          try {
            const res = await axios.get(
              `http://${import.meta.env.VITE_IP}:8800/PLCDataUltimo`,
              {
                params: props,
              }
            );

            if (res.data.length == 0) {
              try {
                const res = await axios.get(
                  `http://${import.meta.env.VITE_IP}:8800/PLCDataUltimoDuplo`,
                  {
                    params: props,
                  }
                );
                if ("code" in res.data) {
                  setErrorMessage(true);
                  setValores([]);
                } else {
                  if (res.data.length == 0) {
                    setErrorSerie(true);
                    setValores([]);
                  } else {
                    setValores(res.data);
                    setLive(false);
                    setErrorMessage(false);
                    setUltimo(true);
                    setErrorSerie(false);
                    setAprovacao("Para aprovar");
                  }
                }
              } catch (err) {
                console.log(err);
              }
            } else {
              if ("code" in res.data) {
                setErrorMessage(true);
                setValores([]);
              } else {
                setValores(res.data);
                setLive(false);
                setUltimo(true);
                setErrorMessage(false);
                setErrorSerie(false);
                setAprovacao("Para aprovar");
              }
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          setValores(res.data);
          setLive(true);
          setUltimo(false);
          setErrorMessage(false);
          setErrorSerie(false);
          setAprovacao("Em trabalho");
          setStyleApr(
            "p-2 px-4 text-black font-extrabold m-auto rounded-md bg-yellow-400 w-fit mb-4"
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  setInterval(() => {
    if (live && !automatico) {
      fetchAll();
      if (aprovacao != "Reprovado" && aprovacao != "Em trabalho") {
        setAprovacao("Em trabalho");
        setStyleApr(
          "p-2 px-4 text-black font-extrabold m-auto rounded-md bg-yellow-400 w-fit mb-4"
        );
      }
    }
  }, 4000);

  const fetchAllAuto = async (propsAuto) => {
    try {
      const res = await axios.get(
        `http://${import.meta.env.VITE_IP}:8800/PLCData`,
        {
          params: propsAuto,
        }
      );

      if ("code" in res.data) {
        setErrorMessage(true);
        setValores([]);
      } else {
        if (res.data.length == 0) {
          try {
            const res = await axios.get(
              `http://${import.meta.env.VITE_IP}:8800/PLCDataUltimo`,
              {
                params: propsAuto,
              }
            );

            if (res.data.length == 0) {
              try {
                const res = await axios.get(
                  `http://${import.meta.env.VITE_IP}:8800/PLCDataUltimoDuplo`,
                  {
                    params: propsAuto,
                  }
                );
                if ("code" in res.data) {
                  setErrorMessage(true);
                  setValores([]);
                } else {
                  if (res.data.length == 0) {
                    setErrorSerie(true);
                    setValores([]);
                  } else {
                    setValores(res.data);
                    setErrorMessage(false);
                    setUltimo(true);
                    setErrorSerie(false);
                    setAprovacao("Para aprovar");
                  }
                }
              } catch (err) {
                console.log(err);
              }
            } else {
              if ("code" in res.data) {
                setErrorMessage(true);
                setValores([]);
              } else {
                setValores(res.data);
                setUltimo(true);
                setErrorMessage(false);
                setErrorSerie(false);
                setAprovacao("Para aprovar");
              }
            }
          } catch (err) {
            console.log(err);
          }
        } else {
          setValores(res.data);
          setUltimo(false);
          setErrorMessage(false);
          setErrorSerie(false);
          setAprovacao("Em trabalho");
          setStyleApr(
            "p-2 px-4 text-black font-extrabold m-auto rounded-md bg-yellow-400 w-fit mb-4"
          );
        }
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (automatico) {
      const autoRodar = setInterval(() => {
        startAuto();
      }, 15000);
      return () => clearInterval(autoRodar);
    }
  }, [automatico]);

  const startAuto = async () => {
      try {
        const res = await axios.get(
          `http://${import.meta.env.VITE_IP}:8800/PLCDataAuto`,
          {
            params: props,
          }
        );
        console.log(res?.data);
        const ultimoEl = valores[valores.length - 1];
        if (ultimoEl == null && valores.length == 0) {
          const propsAuto = {
            nSerie: res.data[0].NumeroSerie.trim(),
            nCLP: props.nCLP,
          };
          fetchAllAuto(propsAuto);
        } else {
          const datares = res.data[0].DataHora;
          const dataUltimo = ultimoEl.DataHora;
          if (datares > dataUltimo) {
            const propsAuto = {
              nSerie: res.data[0].NumeroSerie.trim(),
              nCLP: props.nCLP,
            };
            fetchAllAuto(propsAuto);
          }
        }
      } catch (err) {
        console.log(err);
      }
    
  };

  useEffect(() => {
    const valAprov = valores.filter((el) => {
      if (el.Aprovacao == 1) {
        setAprovacao("Reprovado");
        setStyleApr(
          "p-2 px-4 text-slate-50 font-extrabold rounded-md m-auto bg-red-600 w-fit mb-4"
        );
        return true;
      }
    });

    if (valAprov.length == 0 && aprovacao == "Para aprovar") {
      setAprovacao("Aprovado");
      setStyleApr(
        "p-2 px-4 text-slate-50 font-extrabold m-auto rounded-md bg-green-600 w-fit mb-4"
      );
    }
  }, [ultimo, aprovacao]);

  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({
    datasets: [],
  });
  const [excelTitulo, setExcelTitulo] = useState('')
  useEffect(() => {
    const chart = chartRef.current;

    if (!chart) {
      return;
    }

    if (!errormessage) {
      const correntes = valores.map((valor) => valor.Corrente);
      const dataHora = valores.map(
        (valor) =>
          `${valor.DataHora.substring(8, 10)}/${valor.DataHora.substring(
            5,
            7
          )}/${valor.DataHora.substring(2, 4)} - ${valor.DataHora.substring(
            11,
            19
          )}`
      );
      const tensao = valores.map((valor) => valor.Tensao);

      var nSerieTit = `Nº Série: ${valores[
        valores.length - 1
      ]?.NumeroSerie.trim()}`;
      var duracao = "";
      if (ultimo) {
        var tempo3 = valores[0]?.DataHora;
        
        var tempo4 = valores[valores.length - 1]?.DataHora;
        
        
        setExcelTitulo(moment.utc(tempo3).format("DD-MM-YY hh:mm:ss"))
        duracao =
          " - Duração: " +
          moment.utc(moment(tempo4).diff(moment(tempo3))).format("HH:mm:ss");
      }

      const chartData2 = {
        labels: dataHora,
        datasets: [
          {
            label: "Corrente",
            data: correntes,
            borderWidth: 5,
            borderColor: "#36A2EB",
            backgroundColor: "#9BD0F5",
          },
          {
            label: "Tensão",
            data: tensao,
            borderWidth: 5,
            borderColor: "#cc0000",
            backgroundColor: "#ff4040",
          },
        ],
      };
      setTitulo(nSerieTit + duracao);
      setChartData(chartData2);
    }
  }, [errormessage, valores]);

  const options = {
    plugins: {
      legend: {
        labels: {
          color: "#dbdbdb",
          font: {
            size: 18
          },
        },
        align: "center",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: "#dbdbdb",
        },
        ticks: {
          color: "#dbdbdb",
	  font: {
		size: 20,
		}
        },
      },
      x: {
        grid: {
          color: "#bdbdbd",
        },
        ticks: {
          color: "#dbdbdb",
		font: {
		size: 20,
		}
        },
      },
    },
    animation: false,
  };

  return (
    <div>
      <div>
        {
          <div className="">
            <input
              type="checkbox"
              className="w-5 h-5 align-text-top"
              onChange={(e) => handleChange(e.target.checked)}
              checked={automatico}
            />
            <label className="text-white text-lg ml-2">
              Atualizar Automático
            </label>
          </div>
        }
        {!automatico && (
          <button
            className="mt-6 p-2 pl-11 rounded-md font-extrabold text-lg text-[#222831] bg-[#fbc91e] w-48 flex duration-700 hover:bg-[#ffe281] "
            onClick={handleClick}
          >
            Carregar <FaArrowsRotate className="ml-1 mt-[0.1em]" size="1.3em" />
          </button>
        )}
        { valores?.length > 0 &&
        <button
          className="mt-6 p-2 pl-[3.2em] rounded-md font-extrabold text-lg text-[#fff] bg-[#107c41] w-48 flex duration-700 hover:bg-[#185c37]"
          onClick={(e) => Excel([valores, props.nCLP, excelTitulo])}
        >
          Excel
          <FaFileExcel className="ml-1 mt-[0.1em]" size="1.3em" />
        </button>
      }
        <div className="absolute top-14 left-96 w-[72%] align-middle">
          {valores.length > 0 && (
            <h2 className="text-slate-50 text-xl font-extrabold m-auto -mt-8 mb-5 rounded-md w-fit">
              {titulo}
            </h2>
          )}
          {aprovacao.length > 0 && (
            <h2 className={styleApr}>
              {(aprovacao == "Reprovado" || aprovacao == "Para aprovar") &&
                styleApr.includes("red") &&
                "Reprovado"}
              {aprovacao == "Em trabalho" &&
                styleApr.includes("yellow") &&
                "Em trabalho"}
              {(aprovacao == "Aprovado" || aprovacao == "Para aprovar") &&
                styleApr.includes("green") &&
                "Aprovado"}
            </h2>
          )}
          {errormessage && (
            <h2 className="text-slate-50 mb-4 font-bold">
              Não encontrado Máquina/Nº de Série (Utilizar apenas números)
            </h2>
          )}
          {errorSerie && (
            <h2 className="text-slate-50 mb-4 font-bold">
              Não encontrado nº de Série
            </h2>
          )}
          <Chart
            ref={chartRef}
            type="line"
            data={chartData}
            options={options}
          />
        </div>
      </div>
    </div>
  );
};

export default Grafico;

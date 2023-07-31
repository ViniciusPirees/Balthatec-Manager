import React from "react";
import { Workbook } from "exceljs";
import { saveAs } from "file-saver";
import moment from "moment";

export default async function Excel(props) {
  const wb = new Workbook();
  const serie = props[0][0]?.NumeroSerie.trim()
  console.log(moment.utc(props[2]).format('DD-MM-YY_HH-mm-ss'))
  const ws = wb.addWorksheet("Planilha 1");
  const titulo = `Série ${serie} - CLP#${props[1]} - Início - ${(props[2])}`
  ws.mergeCells("A1", "C1");
  ws.getCell("A1").value = titulo;
  ws.getCell('A1').alignment = { vertical: 'top', horizontal: 'center' };
  ws.getCell('A2').alignment = { vertical: 'top', horizontal: 'center' };
  ws.getCell('B2').alignment = { vertical: 'top', horizontal: 'center' };
  ws.getCell('C2').alignment = { vertical: 'top', horizontal: 'center' };

  ws.getCell('A1').font = { bold: true };
  ws.getCell('A2').font = { bold: true };
  ws.getCell('B2').font = { bold: true };
  ws.getCell('C2').font = { bold: true };
    
  ws.getRow(2).values = ["Data", "Corrente", "Tensão"];
  ws.columns = [
    { key: "data", width: 20 },
    { key: "corrente", width: 10 },
    { key: "tensao", width: 10 },
  ];
    
    const rows = props[0].map((valor) =>
    [
        `${valor.DataHora.substring(8, 10)}/${valor.DataHora.substring(5,7)}/${valor.DataHora.substring(2, 4)} - ${valor.DataHora.substring(11,19)}`,
        `${valor.Corrente}A`,
        `${valor.Tensao}V`
    ]
  );

  ws.addRows(rows);

  const buf = await wb.xlsx.writeBuffer();
  saveAs(new Blob([buf]), `${props[2]}_Maquina-${props[1]}_Serie-${serie}.xlsx`);
}

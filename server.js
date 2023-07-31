
import sql from 'mssql';
import 'dotenv/config';
import express from "express";
import cors from "cors";
import { useState } from 'react';
import NodeS7 from 'nodes7';



const app = express()
app.use(cors())
app.listen(8800, () => {
    console.log("Conectado ao BackEnd")
})

const config = {
    user: process.env.DB_USER,
    password: process.env.DB_SENHA,
    server: process.env.DB_SERVER, // You can use 'localhost\\instance' to connect to named instance
    database: process.env.DB_DBNAME,
    dialect: "mssql",
    options: {
        trustServerCertificate: true
    }
}

app.get("/", (req, res) => {
    res.json("Olar")
})


app.get("/PLCData", (req, res) => {
    sql.connect(config).then(pool => {
        // Query      
        return pool.request()
            .query(`select * from CLP#${req.query.nCLP} where NumeroSerie = ${req.query.nSerie} AND DataHora > (SELECT MAX(DataHora) AS DataHora from CLP#${req.query.nCLP} WHERE Inicio = 0 and NumeroSerie = ${req.query.nSerie}) order by DataHora, Inicio ASC`)
    }).then(result => {
        res.json(result.recordset)
    }).catch(err => {
        res.json(err)
    });
})


app.get("/PLCDataUltimo", (req, res) => {
    sql.connect(config).then(pool => {
        // Query      
        return pool.request()
            .query(`select * from CLP#${req.query.nCLP} where Inicio = 1 and NumeroSerie = ${req.query.nSerie} AND DataHora < (SELECT MAX(DataHora) AS DataHora from CLP#${req.query.nCLP} WHERE Inicio = 0 and NumeroSerie = ${req.query.nSerie}) and DataHora > (select DataHora from CLP#${req.query.nCLP} WHERE Inicio = 0 and NumeroSerie = ${req.query.nSerie} ORDER BY DataHora DESC OFFSET 2 ROWS FETCH NEXT 1 ROWS ONLY) order by DataHora, Inicio ASC`)
    }).then(result => {
        res.json(result.recordset)
    }).catch(err => {
        res.json(err)
    });
})

app.get("/PLCDataUltimoDuplo", (req, res) => {
    sql.connect(config).then(pool => {
        // Query      
        return pool.request()
            .query(`select * from CLP#${req.query.nCLP} where Inicio = 1 and NumeroSerie = ${req.query.nSerie} AND DataHora < (SELECT MAX(DataHora) AS DataHora from CLP#${req.query.nCLP} WHERE Inicio = 0 and NumeroSerie = ${req.query.nSerie}) and DataHora > (select DataHora from CLP#${req.query.nCLP} WHERE Inicio = 0 and NumeroSerie = ${req.query.nSerie} ORDER BY DataHora DESC OFFSET 1 ROWS FETCH NEXT 1 ROWS ONLY) order by DataHora, Inicio ASC
            `)
    }).then(result => {
        res.json(result.recordset)
    }).catch(err => {
        res.json(err)
    });
})


app.get("/PLCDataAuto", (req, res) => {
    sql.connect(config).then(pool => {
        // Query      
        return pool.request()
            .query(`select TOP (1) * from CLP#${req.query.nCLP} WHERE INICIO = 1 ORDER BY DataHora desc`)
    }).then(result => {
        res.json(result.recordset)
    }).catch(err => {
        res.json(err)
    });
})



app.get('/PLCConn', (req, res) => {

    const conn = new NodeS7;
    var doneReading = false;
    var doneWriting = false;

    var variables = {
        STRING: 'DB12,STRING22.15',        // String
    };

    conn.initiateConnection({ port: 102, host: '10.215.155.192', rack: 0, slot: 1, debug: false }, connected); // slot 2 for 300/400, slot 1 for 1200/1500, change debug to true to get more info

    function connected(err) {
        if (typeof (err) !== "undefined") {
            // We have an error. Maybe the PLC is not reachable.
            console.log(err);
            process.exit();
        }
        conn.setTranslationCB(function (tag) { return variables[tag]; }); // This sets the "translation" to allow us to work with object names

        conn.writeItems('STRING', req.query[0], valuesWritten); // You can write a single array item too.

    }
    /*
    function valuesReady(anythingBad, values) {
        if (anythingBad) { console.log("SOMETHING WENT WRONG READING VALUES!!!!"); }
        console.log(values);
        doneReading = true;
        if (doneWriting) { }
    }*/
    function valuesWritten(anythingBad) {
        if (anythingBad) {
            res.json("Erro");
            conn.dropConnection()
        } else {
            res.json("Sucesso");
            conn.dropConnection()
        }
   
    }


})
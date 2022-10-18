import React, { useEffect, useState } from "react";
import Phaser from 'phaser';
import Scene  from './components/Scene';

export default function Game() {
    //uso state de una varibale 'listo', sino usamos esto los lienzos se acumularan en la visa 
    const [listo, setListo] = useState(false);

    //usamos el hook para que renderice acciones que reat no hace
    useEffect(() => {
        const config = {
            type: Phaser.AUTO,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { y: 200 },
                    debug:false
                }
            },
            scene:[Scene]
        };
        //Aqui empieza el juego
        var game = new Phaser.Game(config);
        //Trigger cuando el juego esta completamente listo
        game.events.on("LISTO", setListo);
        //Esto ayuda a que no se duplique el lienzo
        return () => {
            setListo(false);
            game.destroy(true);
        }
    }, [listo])
};

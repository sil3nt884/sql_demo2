import React, {CSSProperties, useState} from 'react';
import {Item} from "@/app/types";


export const ItemModal = ({ selectedItem ,players, style}: {selectedItem: Item | null , players: string[], style: CSSProperties})=> {

    const [selectedPlayer, setSelectedPlayer] = useState<string>(players[0]); // Default to the first player
    const [itemAmount, setItemAmount] = useState<number>(1);



    const handleClose = () => {
        console.log(selectedPlayer);
        console.log(itemAmount);
        fetch(`http://localhost:3000/give/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                player: selectedPlayer,
                item: selectedItem?.minecraftName,
                amount: itemAmount
            }),
        }).then(response => response.text())
    };

    return selectedItem && (
            <div style={style} className="absolute z-10 p-4 bg-white border rounded shadow-lg item-modal">
                <h2 className="mb-2 text-lg font-bold form">Give Item: {selectedItem.minecraftName}</h2>
                <img src={selectedItem.imagePath} alt={selectedItem.minecraftName} className="w-12 h-12 mb-2 item-modal" />
                <select

                    onChange={(e) => {
                        setSelectedPlayer(e.target.value)
                    }}
                    className="mb-2 p-2 border rounded w-full form item-modal"
                >
                    {players.map(player => (
                        <option className={"form item-modal"} key={player} value={player}>{player}</option>
                    ))}
                </select>
                <input
                    type="number"
                    placeholder="Amount"
                    value={itemAmount}
                    onChange={(e) => setItemAmount(parseInt(e.target.value))}
                    className="mb-2 p-2 border rounded w-full form item-modal"
                />
                <button className="p-2 bg-blue-500 text-white rounded w-full mt-2" onClick={handleClose}>Give</button>
            </div>

    );
}

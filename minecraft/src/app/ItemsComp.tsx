'use client'
import {Players} from "@/app/PlayersComp";
import {Item} from "@/app/types";
import React, {useEffect, useRef, useState} from "react";
import {ItemModal} from "@/app/ItemModal";
import {debounce} from "lodash";


export const ItemsComp = ({ data, onlinePlayers }: { data: Item[] , onlinePlayers: string[]}) => {

    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [players, setPlayers] = useState<string[]>(onlinePlayers);
    const modalRef = useRef<HTMLDivElement | null>(null);
    const [modalPosition, setModalPosition] = useState<{ x: number, y: number }>({ x: 0, y: 0 });


    const fetchPlayers = debounce(() => {
        fetch('http://localhost:3000/players')
            .then(response => response.json())
            .then(data => setPlayers(data))
            .catch(error => console.error('Error fetching players:', error));
    }, 300); // 300ms debounce

    useEffect(() => {
        fetchPlayers(); // Initial fetch

        const interval = setInterval(() => {
            fetchPlayers();
        }, 5000); // Poll every 5 seconds

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);



    const handleItemClick = (event: React.MouseEvent) => {
        const modalHeight = 300|| 0;
        let yPosition = event.clientY;

        if (yPosition + modalHeight > window.innerHeight) {
            yPosition = window.innerHeight - modalHeight;
        }

        setModalPosition({
            x: event.clientX,
            y: yPosition
        });
    };


    const handleSelectItem = (item: Item) => {
        console.log(item)
        setSelectedItem(prevState => prevState = item);
    }

    return (
        <div onClick={(e) => {
            const elemt = e.target as HTMLElement;
            if (!elemt.className.includes("item-modal")) {
                setSelectedItem(null);
            }

        }} className={"background"}>
            <Players onlinePlayers={players}></Players>
            <div className="flex flex-col items-center justify-center min-h-screen">
                <h1 className="text-2xl font-bold mb-4 text-center">Items</h1>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {data.map((item: Item) => (
                        <div onClick={(e) => {handleSelectItem(item); handleItemClick(e)}} key={item.minecraftName} className="flex flex-col items-center item-modal">
                            <img   src={item.imagePath} alt={item.minecraftName} className="w-12 h-12 mb-2 item-modal" />
                            <p className={"item-modal"}>{item.minecraftName}</p>
                        </div>
                    ))}
                    <div ref={modalRef}>
                        <ItemModal style={{
                                top:modalPosition.y  ,
                                left: modalPosition.x,
                                position: "fixed"
                            }
                        } key={"aaaa"} selectedItem={selectedItem} players={players} ></ItemModal>
                    </div>

                </div>
            </div>
        </div>
    )
}
'use client';
import {useEffect, useState} from "react";
import { debounce } from 'lodash';
export const Players = ({ onlinePlayers }: {  onlinePlayers: string[]}) => {

    return <div>
        <h1>Players Online</h1>
        <ul>
            {onlinePlayers.map((item: string) => (
                <li key={item}>
                    {item}
                </li>
            ))}
        </ul>
    </div>

};
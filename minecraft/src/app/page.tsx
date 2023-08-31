import {ItemsComp} from "@/app/ItemsComp";
import {Suspense} from "react";

export default async function Home() {

  const fetchItems = async () => {
    return await fetch('http://localhost:3000/items').then(res => res.json());
  }

  const fetchOnlinePlayers = async () => {
    return await fetch('http://localhost:3000/players').then(res => res.json());
  }
  const items = await fetchItems();
  const players = await fetchOnlinePlayers();

  return (
      <Suspense fallback={<div>loading data...</div>}>
        <ItemsComp data={items} onlinePlayers={players}></ItemsComp>
      </Suspense>
  )
}

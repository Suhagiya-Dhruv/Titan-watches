import React, { useEffect, useState } from 'react';
import WebsocketService from './webSocketService';

const RainCanvas = () => {

  const [watches, setWatches] = useState([]); // Watched list 

  const [clickCheck, setClickCheck] = useState(false); // check if userclick the watch or not
  const [storeId, setStoreId] = useState([]);

  const cachedMemory = [] // Storing cache id for smothes falling down to one screen to another screen

  const value = window.location.href;
  const arr = value.split("/");
  const length = arr.length;


  function messageRecived(event) { // When watch touch the bottom line then message comes
    const data = JSON.parse(event.data);
    if (data === "stop" || data === "start") { // if message comes start and stop then means user click the watch or click the close button
      setClickCheck((prev) => !prev);
      return;
    }
    setWatches((prevWatches) => [
      ...prevWatches,
      data,
    ]);
  }

  // Making websocket connection
  useEffect(() => {
    WebsocketService.init(`${arr[length - 2]}-${arr[length - 1]}`, messageRecived);

    return () => {
      WebsocketService.close();
    };
  }, []);

  useEffect(() => {
    let intervalId;
    if (!clickCheck) {
// update y position of watch each 10ms
      intervalId = setInterval(() => {
        setWatches((prevDivs) => {
          const updatedDivs = prevDivs.map((div) => {
            if (div.y >= div.displayHeight - div.watchHeight) { // if watch touch the bottom line of screen or not
              div.currScreen += 1;
              if (div.currScreen > div.totalDispaly) {
                div.currScreen = 1;
              }
              if (!cachedMemory.includes(div.id)) {
                cachedMemory.push(div.id);
                WebsocketService.sendMessage(div) // send message for display the watch on next screen
              }
            }
            if (div.y >= div.displayHeight && cachedMemory.includes(div.id)) { // if watch gone out of screen
              const index = cachedMemory.indexOf(div.id);
              if (index > -1) {
                cachedMemory.splice(index, 1); // remove cache index when watch gone out of screen
              }
            }
            return ({
              ...div,
              y: div.y + 1,
            })
          });

          const remainingDivs = updatedDivs.filter((div) => div.y <= div.displayHeight); // remove watch

          return remainingDivs;
        });
      }, 10);

    }
    return () => clearInterval(intervalId);

  }, [clickCheck]);

  return (
    <div>
      <div style={{ width: "500px", height: "300px", position: "relative", overflow: "hidden", border: "1px solid blue" }}>
        {watches?.map((item, id) => {
          return (
            <div
              key={id}
              style={{
                position: "absolute",
                top: `${item.y}px`,
                left: `${item.x}px`,
                width: item.watchWidth,
                height: item.watchHeight,
                visibility: storeId.length ? "hidden" : "visible",
                backgroundImage: `url("${item.link}")`,
                backgroundSize: "contain",
                backgroundRepeat: "no-repeat"
              }}
              onClick={() => { setStoreId(watches.filter((a) => a.id === item.id)), WebsocketService.sendMessage("stop") }}
            ></div>
          )
        })}
        {/* Details of watch */}
        {storeId?.map((item, id) => {
          return (
            <div key={id} style={{ width: "80%", height: "80%", backgroundColor: "lightblue", position: "relative" }}>
              <button style={{ position: "absolute", top: "5%", right: "5%" }} onClick={() => { { setStoreId([]), WebsocketService.sendMessage("start") } }}>Close</button>
              <h1>Titan watch</h1>
              <img src={item.link} alt="watch" width="200px" height="200px" />
              <div>
                <ul>
                  <li>Color: Golden</li>
                  <li>warranty: 5 yaer</li>
                  <li>Price: $100</li>
                  <li>The main advantages of a titanium watch are its strength and lightweight. The titanium watch case won't crack. Can be exposed to saltwater without corroding. Titanium watches are comfortable to wear because they are light on the wrist.</li>
                </ul>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default RainCanvas;

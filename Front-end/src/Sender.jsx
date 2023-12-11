import React, { useEffect, useState } from 'react'
import WebsocketService from './webSocketService';

const Sender = () => {

    const [watchDetails, setWatchDetails] = useState({
        x: 0,
        totalDispaly: 1,
        link: ""
    });
    const [data, setData] = useState([]);

    const dataSend = () => {
        // details of watch
        const data = {
            id: Date.now(),
            displayWidth: 500,
            displayHeight: 300,
            watchHeight: 50,
            watchWidth: 50,
            x: Number(watchDetails.x),
            y: 0,
            link: watchDetails.link,
            totalDispaly: Number(watchDetails.totalDispaly),
            currScreen: 1,
        }

        setData(prev => [...prev, data]);
        WebsocketService.sendMessage(data)
        setWatchDetails({
            x: 0,
            totalDispaly: Number(watchDetails.totalDispaly),
            link: ""
        })
    }

    useEffect(() => {
        WebsocketService.init('sender');

        return () => {
            WebsocketService.close();
        };
    }, []);

    return (
        <>
            <div style={{ display: "flex", justifyContent: 'space-around' }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                    <h1>
                        Add Watched in Display
                    </h1>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                        <label>
                            Total display: &nbsp;
                            <input type="text" onChange={(e) => setWatchDetails((prev) => ({ ...prev, totalDispaly: e.target.value }))} value={watchDetails.totalDispaly} placeholder='Total display' />
                        </label>
                        <label>
                            X position on display: &nbsp;
                            <input type="text" onChange={(e) => setWatchDetails((prev) => ({ ...prev, x: e.target.value }))} value={watchDetails.x} placeholder='Enter x position' />
                        </label>
                        <label>
                            Link the watch image: &nbsp;
                            <input type="text" onChange={(e) => setWatchDetails((prev) => ({ ...prev, link: e.target.value }))} value={watchDetails.link} placeholder='Enter watch Link' />
                        </label>
                        <button onClick={dataSend}>Add</button>
                    </div>
                </div>
                <div>
                    <h1>Collations List</h1>
                    <ul>
                        <li>https://5.imimg.com/data5/BJ/MP/GLADMIN-3323699/ne9234sl02j-titan.png</li>
                        <li>https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71O4xamlfQL._SY550_.jpg</li>
                        <li>https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/81VpBt997FL._SY679_.jpg</li>
                        <li>https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71jjLQZO+pL._SX679_.jpg</li>
                        <li>https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71Nm-LSUkeL._AC_UL480_FMwebp_QL65_.jpg</li>
                        <li>https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/71Bhl3BWf2L._AC_UL480_FMwebp_QL65_.jpg</li>
                        <li>https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51IwtamjQzL._AC_UL480_FMwebp_QL65_.jpg</li>
                        <li>https://m.media-amazon.com/images/W/MEDIAX_792452-T2/images/I/51K6tEnGX-L._AC_UL480_FMwebp_QL65_.jpg</li>
                    </ul>
                </div>


            </div>
            <div>
                <ul>
                    {data.map((item, id) => {
                        return (
                            <li>
                                Position: {item.x}
                                <div
                                    key={id}
                                    id="watch-1"
                                    style={{
                                        width: "50px",
                                        height: "50px",
                                        background: `url("${item.link}")`,
                                        backgroundAttachment: "attached",
                                        backgroundSize: "contain",
                                        backgroundRepeat: "no-repeat"
                                    }}
                                ></div>
                            </li>
                        )
                    })}
                </ul>
            </div>
        </>
    )
}

export default Sender
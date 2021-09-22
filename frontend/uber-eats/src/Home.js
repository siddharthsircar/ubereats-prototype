import React, { useState, useEffect, useRef } from "react";
import 'tachyons';
import Addressbar from "./components/Addressbar/Addressbar";
import Menu from "./components/Navigation/Menu/Menu";
import Navigation from "./components/Navigation/Navigation";
import './Home.css';

const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
        const listener = event => {
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mousedown', listener);
        return () => {
            document.removeEventListener('mousedown', listener);
        };
    },
        [ref, handler],
    );
};

const Home = () => {
    const [open, setOpen] = useState(false);
    const node = useRef();
    useOnClickOutside(node, () => setOpen(false))
    return (
        <div style={{ height: '100vh' }}>
            <div ref={node}>
                <Navigation open={open} setOpen={setOpen} />
                <Menu open={open} setOpen={setOpen} />
            </div>
            <div>
                <Addressbar />
            </div>

        </div>
    )
}

// Default when this file exports 1 thing.
export default Home;
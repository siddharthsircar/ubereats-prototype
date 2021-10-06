import React, { useState, useEffect, useRef } from "react";
import "tachyons";
import Menu from "../Navigation/Menu/Menu";
import Navigation from "../Navigation/Navigation";

const useOnClickOutside = (ref, handler) => {
  useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener("mousedown", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
    };
  }, [ref, handler]);
};

const NavBar = () => {
  const [open, setOpen] = useState(false);
  const node = useRef();

  const [showSummary, setshowSummary] = useState(false);
  const handleClose = () => setshowSummary(false);
  const handleShow = () => setshowSummary(true);

  useOnClickOutside(node, () => setOpen(false));
  return (
    <div>
      <div ref={node}>
        <Navigation
          open={open}
          setOpen={setOpen}
          summary={showSummary}
          openSummary={handleShow}
          closeSummary={handleClose}
        />
        <Menu open={open} setOpen={setOpen} />
      </div>
    </div>
  );
};

// Default when this file exports 1 thing.
export default NavBar;

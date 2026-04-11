import { jsx as _jsx } from "react/jsx-runtime";
const NavBar = () => {
    // This turned out not to be the quickest and easiest way to set up the Nav bar--but I am
    // not convinced that it won't work eventually, so I am leaving it in for now.
    return (_jsx("div", { children: _jsx("p", { children: "Nav Bar!" }) }));
};
export default NavBar;

import React from "react";
import dog from "../img/logo.png";


export default class LogoIcon extends React.PureComponent {
    render() {
        return <img src={dog} style={{height: "1rem"}} alt="Dog icon"/>
    }
}
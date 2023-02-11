import React from "react";
import { Menu } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css'
import Link from "next/link"

const Header = () => {
    return (
        <Menu style={{marginTop:'10px'}} >
            <Link href="/" >
                <a className="item" >CrowdCoin</a>
            </Link>
            <Menu.Menu position="right">
                <Link href="/" >
                    <a className="item" >Campaign</a>
                </Link>
                <Link href="/campaigns/new" >
                    <a className="item" >+</a>
                </Link>
            </Menu.Menu>
        </Menu>
    )
}
export default Header;
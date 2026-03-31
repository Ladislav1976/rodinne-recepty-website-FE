import { Outlet } from 'react-router-dom';
import RenderHeader from '../components/Header';
import '../index.css';

import { useState } from 'react';
import RenderFooter from '../components/RenderFooter';

const Layout2 = (props) => {
    const [toggle, setToggle] = useState(false);

    return (
        <div className={'pageLayout'}>
            <header>
                <RenderHeader toggle={[toggle, setToggle]} setErrMsg={props.setErrMsg} />
            </header>
            <main>
                <Outlet />
            </main>
            <footer>
                <RenderFooter />
            </footer>
        </div>
    );
};

export default Layout2;

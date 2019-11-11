import React from 'react';
// import './style.css';
import Header from '../Header';

function Layout(props) {
   return (
      <div>
         <Header />
         <div>{props.children}</div>

      </div>
   );
}

export default Layout;
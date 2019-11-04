import React from 'react';
// import './style.css';
import Header from './src/components/Header';
import Footer from './src/components/Footer';

function Layout() {
    return(
       <div>
          <Header />
             { this.props.children }
             /* anything else you want to appear on every page that uses this layout */
          <Footer />
       </div>
    );
}

export default Layout;
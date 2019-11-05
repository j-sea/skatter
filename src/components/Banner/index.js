import React from 'react';
import './style.css';

function Banner(props) {
    return (
       <div className="banner-style">
           <p className="banner-text">{props.bannerTitle}</p>
       </div>
    )
}

export default Banner;
import React from 'react';
import './style.css';

function Banner(props) {
    return (
       <div className="banner-style">
           <p>{props.bannerTitle}</p>
       </div>
    )
}

export default Banner;
import React from 'react';
import './style.css';

function Banner(props) {
    return (
        <div className="banner-style">
            {
                (props.canEdit)
                    ? <form>
                        <div className="form-group">
                            <input type="text" value={props.bannerTitle} className="form-test" id=""
                                placeholder="Group Title" />
                            <button type="submit" className="" >Add</button>
                        </div>
                    </form>
                    : <p className="banner-text">{props.bannerTitle}</p>
            }
        </div>
    )
}

export default Banner;

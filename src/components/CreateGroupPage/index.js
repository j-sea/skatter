import React from 'react';
import './style.css';
import Header from '../Header'
import Footer from '../Footer'
import SquareButton from '../SquareButton';
import Banner from '../Banner'
import ModalAdd from '../ModalAddPerson';
import ModalDropPin from '../ModalDropPin';

class CreateGroupPage extends React.Component {
    // handleSubmit = submitEvent => {
    // 	submitEvent.preventDefault();
    // 	this.props.handleLogOut();
    // };

    render() {
        return (
            <div>
                <Header />
                <br />
                <Banner bannerTitle="" canEdit={true}/>
                <br />


                {/* This button when clicked should prompt add person modal. When person added, new icon on group page should populate. */}
                <ModalAdd/>

                <br />

                <div className="content-box-style2">
                    <p className="description-title">Group Description :</p>
                    <form>
                        <div className="form-group">

                            <textarea className="form-test" id="" rows="5"
                                placeholder="Type your description here"></textarea>
                        </div>
                    </form>
                </div>

                <Banner bannerTitle="Points of interest to pin" />

                {/* This button when clicked should prompt drop pin modal. When pin added, new icon on group page should populate. */}
                <div className="pin-container">
                    <ModalDropPin/>

                </div>

                <br />

                <div className="bottom-container-test">
                    <div className="bottom-btn-container1">
                        {/* This button should take you back to the group management page */}
                        <SquareButton buttonTitle="Back to Groups" />
                    </div>

                    <div className="bottom-btn-container2">
                        {/* This button should create the group and populate a new button/icon on the group management page */}
                        <SquareButton buttonTitle="DONE" />
                    </div>
                </div>

                {/* <form onSubmit={this.handleSubmit}>
					<button type="submit">Log Out</button>
				</form> */}
                <Footer />
            </div>
        );
    }
}

export default CreateGroupPage;
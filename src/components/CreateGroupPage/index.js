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

    // const handleSubmit = submitEvent => {
    //     submitEvent.preventDefault();
    //     // This is for submitting the form
    // };

    // onSubmit={handleSubmit}

    render() {
        return (
            <div>
                <Header />
                <br />

                <br />

                <div className="add-person-container">
                    {/* This button when clicked should prompt add person modal. When person added, new icon on group page should populate. */}
                    <ModalAdd />
                </div>

                <br />

                <div className="content-box-style2">
                    <p className="description-title">Group Description :</p>
                    <form>
                        <div className="form-group">
                            <label htmlFor="formGroupExampleInput2"></label>
                            <input type="text" className="form-test1" id="" placeholder="Group name" data-length="20" />

                            <div class="form-group">
                                <label for="exampleFormControlTextarea1"></label>
                                <textarea class="form-test2" id="" rows="3" placeholder="Description"></textarea>
                            </div>

                            <input type="submit" style={{ position: 'absolute', left: -1000, top: -1000, visibility: 'hidden' }} />
                        </div>
                    </form>
                </div>

                <Banner bannerTitle="Points of interest to pin" />

                {/* This button when clicked should prompt drop pin modal. When pin added, new icon on group page should populate. */}
                <div className="pin-container">
                    <ModalDropPin />

                </div>

                <br />

                <div className="bottom-container-test">
                    <div className="bottom-btn-container1">
                        {/* This button should take you back to the group management page */}
                        <SquareButton buttonTitle="Back to Groups" />
                    </div>

                    <div className="bottom-btn-container2">
                        {/* This button should create the group and populate a new button/icon on the group management page */}
                        <SquareButton type="submit" buttonTitle="DONE" />
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
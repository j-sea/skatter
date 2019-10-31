import React, { Component } from 'react'
import FriendCard from "../FriendCard"

export default class GroupPage extends Component {
    state={
        friendInput:""
    }
    handleChange = event => {
        const {name, value} = event.target
        this.setState({[name]:value})
    }

    // when user hits submit send friend input to the api -api will need id of event and user input and friend input text
    handleSubmit = event => {
        event.preventDefault()
        console.log (this.state.friendInput)
    }

    render() {
        return (
            <div>
                <h1>this is typed and lives in GroupPage</h1>
                <FriendCard/>
                
                <div>
                    <h3> -Fairday- this is typed and lives in GroupPage</h3>
                    <p> -lorem alsfje aoie focas jefoa jiewfcowe fow efo oef oeif oerif eorijf oeoer osijv;ods jvsdve - this is typed and lives in GroupPage</p>
                    <form>
                        <input type="text" name="friendInput" value = {this.state.friendInput} onChange={this.handleChange}/>
                        <button onClick={this.handleSubmit}>Submit - this is typed and lives in GroupPage</button>
                    </form>
                    {this.state.friendInput}
                </div>




            </div>
        )
    }
}

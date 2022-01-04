import React, { Component } from 'react'
import man from '../../../assets/images/user_avatar.png'

export class User_panel extends Component {
    render() {
        return (
            <div>
                <div className="sidebar-user text-center">
                    <div><img className="img-60 rounded-circle lazyloaded blur-up" src={man} alt="#" />
                    </div>
                    <h6 className="mt-3 f-14">Admin</h6>
                    <p>Super Admin.</p>
                </div>
            </div>
        )
    }
}

export default User_panel


import React, { Component } from 'react';
import "../assets/css/home.css"
function Home() {
    return (<>
        <div className='col-md-12 d-flex justify-content-center'>
            <div className=" p-3 text-center">
                <div className=' text-overlay'>
                    <h1 className='' >Private chat room</h1>
                    <h5 className=''>made by ARS</h5>
                    <div className='col-md-12 row m-0'>
                        <div className='col-md-6 pt-2 d-flex justify-content-center'>
                            <a href='/webcam' className='text dark col-md-12' style={{ textDecoration: "none" }}>
                                <button className='btn btn-outline-light col-md-12'>Video Call</button>
                            </a>
                        </div>
                        <div className='col-md-6 pt-2 d-flex justify-content-center'>
                            <a href='/chatroom' className='text dark col-md-12' style={{ textDecoration: "none" }}>
                                <button className='btn btn-outline-light col-md-12'>Chat room</button>
                            </a>
                        </div>
                        <div className='col-md-12 pt-2 d-flex justify-content-center'>
                            <a href='/runserver' className='text dark col-md-12' style={{ textDecoration: "none" }}>
                                <button className='btn btn-outline-light col-md-12'>Run Server</button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </>
    );
}

export default Home;
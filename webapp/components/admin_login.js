import React from 'react';

const AdminLoginForm = () => {
  return (
    <section className="position-relative py-4 py-xl-5 mt-3">
        <div className="container position-relative">
            <div className="row pb-3 mb-1">
                <div className="col-md-8 col-xl-6 text-center mx-auto">
                    <h2 className="text-primary"><strong>Welcome back!</strong></h2>
                </div>
            </div>
            <div className="login-card mt-4 mb-4" style={{ boxShadow: '0px 0px' }}>
                <img className="object-fit-fill profile-img-card" src="assets/img/profilepic.jpg" alt="Profile" />
                <p className="profile-name-card"> </p>
                <form className="form-signin">
                    <span className="reauth-email"> </span>
                    <input className="form-control" type="text" placeholder="Username" required />
                    <input className="form-control" type="password" id="inputPassword" required placeholder="Password" />
                    <div className="checkbox">
                        <div className="form-check mb-2 mt-2">
                            <input className="form-check-input" type="checkbox" id="formCheck-1" />
                            <label className="form-check-label" htmlFor="formCheck-1">Remember me</label>
                        </div>
                    </div>
                    <button className="btn btn-primary btn-lg d-block btn-signin w-100" type="submit">Sign in</button>
                </form>
            </div>
        </div>
    </section>
  );
};

export default AdminLoginForm;

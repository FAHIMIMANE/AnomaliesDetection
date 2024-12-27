import React from 'react';
import { FaBell } from 'react-icons/fa';

function MainContent() {
    return (
        <div className="container my-5">
            <h2 id="alerts" className="mb-4 text-center">Alerts</h2>
            <div className="row">
                <div className="col-md-4">
                    <div className="card text-center">
                        <div className="card-body">
                            <FaBell size={40} className="text-primary mb-3" />
                            <h5 className="card-title">List Alerts</h5>
                            <p className="card-text">This is the list alert section where alerts are displayed.</p>
                        </div>
                    </div>
                </div>
            </div>

            <h2 id="sections" className="mt-5 mb-4 text-center">Sections</h2>
            <div className="row">
                <div className="col-md-6">
                    <div className="card border-warning">
                        <div className="card-header bg-warning text-white">Section 1</div>
                        <div className="card-body">Details for Section 1.</div>
                    </div>
                </div>
                <div className="col-md-6">
                    <div className="card border-info">
                        <div className="card-header bg-info text-white">Section 2</div>
                        <div className="card-body">Details for Section 2.</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MainContent;

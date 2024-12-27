import React from 'react';
import { FaBell, FaChartBar, FaDatabase } from 'react-icons/fa';

function Features() {
    return (
        <div id="features" className="container my-5">
            <h2 className="text-center mb-4">Features</h2>
            <div className="row text-center">
                <div className="col-md-4">
                    <div className="card p-4">
                        <FaBell size={50} className="text-primary mb-3" />
                        <h5>Real-time Alerts</h5>
                        <p>Stay updated with instant notifications and alerts.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-4">
                        <FaChartBar size={50} className="text-success mb-3" />
                        <h5>Data Visualization</h5>
                        <p>Interactive charts and graphs to analyze your data.</p>
                    </div>
                </div>
                <div className="col-md-4">
                    <div className="card p-4">
                        <FaDatabase size={50} className="text-info mb-3" />
                        <h5>Data Management</h5>
                        <p>Efficiently organize and manage all your data.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Features;

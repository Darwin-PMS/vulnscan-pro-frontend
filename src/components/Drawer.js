import React from 'react';
import { X } from 'lucide-react';

const Drawer = ({ isOpen, onClose, title, icon: Icon, children, footer }) => {
    if (!isOpen) return null;

    return (
        <>
            <div className="drawer-overlay" onClick={onClose} />
            <div className="drawer">
                <div className="drawer-header">
                    <h3>
                        {Icon && <Icon size={20} />}
                        {title}
                    </h3>
                    <button className="drawer-close" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>
                <div className="drawer-body">
                    {children}
                </div>
                {footer && (
                    <div className="drawer-footer">
                        {footer}
                    </div>
                )}
            </div>
        </>
    );
};

export default Drawer;

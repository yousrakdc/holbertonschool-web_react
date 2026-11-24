import React from 'react';
import BodySection from '../BodySection/BodySection';

const BodySectionWithMargin = ({ title, children }) => (
  <div className="bodySectionWithMargin mb-10">
    <BodySection title={title}>{children}</BodySection>
  </div>
);

export default BodySectionWithMargin;

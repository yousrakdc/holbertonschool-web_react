import { Component } from 'react'
import './BodySectionWithMarginBottom.css'
import BodySection from './BodySection'

class BodySectionWithMarginBottom extends Component {
    render() {
        return (
            <div className="bodySectionWithMargin">
                <BodySection {...this.props} />
            </div>
        )
    }
}

export default BodySectionWithMarginBottom

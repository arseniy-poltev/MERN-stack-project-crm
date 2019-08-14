import React, {PureComponent} from 'react'
import {Row, Col, Label, Input, Card, CardHeader, CardBody} from 'reactstrap'

import API from './API'

class PageExitInterview extends PureComponent {

  constructor(props){

    super(props);

    this.state = {}
    
  }

  handleChangeEvent = (event) => {

    let key = event.target.name

    let value = event.target.value

    API.updateEmployee(this.props.match.params.id, {[key]: value})

    this.setState(Object.assign(this.state.data, {[key]: value}))

  }

  componentWillMount(){

    API.fetchEmployee(this.props.match.params.id)
    .then(res => {

      this.data = JSON.parse(JSON.stringify(res.data))

      this.setState({data: res.data})

    })

  }

  togglePopover = (name) => {

    let key = `popover${name}`

    this.setState({[key]: !this.state[key]})

  }

  render() {

    let data = this.state.data

    if (!data) return (<div></div>)

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl="10">
            <h1>{data.firstName + ' ' + data.lastName} Exit Interview</h1>
            {/* <div className="font-italic">OBJECTIVE: The objective of the phone screen is NOT to gather all information neccessary to make a final hiring decision. The objective is to gather basic information on the job candidate. </div> */}
            {/* <div className="font-italic">PROCEDURE: The specific phone screen questions should be asked exactly as they are worded. Phone screens must be limited to 10 minutes. <span className="text-warning">Follow the colored prompts below.</span></div> */}


            <Card default="Introduction">
              <CardHeader label="Introduction">
                Interview Questions
              </CardHeader>
              <CardBody>
                <Label>HELP: An exit interview is a special inteview held with an employee who is about to leave the organization. It is an opportunity for a) the organization to better understand the employee's reason for leaving the company b) the organization to take corrective action to improve the employment experience for other current and future employees and c) to ensure that the employee and organization are parting on good terms. The exiting employee should feel open to share feedback freely and with judgment or correction. The interviewer should make a concerted effort to accept feedback, especially negative feedback, without argument. Findings of the interview should be discussed in subsequent staff meetings.</Label>
                <Label htmlFor="date-input">Interview Date</Label>
                <Input type="date" id="date-input" name="exitInterviewDate" placeholder="date" value={data.exitInterviewDate} onChange={this.handleChangeEvent} />
                <h5 className="text-warning">"Tell me something brief about each of the customers you've worked with."</h5>
                <Input type='textarea' name="exitInterviewServiceReview" value={data.exitInterviewServiceReview} placeholder="Write response here..." onChange={this.handleChangeEvent} />
                <h5 className="text-warning">"Will you confirm, when is your last working day with us?"</h5>
                <Input type='textarea' name="exitInterviewLastDayConfirmation" value={data.exitInterviewLastDayConfirmation} placeholder="Write response here..." onChange={this.handleChangeEvent} />
                <h5 className="text-warning">"Why are you leaving? &lt;be sure to repeatedly ask, "is there anything else?" to determine if there are multiple reasons for the candidate leaving&gt;"</h5>
                <Input type='textarea' name="exitInterviewReasonForLeaving" value={data.exitInterviewReasonForLeaving} placeholder="Write response here..." onChange={this.handleChangeEvent} />
                <h5 className="text-warning">"What did you like about working here?"</h5>
                <Input type='textarea' name="exitInterviewPositiveFeedback" value={data.exitInterviewPositiveFeedback} placeholder="Write response here..." onChange={this.handleChangeEvent} />
                <h5 className="text-warning">"What did you not like about working here or what do you think we could do better? &lt;restate in your own words any feedback and do not argue&gt;"</h5>
                <Input type='textarea' name="exitInterviewNegativeFeedback" value={data.exitInterviewNegativeFeedback} placeholder="Write response here..." onChange={this.handleChangeEvent} />
                <h5 className="text-warning">"Thank you for your feedback. We'll do our best to learn from your input. Thank you."</h5>
                <h5 className="text-warning">"How do we compare with other companies you've worked with, for better or worse?"</h5>
                <Input type='textarea' name="exitInterviewOtherFeedback" value={data.exitInterviewOtherFeedback} placeholder="Write response here..." onChange={this.handleChangeEvent} />
                <h5 className="text-warning">"What qualifications do you feel are most important that we look for in your replacement?"</h5>
                <Input type='textarea' name="exitInterviewReplacementGuidance" value={data.exitInterviewReplacementGuidance} placeholder="Write response here..." onChange={this.handleChangeEvent} />
                <h5 className="text-warning">"Thank you for your service. You've done a great job and your compassionate service has meant so much to us!"</h5>
                <h5 className="text-warning">"Would you be willing to give us a postitive review on one of our online review sites?"</h5>
                <h5 className="text-warning">"You can do that right here it will only take a couple minutes."</h5>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )

  }

}

export default PageExitInterview

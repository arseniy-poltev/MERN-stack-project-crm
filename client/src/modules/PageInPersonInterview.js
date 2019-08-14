import React, {PureComponent} from 'react'
import {Row, Col, Label, Popover, PopoverBody, Input} from 'reactstrap'

import ScheduleGraph from './ScheduleGraph'
import {AccordionCards, AccordionCard} from './AccordionCards' 
import API from './API'

class PageInPersonInterview extends PureComponent {

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

  handleAvailabilityChange = (availability) => {

    let data = Object.assign({}, this.state.data)

    data.availability = Object.assign([], availability)

    API.updateEmployee(this.props.match.params.id, {availability})

    this.setState({data})

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
            <h1>{data.firstName + ' ' + data.lastName} In-Person Interview</h1>
            {/* <div className="font-italic">OBJECTIVE: The objective of the phone screen is NOT to gather all information neccessary to make a final hiring decision. The objective is to gather basic information on the job candidate. </div> */}
            {/* <div className="font-italic">PROCEDURE: The specific phone screen questions should be asked exactly as they are worded. Phone screens must be limited to 10 minutes. <span className="text-warning">Follow the colored prompts below.</span></div> */}


            <AccordionCards default="Introduction">

              <AccordionCard label="Introduction">
                <Label>First Name</Label>
                <Input type='text' name="firstName" value={data.firstName} placeholder="Enter first name" onChange={this.handleChangeEvent} />
                <Label>Last Name</Label>
                <Input type='text' name="lastName" value={data.lastName} placeholder="Enter last name" onChange={this.handleChangeEvent} />
                <h5 className="text-warning">"Tell me a little about yourself."</h5>
                <Label>Personal Notes</Label>
                <Input type='textarea' name="personalNotes" value={data.personalNotes} placeholder="Personal notes..." onChange={this.handleChangeEvent} />
                <Label>Professional Experience</Label>
                <Input type='textarea' name="experienceNotes" value={data.experienceNotes} placeholder="Professional experience..." onChange={this.handleChangeEvent} />
                <Label>Availability Notes</Label>
                <Input type='textarea' name="availabilityNotes" value={data.availabilityNotes} placeholder="Availability notes..." onChange={this.handleChangeEvent} />
              </AccordionCard>
              <AccordionCard label="Interview Questions">
                <Label>Other Notes</Label>
                <div>
                  <div className="text-warning">What motivated you to take a career in caregiving?</div>
                  <div className="text-warning">What are your strengths?</div>
                  <div className="text-warning">What did you like most about your last position and what did you like the least?</div>
                  <div className="text-warning">Tell me about how you handle disagreements with your managers</div>
                  <div className="text-warning">Tell me how you handle working in a stressful environment or with a difficult customer?</div>
                  <div className="text-warning">What are your future goals?</div>
                  <div className="text-warning">Are we able to phone any or all of your previous employers and would they have positive feedback?</div>
                </div>
                <Input type='textarea' rows="9" name="otherNotes" value={data.otherNotes} placeholder="Other notes..." onChange={this.handleChangeEvent} />
              </AccordionCard>

              <AccordionCard label="Availability">
                <div className="text-warning">Tell me about your availability.</div>
                <Label>Mark "green" the times available to work.</Label>
                <ScheduleGraph data={data.availability} onChange={this.handleAvailabilityChange} id="availability" onCall />
                <Label>Availability Notes</Label>
                <div>
                  <div className="text-warning">What do you do during the time that you are not available? <i className="fa fa-info-circle pointer" onClick={() => this.togglePopover('availabilityNotes')} id="popoveravailabilityNotes"></i></div>
                  <Popover placement="auto" target="popoveravailabilityNotes" isOpen={this.state.popoveravailabilityNotes} toggle={() => this.togglePopover('availabilityNotes')} >
                    <PopoverBody>
                      It is important to know how negotiable a person's unavailable time may be so that we can offer them the greatest opportunity to meet their scheduling expectations.
                    </PopoverBody>
                  </Popover>
                </div>
                <Input type='textarea' name="availabilityNotes" value={data.availabilityNotes} placeholder="Availability notes..." onChange={this.handleChangeEvent} />
              </AccordionCard>
{/* 
              <AccordionCard label="Assessment">
                <FormPhoneScreenAssessment data={data} />
              </AccordionCard>
 */}
            </AccordionCards>

          </Col>
        </Row>
      </div>
    )

  }

}

export default PageInPersonInterview

/*
Work History: dates, gaps, reason for leaving, pay, nature of work, name of reference


KEY EVALUATION CRITERIA (e.g. Katrina, Melissa, Eugene, Stormi, John, Esther, Gabbi, Maria)
  We need a grading algorithm. Each element should include 
    a) a title
    b) a description 
    c) a score between 1 and 5 
    d) a small notes/comments field limited to 150 char.
    
  General Eligibility (phone screen questions)
  Criminal History
  Stable Life Circumstances
  Emotional Maturity/Intelligence - Takes responsibility for 
    If an applicant talks about a failure, does the comment suggest an awareness of some personal responsibility for the episode, or does he or she simply blame others?
    When it comes to handling criticism, is the person able to acknowledge any shortcomings and keep things in perspective rather than becoming defensive and making excuses?
    What about teamwork? Can candidates describe how they have confronted simmering issues and helped to solve them with a team, or are the answers slanted more individually? Similarly, when talking about successes, do they acknowledge the contributions of others, or take all the credit?
    How does the applicant interact with you, the hiring manager? Does he or she engage in small talk, or steer clear of it?
    Do candidates seem genuinely interested in the job and the people they'll be working with? Or do you sense indifference?
    Do applicants communicate in terms that are easily understandable and show concessions to others, or do the answers suggest they may be tuned out emotionally and blind to needs and preferences that aren't their own?
    What about their body language? Does it indicate they're listening attentively -- or distracted?  

    Ask These 7 Interview Questions
      If you've previously reported to multiple supervisors at the same time, how did you get to know each person's preferences and juggle conflicting priorities?
      Tell me about a workplace conflict you were involved in, either with your peers or someone else in the company. How did you manage that conflict, and were you able to resolve it?
      Describe the most challenging supervisor you've ever worked with. What was the most difficult thing about that relationship from your perspective, and how did you manage it?
      What would a previous boss say is the area that you need to work on most? Have you taken steps to improve in this area, and if so, what have you tried to change?
      Tell me about a day when everything went wrong. How did you handle it?
      What type of working environment brings out your best performance? Your worst?
      If business priorities change, describe how you would help your team understand and carry out the shifted goals.

  Competency - Does the applicant seem confident in their ability to perform all aspects of the job they are applying for?
  Professional Appearance
  Professional Conduct
  Professional Reputation (i.e.  references)
  Language Proficiency/Accent
  Appreciative / Grateful for the Job
  Responsive (answers phone calls, arrives on time to intervivew, responds to emails)
  Integrity (e.g. gives employer 2 weeks notice)
  Coachability

  Personality
  Employment Stability/Dependability
  Employment Equity/Longevity

  Geography
  Availability
  Pay expectations
  Alergies


Negative comments about former employers, managers, or coworkers
concerns about reference checks
What was your favorite job and why?
where you want to be in 5 years
Last Phone Service Disconnect?
When was the last time you had an automotive accident?
How many accidents in the last n years?

Continuing education plans

***In-Person Interview (tab)
      { "type": "AppCard", "label": "In-Person Interview", "size": "small", "items": [
        { "type": "InputBlock", "label": "Family", "id": "family", "inputType": "textarea", "formText": `"Tell me about your family?"`}, 
        { "type": "InputBlock", "label": "Goals", "id": "goals", "inputType": "textarea", "formText": `"What are your career and personal goals for the next 5 years?"`}, 
        { "type": "InputBlock", "label": "Education", "id": "education", "inputType": "textarea", "formText": `"Describe your education."`}, 
        { "type": "InputBlock", "label": "Positive/Negative Qualities Notes", "id": "personalQualities", "inputType": "textarea", "formText": `Describe the candidates personality and positive and negative qualities.`}, 
        { "type": "AppTagBlock", "label": "Specific Positive Qualities", "id": "qualities", "items": [
          { "label": "Good Manners"},
          { "label": "Empathy"},
          { "label": "Active Listening"},
          { "label": "Relates to Others"},
          { "label": "Praising"},
          { "label": "Knows Room for Growth"},
          { "label": "Humility"},
          { "label": "Outgoing"},
          { "label": "Integrity"},
          { "label": "Gestures"},
          { "label": "Confident"},
          { "label": "Assertive"},
          { "label": "Kind"},
          { "label": "Punctual/Early"}
        ]},
        { "type": "AppTagBlock", "label": "Specific Negative Qualities", "id": "qualities", "items": [
          { "label": "Nervous Laughter"},
          { "label": "Does not Listen"},
          { "label": "Poor Eye Contact"},
          { "label": "Arrogance"},
          { "label": "Lacks Self-Awareness"},
          { "label": "High Maintenance"},
          { "label": "Negativity"},
          { "label": "Low Self-Esteem"},
          { "label": "Non-Commital"},
          { "label": "Withdrawn"},
          { "label": "Unprepared"},
          { "label": "Agitated"},
          { "label": "Hostility/Conflict"},
          { "label": "Defensive"},
          { "label": "Interrupts/Overbearing"}
        ]}
      ]}, 

*/
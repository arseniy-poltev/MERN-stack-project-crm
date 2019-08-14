/*
This may be replaced someday with https://github.com/bibekg/react-schedule-selector
*/
import React, {PureComponent} from 'react'
import classNames from 'classnames'
import {Table} from 'reactstrap'

let days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

class ScheduleGraph extends PureComponent {

  constructor(props){

    super(props)

    this.state = {
      prevPropData: props.data,
      data: (props.data && JSON.parse(JSON.stringify(props.data))) || [
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
        [false, false, false, false, false, false, false, ],
      ],
     mousedown: false
    }
  }

  onClick(rowKey, key){

    let data = this.state.data

    data[rowKey][key] = !data[rowKey][key]

    this.props.onChange(data)

    if (this.props.onUpdate) this.props.onUpdate((data) => {

    })
    
  }

  onTableClick(){

    let data = this.state.data

    let endState = !data[0][0]
    
    data.forEach((o, rowKey) => data[rowKey].forEach((o, key) => data[rowKey][key] = endState))

    this.props.onChange(data)

  }

  onColClick(rowKey, key){

    let data = this.state.data

    let endState = !data[0][key]

    data.forEach((o, rowKey) => data[rowKey][key] = endState)

    this.props.onChange(data)

  }

  onRowClick(rowKey, key){

    let data = this.state.data

    let endState = !data[rowKey][0]

    data[rowKey].forEach((o, key) => data[rowKey][key] = endState)

    this.props.onChange(data)

  }

  onRangeUpdate(rowKey, key){

    if (!this.state.mousedown) return

    let rowKeyMin = Math.min(rowKey, this.state.rangeStart.rowKey)
    let rowKeyMax = Math.max(rowKey, this.state.rangeStart.rowKey)
    let keyMin = Math.min(key, this.state.rangeStart.key)
    let keyMax = Math.max(key, this.state.rangeStart.key)

    let data = JSON.parse(JSON.stringify(this.state.rangeOriginalStateData))

    for (let i = rowKeyMin; i <= rowKeyMax; i++){

      for (let j = keyMin; j <= keyMax; j++){

        data[i][j] = this.state.rangeEndState

      }

    }

    this.setState({data})

  }

  onMouseOver(...args){

    this.onRangeUpdate(...args)

  }

  onMouseOut(...args){
    
    this.onRangeUpdate(...args)

  }

  onMouseDown(rowKey, key){

    this.setState({
      mousedown: true, 
      rangeStart: {rowKey, key}, 
      rangeEndState: !this.state.data[rowKey][key], 
      rangeOriginalStateData: JSON.parse(JSON.stringify(this.state.data))
    })

  }

  onMouseUp(){

    this.setState({mousedown: false})

    this.props.onChange(this.state.data)

  }

  getDayName(i){

    return days[i]

  }

  static getDerivedStateFromProps(nextProps, prevState){

    if(JSON.stringify(nextProps.data) !== JSON.stringify(prevState.prevPropData)){
      return { data: nextProps.data, prevPropData: nextProps.data};
    }
    else return null;
  }

  render(){

    let data = this.state.data

    if (!data) return (<div></div>)

    let totalHours = 0
    
    for (let arr = 0; arr < data.length-2; arr++){

      for (let value of data[arr]){

        if (value) totalHours++

      }

    }

    let rows = Array(16 + ((this.props.onCall && 1) || 0)).fill(true)

    let columns = Array(8).fill(true)

    return (

      <div className="horizontal-container">
        Total Hours: {totalHours}
        <Table bordered striped size="sm" className="pointer">
          <tbody>
            { rows.map((o, rowKey) => {
              return (
                <tr key={rowKey}>
                  { columns.map((o, key) => {
                    if (rowKey === 0 && key === 0){
                      // return the key cell in the top left corner
                      let style = {width: "50px"}
                      return (
                        <th key={key} onClick={() => this.onTableClick()} className="text-center" style={style}>Time</th>
                      )
                    } else if (rowKey === 0){
                      // return a header row with a day name
                      let style = {width: "100px"}
                      return (
                        <th key={key} onClick={() => this.onColClick(rowKey-1, key-1)} className="text-center" style={style}>{this.getDayName(key-1)}</th>
                      )
                    } else if (key === 0) {
                      // return the vertical header, i.e. time of day
                      let timeString = ('0' + (600 + (rowKey * 100)).toString()).slice(-4)
                      if (rowKey === data.length-1) timeString = "OVN"
                      if (rowKey === data.length) timeString = "OC"
                      return (
                        <td key={key} onClick={() => this.onRowClick(rowKey-1)} className="text-center">{timeString}</td>
                      )
                    } else {
                      // return a regular cell
                      let properties = {
                        key,
                        className: classNames({
                          "available-cell": rowKey <= 14 && data[rowKey-1][key-1],
                          "available-alt-cell": rowKey > 14 && data[rowKey-1][key-1],
                          "text-center": true,
                          disabled: true
                        }),
                        onClick: () => this.onClick(rowKey-1, key-1),
                        onMouseOver: () => this.onMouseOver(rowKey-1, key-1),
                        onMouseDown: () => this.onMouseDown(rowKey-1, key-1),
                        onMouseUp: () => this.onMouseUp(rowKey-1, key-1),
                        onMouseOut: () => this.onMouseOut(rowKey-1, key-1),
                      }
                      return (
                        <td {...properties}></td>
                      )
                    }
                  })}
                </tr>
              )
            })}
          </tbody>
        </Table>
      </div>

    )

  }

}

export default ScheduleGraph
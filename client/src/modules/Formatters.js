import React from 'react'

class Formatters {

  static dateFormatter(value){

    if (value) {

      let dateString = new Date(value).toLocaleDateString()
  
      return (
        <span> { dateString } </span>
      )
  
    }
  
  }

  static phoneLinkFormatter(value){

    if (value){

      return (
        <a href={`tel:` + value} onClick={event => event.stopPropagation()}>{value}</a>
      )
  
    }
    
  }

  static emailLinkFormatter(value){

    if (value){

      return (
        <a href={`mailto:` + value} className='text-lowercase' onClick={event => event.stopPropagation()}>{value}</a>
      )
  
    }
  
  }

  static addressLinkFormatter(address, city, state, zip){

    if (address && city && state && zip) {

      let addressString = `${address}, ${city}, ${state} ${zip}`

      return (
        <a href={'https://www.google.com/maps/search/' + addressString} onClick={event => event.stopPropagation()} target='_blank' rel="noopener noreferrer">{addressString}</a>
      )

    }

  }

}

export default Formatters
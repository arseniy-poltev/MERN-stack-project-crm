import React from 'react'
import PropTypes from 'prop-types'
import {Pagination as BootstrapPagination, PaginationItem, PaginationLink} from 'reactstrap'

function pagination(current, last) {
  var range = ['«', '‹']
  for (let i = 1; i <= last; i++){
    if (i === current -1 
      || i === current -2 
      || i === current 
      || i === (current +1) 
      || i === (current +2)
      || (i === (current +3) && range.length < 7)
      || (i === (current +4) && range.length < 7)
    ) range.push(i)
  }
  range.push('›')
  range.push('»')

  return range
}


function Pagination (props) {

  let currentPage = props.currentPage

  let totalPages = Math.ceil(props.totalItems / props.pageSize)

  let arr = pagination(currentPage, totalPages)

  function handleClick (event){

    let page = event.target.getAttribute('page')

    switch(page){
      case '«': // first
        page = 1
        break
      case '‹': // previous
        page = Math.max(1, currentPage - 1)
        break
      case '›': // next
        page = Math.min(totalPages, currentPage + 1)
        break
      case '»': // last
        page = totalPages
        break
      default:
        break
    }

    let skip = (page-1) * props.pageSize

    if (props.onClick) props.onClick({page, skip})

  }

  return (
    <BootstrapPagination className="pull-right" size="sm">
      {arr.map((o, i) => {
        return (
          <PaginationItem key={i} active={o === currentPage} onClick={handleClick}>
            <PaginationLink tag="button" page={o}>{o}</PaginationLink>
          </PaginationItem>
        )
      })}
    </BootstrapPagination>  
  )

}

Pagination.propTypes = {
  totalItems: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
}

export default Pagination
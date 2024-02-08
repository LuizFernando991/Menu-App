import { FC } from 'react'
import usePagination from '../../hooks/usePagination'
import './pagination.styles.scss'

type PaginationPropsType = {
  onPageChange(number: number): void
  totalCount: number
  siblingCount?: number
  currentPage: number
}

const Pagination: FC<PaginationPropsType> = ({
  onPageChange,
  totalCount,
  siblingCount = 2,
  currentPage
}) => {
  const paginationRange = usePagination({
    currentPage,
    totalCount,
    siblingCount
  })
  if (currentPage === 0 || !paginationRange || paginationRange.length < 2) {
    return null
  }

  const onNext = () => {
    onPageChange(currentPage + 1)
  }

  const onPrevious = () => {
    onPageChange(currentPage - 1)
  }

  const lastPage = paginationRange[paginationRange.length - 1]
  return (
    <ul className="pagination-container">
      <li
        className={`pagination-item ${currentPage === 1 ? 'disabled' : ''}`}
        onClick={onPrevious}
      >
        <div className="arrow left" />
      </li>
      {paginationRange.map((pageNumber) => {
        // Render our Page Pills
        return (
          <li
            key={pageNumber}
            className={`pagination-item ${pageNumber === currentPage ? 'selected' : ''}`}
            onClick={
              typeof pageNumber === 'number'
                ? () => onPageChange(pageNumber)
                : () => {}
            }
          >
            {pageNumber}
          </li>
        )
      })}
      <li
        className={`pagination-item ${currentPage === lastPage ? 'disabled' : ''}`}
        onClick={onNext}
      >
        <div className="arrow right" />
      </li>
    </ul>
  )
}

export default Pagination
